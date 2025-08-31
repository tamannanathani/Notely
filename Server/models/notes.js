import mongoose, { Schema } from "mongoose";

const noteSchema=new mongoose.Schema({
     title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  }
});
export default mongoose.model("Note",noteSchema)

