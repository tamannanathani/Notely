import dotenv from "dotenv";
dotenv.config();  // This MUST be first

import express from "express"
import cors from "cors"
import mongoose from "mongoose";
import notesRouter from "./routes/notes.js"
import userRouter from "./routes/profile.js"
import authRouter from "./routes/auth.js"
import methodOverride from "method-override"
import aiRouter from "./routes/ai.js";
import cookieParser from "cookie-parser";
import metaRouter from "./routes/meta.js";



const app=express();
const PORT=process.env.PORT
const allowedOrigins = (
  process.env.CLIENT_URLS ||
  process.env.CLIENT_URL ||
  "http://localhost:5173,http://localhost:5174",
  "https://notely-kohl-nine.vercel.app"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("root route")
})

app.use("/api/notes/",notesRouter)
app.use("/api/auth",authRouter)
app.use("/api/users", userRouter);
app.use("/api/ai", aiRouter);
app.use("/api/meta", metaRouter);


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

