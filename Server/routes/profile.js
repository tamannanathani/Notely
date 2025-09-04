import express from "express";
import{ protect} from "../middleware/auth.js";
import User from "../models/users.js";

const router = express.Router();
import Note from "../models/notes.js";
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // password hide
    if (!user) return res.status(404).json({ message: "User not found" });

    const notesCount = await Note.countDocuments({ user: req.user.id });

    res.json({
      username: user.username,
      email: user.email,
      profilePic: user.profilePic || "https://via.placeholder.com/150",
      createdAt: user.createdAt,
      notesCount
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
router.delete("/me", protect, async (req, res) => {
  try {
    await Note.deleteMany({ user: req.user.id });
    
    await User.findByIdAndDelete(req.user.id);

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
