import mongoose from "mongoose";

const noteSchema=new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    default: "",
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag"
  }],
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    default: null
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  isTrashed: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: "default",
  },
  attachments: [{
    filename: String,
    mimeType: String,
    size: Number,
    importedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  }
}, { timestamps: true });

noteSchema.index({ user: 1, updatedAt: -1 });
noteSchema.index({ title: "text", content: "text", summary: "text" });

export default mongoose.model("Note",noteSchema)

