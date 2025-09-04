import express from "express"
import cors from "cors"
import dotenv from "dotenv";
import mongoose from "mongoose";
import  notesRouter from "./routes/notes.js"
import userRouter from "./routes/profile.js"
import authRouter from "./routes/auth.js"
import methodOverride from "method-override"
import aiRouter from "./routes/ai.js";


dotenv.config();


const app=express();
const PORT=process.env.PORT


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.get("/",(req,res)=>{
    res.send("root route")
})

app.use("/api/notes/",notesRouter)
app.use("/api/auth",authRouter)
app.use("/api/users", userRouter);
app.use("/api/ai", aiRouter);


//error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong." });
});
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log(" MongoDB connected");
    app.listen(PORT, () =>
      console.log(` Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error(" MongoDB connection failed:", err.message);
  });

