import express from "express";
import Note from "../models/notes.js";
import Tag from "../models/Tag.js";
import { protect } from "../middleware/auth.js";
import {
  answerQuestionFromNotes,
  callGemini,
  extractKeywordsFromText,
  generateTitleFromContent,
  summarizeText,
} from "../utils/aiTools.js";
import {
  storeNoteEmbedding,
  checkPineconeHealth,
} from "../services/ragService.js";

const router = express.Router();

const ENHANCE_PROMPT =
 `You are an expert content enhancer and note-taking assistant. Your task is to SIGNIFICANTLY expand and improve the given note while maintaining its core message. 

Follow these rules strictly:
1. EXPAND the content - add relevant details, examples, explanations, and context
2. Make the note at least 3-5 times LONGER than the original
3. Add practical examples, use cases, or real-world applications
4. Include statistics, facts, or data points where relevant (make them realistic)
5. Structure with clear headings (H2), subheadings (H3), and bullet points
6. Add a "Key Takeaways" section at the end
7. Add a "Further Reading" or "Related Topics" section
8. Use professional but engaging language
9. Keep all original key points but elaborate on each one
10. Format with proper paragraphs, not just bullet points

IMPORTANT: Do NOT just reformat. SIGNIFICANTLY expand with new, relevant information.

Original note:`;

async function findOwnedNote(userId, noteId) {
  return Note.findOne({ _id: noteId, user: userId }).populate("tags", "name");
}

