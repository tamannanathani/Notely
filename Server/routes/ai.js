import express from "express";
import axios from "axios";
import Note from "../models/notes.js"; 
import { protect } from "../middleware/auth.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ENHANCE_PROMPT = `Improve clarity, organize with headings and lists, correct grammar, expand ~20–30%
without fabricating facts, preserve terminology, output HTML content only.`;

function cleanGeminiOutput(text) {
  return text
    .replace(/```html\s*/gi, '') // Remove ```html
    .replace(/```/g, '')         // Remove ```
    .replace(/<[^>]+>/g, '');    // Remove HTML tags
}

// Enhance note route
router.post("/enhance", protect, async (req, res) => {
  const { noteId } = req.body;
  if (!noteId) return res.status(400).json({ message: "Note ID is required" });

  try {
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // Call Gemini API
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          { parts: [{ text: `${ENHANCE_PROMPT}\n\n${note.content}` }] }
        ]
      }
    );

    const enhancedNoteHtml = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const enhancedNote = cleanGeminiOutput(enhancedNoteHtml); // Strip HTML tags

    // Save enhanced content
    note.content = enhancedNote;
    await note.save();

    res.json({ enhancedNote });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Failed to enhance note" });
  }
});

export default router;
