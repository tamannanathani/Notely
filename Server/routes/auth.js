import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.js"
import { signupSchema ,loginSchema} from "../validation/authSchema.js";
import isValidate from "../middleware/validate.js"
const router=express.Router();

router.post("/signup",isValidate(signupSchema),async(req,res)=>{
    try{
        const{username,email,password}=req.validated;
        const ifExists=await User.findOne({email});
        if(ifExists){
            return res.status(400).json({message:"account with this email already exists"})
        }
        const hashed=await bcrypt.hash(password,10);
        const  user=await User.create({username,email,password:hashed})

    const token=jwt.sign({
            id:user._id,
            email:user.email},
            process.env.JWT_SECRET,
            {expiresIn:process.env.JWT_EXPIRES}
        );
    res.status(200).json({message:"user has been created successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        },
        token
    })
    }catch(err){
        console.log("signup err",err)
        res.status(500).json({error:"signup failed"})
    }
})

router.post("/login",isValidate(loginSchema),async(req,res)=>{
    try{
        console.log(req.body)
        const{email,password}=req.validated;
        const user= await User.findOne({email});
        if(!user)
            return res.status(400).json({error:"user does not exists"});

        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch)
            return res.status(401).json({error:"incorrect credentials"});
        
        //jwt token generation
        const token=jwt.sign({
            id:user._id,
            email:user.email},
            process.env.JWT_SECRET,
            {expiresIn:process.env.JWT_EXPIRES}
        );
        res.status(200).json({
            message:"login successful",
            token
        })
    }catch(err){
        res.status(404).json({error:"login failed",err})
    }
})
export default router;