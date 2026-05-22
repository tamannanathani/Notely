import express from "express";
import multer from "multer";
import Note from "../models/notes.js";
import Folder from "../models/Folder.js";
import Tag from "../models/Tag.js";
import { protect } from "../middleware/auth.js";
import isValidate from "../middleware/validate.js";
import { noteSchema } from "../validation/notesSchema.js";
import { parseUploadedFile } from "../utils/fileParsers.js";
import {
  extractKeywordsFromText,
  generateTitleFromContent,
  summarizeText,
} from "../utils/aiTools.js";
import { storeNoteEmbedding, updateNoteEmbedding, deleteNoteEmbedding } from '../services/ragService.js';
const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

async function resolveTags(userId, tags = []) {
  const cleaned = [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
  const resolved = [];

  for (const name of cleaned) {
    let tag = await Tag.findOne({ user: userId, name });
    if (!tag) {
      tag = await Tag.create({ user: userId, name });
    }
    resolved.push(tag._id);
  }

  return resolved;
}

async function assertFolderOwnership(userId, folderId) {
  if (!folderId) return null;
  const folder = await Folder.findOne({ _id: folderId, user: userId });
  if (!folder) {
    return null;
  }
  return folder._id;
}

function buildListFilter(userId, query) {
  const { search, folderId, tag, pinned, view = "active" } = query;
  const filter = { user: userId };

  if (view === "archived") {
    filter.isArchived = true;
    filter.isTrashed = false;
  } else if (view === "trashed") {
    filter.isTrashed = true;
  } else if (view !== "all") {
    filter.isArchived = false;
    filter.isTrashed = false;
  }

  if (folderId) filter.folder = folderId;
  if (typeof pinned !== "undefined") filter.isPinned = pinned === "true";
  if (tag) filter.tags = tag;

  if (search?.trim()) {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [{ title: regex }, { content: regex }, { summary: regex }];
  }

  return filter;
}

function buildSort(sort = "updatedAt_desc") {
  const options = {
    updatedAt_desc: { isPinned: -1, updatedAt: -1 },
    updatedAt_asc: { isPinned: -1, updatedAt: 1 },
    createdAt_desc: { isPinned: -1, createdAt: -1 },
    title_asc: { isPinned: -1, title: 1 },
  };

  return options[sort] || options.updatedAt_desc;
}

async function populateNote(noteId) {
  return Note.findById(noteId).populate("tags", "name").populate("folder", "name color");
}

router.get("/stats", protect, async (req, res, next) => {
  try {
    const user = req.user.id;
    const [all, pinned, archived, trashed] = await Promise.all([
      Note.countDocuments({ user, isTrashed: false }),
      Note.countDocuments({ user, isPinned: true, isTrashed: false }),
      Note.countDocuments({ user, isArchived: true, isTrashed: false }),
      Note.countDocuments({ user, isTrashed: true }),
    ]);

    res.json({ all, pinned, archived, trashed });
  } catch (err) {
    next(err);
  }
});

router.get("/", protect, async (req, res, next) => {
  try {
    const notes = await Note.find(buildListFilter(req.user.id, req.query))
      .populate("tags", "name")
      .populate("folder", "name color")
      .sort(buildSort(req.query.sort));
    res.json(notes);
  } catch (err) {
    next(err);
  }
});

router.post("/", protect, isValidate(noteSchema), async (req, res, next) => {
  try {
    const {
      title,
      content,
      summary,
      color,
      folderId,
      isPinned = false,
      isArchived = false,
      isTrashed = false,
      tags = [],
    } = req.validated;

    const autoTags = tags.length ? tags : extractKeywordsFromText(content);
    const note = await Note.create({
      title: title || generateTitleFromContent(content),
      content,
      summary: summary || summarizeText(content),
      color: color || "default",
      folder: await assertFolderOwnership(req.user.id, folderId),
      tags: await resolveTags(req.user.id, autoTags),
      isPinned,
      isArchived,
      isTrashed,
      user: req.user.id,
    });
     // ✅ ADD THIS - Store embedding in background
    storeNoteEmbedding(note._id, note.title, note.content)
      .then(() => console.log(`✅ Embedding stored for new note: ${note._id}`))
      .catch(err => console.error(`❌ Failed to store embedding for ${note._id}:`, err));

    res.status(201).json(await populateNote(note._id));
  } catch (err) {
    next(err);
  }
});

router.post("/import", protect, upload.single("file"), async (req, res, next) => {
  try {
    const parsed = await parseUploadedFile(req.file);
    const tags = extractKeywordsFromText(parsed.content);

    const note = await Note.create({
      title: parsed.title || generateTitleFromContent(parsed.content),
      content: parsed.content,
      summary: summarizeText(parsed.content),
      tags: await resolveTags(req.user.id, tags),
      attachments: [
        {
          filename: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
        },
      ],
      user: req.user.id,
    });
    // ✅ ADD THIS - Store embedding for imported note
    storeNoteEmbedding(note._id, note.title, note.content)
      .then(() => console.log(`✅ Embedding stored for imported note: ${note._id}`))
      .catch(err => console.error(`❌ Failed to store embedding for ${note._id}:`, err));

    res.status(201).json(await populateNote(note._id));
  } catch (err) {
    next(err);
  }
});

router.get("/:id", protect, async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id })
      .populate("tags", "name")
      .populate("folder", "name color");

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", protect, isValidate(noteSchema), async (req, res, next) => {
  try {
    const {
      title,
      content,
      summary,
      color,
      folderId,
      isPinned = false,
      isArchived = false,
      isTrashed = false,
      tags = [],
    } = req.validated;

    const updated = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        title: title || generateTitleFromContent(content),
        content,
        summary: summary || summarizeText(content),
        color: color || "default",
        folder: await assertFolderOwnership(req.user.id, folderId),
        tags: await resolveTags(req.user.id, tags),
        isPinned,
        isArchived,
        isTrashed,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Note not found or not yours" });
    }
    // ✅ ADD THIS - Update embedding after note update
    updateNoteEmbedding(updated._id, updated.title, updated.content)
      .then(() => console.log(`✅ Embedding updated for note: ${updated._id}`))
      .catch(err => console.error(`❌ Failed to update embedding for ${updated._id}:`, err));

    res.json(await populateNote(updated._id));
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/pin", protect, async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ message: "Note not found" });
    note.isPinned = typeof req.body.isPinned === "boolean" ? req.body.isPinned : !note.isPinned;
    await note.save();
    res.json(await populateNote(note._id));
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/archive", protect, async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ message: "Note not found" });
    note.isArchived = typeof req.body.isArchived === "boolean" ? req.body.isArchived : !note.isArchived;
    note.isTrashed = false;
    await note.save();
    res.json(await populateNote(note._id));
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/trash", protect, async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ message: "Note not found" });
    note.isTrashed = typeof req.body.isTrashed === "boolean" ? req.body.isTrashed : true;
    if (note.isTrashed) note.isArchived = false;
    await note.save();
    res.json(await populateNote(note._id));
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/restore", protect, async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isTrashed: false },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(await populateNote(note._id));
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", protect, async (req, res, next) => {
  try {
    const deleted = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: "Note not found or not yours" });
    }
     // ✅ ADD THIS - Remove embedding when note is deleted
    deleteNoteEmbedding(req.params.id)
      .then(() => console.log(`✅ Embedding deleted for note: ${req.params.id}`))
      .catch(err => console.error(`❌ Failed to delete embedding for ${req.params.id}:`, err));
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