function cleanPlainText(value = "") {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

router.post("/enhance", protect, async (req, res) => {
   console.log('📝 Enhance request received for note:', req.body.noteId);
  console.log('👤 User:', req.user.id);
  try {
    const note = await findOwnedNote(req.user.id, req.body.noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const enhancedNote =
      (await callGemini(`${ENHANCE_PROMPT}\n\n${note.content}`)) ||
      `${note.content}\n\nSummary:\n${summarizeText(note.content)}`;

    res.json({ enhancedNote });
  } catch (err) {
    res.status(500).json({ message: `Failed to enhance note: ${err.message}` });
  }
});

router.post("/summarize", protect, async (req, res) => {
   console.log('📝 Summarize request received for note:', req.body.noteId);
  console.log('👤 User:', req.user.id);
  try {
    const note = await findOwnedNote(req.user.id, req.body.noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const summary = cleanPlainText(
      (await callGemini(`Summarize this note in 2 concise sentences:\n\n${note.content}`)) ||
      summarizeText(note.content)
    );

    note.summary = summary;
    await note.save();
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ message: `Failed to summarize note: ${err.message}` });
  }
});

router.post("/title", protect, async (req, res) => {
  console.log('📝 Title request received for note:', req.body.noteId);
  console.log('👤 User:', req.user.id);
  try {
    const note = await findOwnedNote(req.user.id, req.body.noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const rawTitle = await callGemini(
      `Based on this note, output ONLY a single short title (3-7 words). Output plain text only, no formatting, no HTML, no markdown, no quotes.\n\nNote: ${note.content}`
    );

    // AGGRESSIVE CLEANING
    let cleanTitle = rawTitle || "";
    
    // Strip EVERYTHING except plain text
    cleanTitle = cleanTitle
      .replace(/<[^>]*>/g, ' ')           // Remove ALL HTML tags
      .replace(/```[^`]*```/g, '')        // Remove code blocks
      .replace(/`[^`]*`/g, '')            // Remove inline code
      .replace(/[*_~#]/g, '')             // Remove markdown chars
      .replace(/["""'']/g, '')           // Remove all types of quotes
      .replace(/[-•●○▪▸►]/g, '')         // Remove bullet characters
      .replace(/\n/g, ' ')                // Newlines to spaces
      .replace(/\s+/g, ' ')              // Normalize spaces
      .replace(/^(here are|here is|here's|options|title|suggestions)[\s:,-]*/i, '') // Remove intro phrases
      .trim();

    // If cleanTitle is empty or still has garbage, use fallback
    if (!cleanTitle || cleanTitle.length < 3 || cleanTitle.length > 100) {
      cleanTitle = generateTitleFromContent(note.content);
    }

    // Take only first line/sentence
    cleanTitle = cleanTitle.split(/[.\n]/)[0].trim();

    // Limit to 7 words max
    const words = cleanTitle.split(/\s+/);
    if (words.length > 7) {
      cleanTitle = words.slice(0, 7).join(' ');
    }

    // Final cleanup
    cleanTitle = cleanTitle
      .replace(/^[^a-zA-Z0-9]+/, '')  // Remove leading non-alphanumeric
      .replace(/[^a-zA-Z0-9\s-]+$/, '') // Remove trailing non-alphanumeric
      .trim();

    console.log('Raw title:', rawTitle);
    console.log('Clean title:', cleanTitle);

    note.title = cleanTitle || generateTitleFromContent(note.content);
    await note.save();
    
    res.json({ title: note.title });
  } catch (err) {
    res.status(500).json({ message: `Failed to generate title: ${err.message}` });
  }
});
router.post("/keywords", protect, async (req, res) => {
  console.log('📝 Keywords request received for note:', req.body.noteId);
  console.log('👤 User:', req.user.id);
  try {
    const note = await findOwnedNote(req.user.id, req.body.noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    let keywords = extractKeywordsFromText(note.content);
    const aiKeywords = await callGemini(
      `Extract up to 5 keywords from this note. Return comma-separated words only:\n\n${note.content}`
    );

    if (aiKeywords) {
      keywords = aiKeywords
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 5);
    }

    const tagIds = [];
    for (const name of keywords) {
      let tag = await Tag.findOne({ user: req.user.id, name });
      if (!tag) tag = await Tag.create({ user: req.user.id, name });
      tagIds.push(tag._id);
    }

    note.tags = tagIds;
    await note.save();
    const updated = await findOwnedNote(req.user.id, note._id);
    res.json({ tags: updated.tags });
  } catch (err) {
    res.status(500).json({ message: `Failed to extract keywords: ${err.message}` });
  }
});

router.post("/ask", protect, async (req, res) => {
  console.log('📝 Ask request received for note:', req.body.noteId);
  console.log('👤 User:', req.user.id);
  try {
    const question = req.body.question?.trim();
    if (!question) return res.status(400).json({ message: "Question is required" });

    const notes = await Note.find({ user: req.user.id, isTrashed: false })
      .select("title content summary updatedAt")
      .sort({ updatedAt: -1 })
      .limit(12);

    const context = notes
      .map((note, index) => `Note ${index + 1} - ${note.title}\n${note.content}`)
      .join("\n\n");

    const answer =
      (context
        ? await callGemini(
            `Answer only from the notes below. If the answer is not present, say that clearly.
Return plain text only. Do not use HTML, XML, or markdown.

Question: ${question}

Notes:
${context}`
          )
        : null) || answerQuestionFromNotes(question, notes);

    res.json({ answer: cleanPlainText(answer) });
  } catch (err) {
    res.status(500).json({ message: `Failed to answer question: ${err.message}` });
  }
});

// In routes/ai.js or create routes/admin.js
router.post("/index-all-notes", protect, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id, isTrashed: false });
    
    console.log(`📚 Indexing ${notes.length} notes...`);
    
    let success = 0;
    let failed = 0;
    
    for (const note of notes) {
      const result = await storeNoteEmbedding(note._id, note.title, note.content);
      if (result) success++;
      else failed++;
      
      // Progress update
      console.log(`Progress: ${success + failed}/${notes.length}`);
    }
    
    res.json({
      message: `Indexed ${success} notes successfully, ${failed} failed`,
      total: notes.length,
      success,
      failed
    });
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/rag-health", protect, async (req, res) => {
  const health = await checkPineconeHealth();
  res.json(health);
});
router.post("/test-rag", protect, async (req, res) => {
  try {
    const { storeNoteEmbedding, searchSimilarNotes, checkPineconeHealth } = 
      await import('../services/ragService.js');
    
    // Test 1: Health
    const health = await checkPineconeHealth();
    
    // Test 2: Store
    const stored = await storeNoteEmbedding(
      "test-rag-001",
      "Machine Learning Basics",
      "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed."
    );
    
    // Test 3: Store another
    await storeNoteEmbedding(
      "test-rag-002", 
      "Deep Learning Applications",
      "Deep learning uses neural networks with multiple layers to analyze various factors of data. It's used in image recognition, natural language processing, and autonomous vehicles."
    );
    
    // Test 4: Search
    const results = await searchSimilarNotes("How does AI learn from data?", 3);
    
    res.json({
      success: true,
      health,
      stored,
      searchResults: results,
      message: "RAG is working! 🎉"
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});
// RAG-powered Ask endpoint
router.post("/ask-rag", protect, async (req, res) => {
  try {
    const question = req.body.question?.trim();
    if (!question) return res.status(400).json({ message: "Question is required" });

    console.log(`🤔 RAG Question: "${question}"`);
    
    // Dynamic import to avoid env loading issues
    const { searchSimilarNotes } = await import('../services/ragService.js');
    
    // Step 1: Search Pinecone for relevant notes
    const similarNotes = await searchSimilarNotes(question, 5);
    console.log(`📊 Found ${similarNotes.length} similar notes`);
    
    // Step 2: Filter by relevance score
    const relevantNotes = similarNotes.filter(n => n.score > 0.3);
    
    if (relevantNotes.length === 0) {
      return res.json({
        answer: "I couldn't find any notes relevant to your question. Try asking about a different topic or add more notes first.",
        method: "rag_no_results",
        sources: []
      });
    }

    console.log(`✅ ${relevantNotes.length} relevant notes (score > 0.3)`);
    
    // Step 3: Get full note content from MongoDB
    const noteIds = relevantNotes.map(n => n.noteId);
    const fullNotes = await Note.find({
      _id: { $in: noteIds },
      user: req.user.id
    }).select("title content summary");

    // Step 4: Build context from relevant notes only
    const context = fullNotes
      .map((note, i) => {
        const similarity = relevantNotes.find(n => n.noteId === note._id.toString());
        return `[Note ${i + 1}: "${note.title}" (Relevance: ${Math.round(similarity?.score * 100)}%)]\n${note.content}`;
      })
      .join("\n\n");

    // Step 5: Ask Gemini with focused context
    const prompt = `You are a helpful note assistant. Answer the question based ONLY on the notes provided below.
If the answer is not in the notes, say so clearly. Always cite which note you're getting information from.
Return plain text only. Do not use HTML, XML, or markdown tags, even if the notes contain HTML.

Question: ${question}

Your Relevant Notes:
${context}

Answer based on the notes above. Be specific and cite the note titles.`;

    const answer = cleanPlainText(await callGemini(prompt) || "");

    // Step 6: Return answer with sources
    res.json({
      answer: answer || "Could not generate answer from the notes.",
      method: "rag",
      sources: relevantNotes.map(n => ({
        title: n.title,
        relevance: Math.round(n.score * 100),
        preview: n.preview
      })),
      notesUsed: fullNotes.length
    });

  } catch (err) {
    console.error("❌ RAG Ask error:", err);
    res.status(500).json({ 
      message: `Failed to answer question: ${err.message}` 
    });
  }
});
export default router;
