import express from "express"
import cors from "cors"
import dotenv from "dotenv";
import mongoose from "mongoose";
import  notesRouter from "./routes/notes.js"
import authRouter from "./routes/auth.js"
import methodOverride from "method-override"


dotenv.config();


const app=express();
const PORT=process.env.PORT
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("mongoose is connected"))
.catch((err)=>console.log(err,"mongoose not connected"))


app.use("/api/notes/",notesRouter)
app.use("/api/auth",authRouter)



app.get("/",(req,res)=>{
    res.send("root route")
})
app.listen(PORT,()=>console.log("server is listening to port 5000"))
