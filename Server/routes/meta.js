import express from "express";
import Folder from "../models/Folder.js";
import Tag from "../models/Tag.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/folders", protect, async (req, res, next) => {
  try {
    const folders = await Folder.find({ user: req.user.id }).sort({ name: 1 });
    res.json(folders);
  } catch (err) {
    next(err);
  }
});

router.post("/folders", protect, async (req, res, next) => {
  try {
    const name = req.body.name?.trim();
    const color = req.body.color?.trim() || "#1d4ed8";

    if (!name) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    const existing = await Folder.findOne({ user: req.user.id, name });
    if (existing) return res.json(existing);

    const folder = await Folder.create({ name, color, user: req.user.id });
    res.status(201).json(folder);
  } catch (err) {
    next(err);
  }
});

router.delete("/folders/:id", protect, async (req, res, next) => {
  try {
    await Folder.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Folder deleted" });
  } catch (err) {
    next(err);
  }
});

router.get("/tags", protect, async (req, res, next) => {
  try {
    const tags = await Tag.find({ user: req.user.id }).sort({ name: 1 });
    res.json(tags);
  } catch (err) {
    next(err);
  }
});

router.post("/tags", protect, async (req, res, next) => {
  try {
    const name = req.body.name?.trim().toLowerCase();
    if (!name) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    const existing = await Tag.findOne({ user: req.user.id, name });
    if (existing) return res.json(existing);

    const tag = await Tag.create({ name, user: req.user.id });
    res.status(201).json(tag);
  } catch (err) {
    next(err);
  }
});

export default router;
