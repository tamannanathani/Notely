import express, { Router } from "express";
import Note from "../models/notes.js";
import { protect } from "../middleware/auth.js";
import isValidate from "../middleware/validate.js";
import { noteSchema } from "../validation/notesSchema.js";
const router=express.Router();

//creating a new note
router.post("/",protect,isValidate(noteSchema),async(req,res,next)=>{
    try{
        const { title, content }=req.validated;
        const newNote= new Note({title,content,user:req.user.id})
        await newNote.save();
        res.status(201).json(newNote);
        
    }catch(err){
        next(err);
    }
})

//fetch all notes
router.get("/",protect,async(req,res,next)=>{
    try{
        const notes=await Note.find({user:req.user.id})
        res.json(notes)
    }catch(err){
        next(err);
    }
})

//get by id
router.get("/:id",protect, async (req,res,next)=>{
    try{
        const {id}=req.params;
        const note= await Note.findOne({_id:id,user:req.user.id});
        if(!note){
            res.status(404);
            throw new Error("note not found")
        
        }
        res.json(note);
    }catch(err){
        next(err)
    }
})

//get by serach, sorting,pagination
router.get("/search", protect, async (req, res, next) => {
  try {
    // Query params
    const { title, content, sort = "-createdAt", page = 1, limit = 10 } = req.query;

    // Ownership + search filters
    let filter = { user: req.user.id };
    if (title) filter.title = { $regex: title, $options: "i" };    // case-insensitive
    if (content) filter.content = { $regex: content, $options: "i" };

    // Sorting
    let sortOption = {};
    const order = sort.startsWith("-") ? -1 : 1;
    const field = sort.replace("-", "");
    sortOption[field] = order;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch notes
    const notes = await Note.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Note.countDocuments(filter);

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      notes,
    });
  } catch (err) {
    next(err);
  }
});


//update route
router.put("/:id",protect,isValidate(noteSchema),async(req,res,next)=>{
    try{
        const {id}=req.params;
        const{title,content}=req.validated;
        const updatedNote= await Note.findOneAndUpdate({_id:id, user:req.user.id},{title,content},{new:true})
        if (!updatedNote) {
      res.status(404);
      throw new Error("Note not found or not yours");
    }
        res.json(updatedNote);
    }catch(err){
       next(err)
    }
})

//delete route
router.delete("/:id" ,protect, async(req,res,next)=>{
    try{
        const {id}=req.params;
        const deleteNote=await Note.findOneAndDelete({_id:id,user:req.user.id});
       if (!deleteNote) {
        res.status(404);
        throw new Error("Note not found or not yours");
    }
    res.json({message:"deleted successfully"})
    }catch(err){
        next(err);
    }
})

export default router;
