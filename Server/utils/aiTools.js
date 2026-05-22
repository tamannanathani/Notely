import axios from "axios";

// Use gemini-2.0-flash which is confirmed to work with your API key
const GEMINI_API_URL = 
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
  // Option 2: gemini-pro (Older but stable)
// const GEMINI_API_URL = 
//   "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

// Option 3: gemini-1.5-pro (More capable but might have limits)
// const GEMINI_API_URL = 
//   "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";


  // Add rate limiting

let lastCallTime = 0;
const MIN_DELAY = 3000; // 3 seconds between calls

const STOP_WORDS = new Set([
  "the", "and", "for", "that", "with", "this", "from", "have", "your", "into",
  "about", "would", "there", "their", "what", "when", "where", "which", "will",
  "been", "were", "them", "they", "then", "than", "because", "while", "after",
  "before", "these", "those", "also", "just", "like", "very", "some", "more",
  "most", "such", "each", "only", "over", "under", "onto", "between", "across",
  "note", "notes", "text", "title", "content", "summary"
]);

function normalizeOutput(text = "") {
  return text
    .replace(/^(Here's|Here is|Below is|The following is)(.*?)(version|note|text|answer)(:|\n)/i, "")
    .replace(/^(Sure|Certainly|Of course)(.*?)(:|\n)/i, "")
    .replace(/```(?:html|json|markdown|text)?/gi, "")
    .replace(/```/g, "")
    .trim();
}

// Helper function to wait
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export async function callGemini(prompt, { asJson = false } = {}) {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  // Try OpenRouter first (free, no rate limits)
  if (openRouterKey) {
    try {
      console.log("📡 Calling OpenRouter (Gemini 2.0 Flash)...");
      
      const response = await axios.post(
        OPENROUTER_URL,
        {
          model: "google/gemini-2.0-flash-001",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        },
        {
          headers: {
            "Authorization": `Bearer ${openRouterKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Notes App"
          },
          timeout: 30000
        }
      );

      const text = response.data?.choices?.[0]?.message?.content || "";
      console.log("✅ OpenRouter success! Response length:", text.length);
      return normalizeOutput(text);
      
    } catch (error) {
      console.log("⚠️ OpenRouter failed:", error.response?.status, error.message);
      // Fall back to Gemini direct if OpenRouter fails
    }
  }

  // Fall back to direct Gemini API
  if (geminiKey) {
    try {
      console.log("📡 Falling back to direct Gemini API...");
      
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        { timeout: 30000 }
      );

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      console.log("✅ Gemini API success!");
      return normalizeOutput(text);
      
    } catch (error) {
      console.log("❌ Gemini API also failed:", error.response?.status);
      return null;
    }
  }

  console.log("❌ No API keys available");
  return null;
}

export function summarizeText(content = "") {
  const plain = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!plain) return "";
  if (plain.length <= 180) return plain;

  const sentences = plain.match(/[^.!?]+[.!?]?/g) || [plain];
  const summary = sentences.slice(0, 2).join(" ").trim();
  return summary.slice(0, 260);
}

export function generateTitleFromContent(content = "") {
  const plain = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!plain) return "Untitled note";

  const firstSentence = (plain.match(/[^.!?\n]+/) || [plain])[0].trim();
  const words = firstSentence.split(/\s+/).slice(0, 7);
  const title = words.join(" ").replace(/[,:;]+$/, "");
  return title ? title.charAt(0).toUpperCase() + title.slice(1) : "Untitled note";
}

export function extractKeywordsFromText(content = "", limit = 5) {
  const counts = new Map();
  const tokens = content
    .toLowerCase()
    .replace(/<[^>]*>/g, " ")
    .match(/[a-z][a-z0-9-]{2,}/g) || [];

  for (const token of tokens) {
    if (STOP_WORDS.has(token)) continue;
    counts.set(token, (counts.get(token) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

export function answerQuestionFromNotes(question = "", notes = []) {
  const lowered = question.toLowerCase();
  const matches = notes
    .map((note) => {
      const haystack = `${note.title} ${note.content} ${note.summary || ""}`.toLowerCase();
      const score = lowered.split(/\s+/).filter((token) => token && haystack.includes(token)).length;
      return { note, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (!matches.length) {
    return "I could not find a strong match in your saved notes yet. Try asking with more specific words from the note.";
  }

  return matches
    .map(({ note }) => {
      const source = summarizeText(note.content || note.summary || "");
      return `${note.title}: ${source}`;
    })
    .join("\n\n");
}
