import jwt from "jsonwebtoken";

export const protect=(req,res,next)=>{
    let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try{
            token=req.headers.authorization.split(" ")[1];
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=decoded;

            next();
        }catch(err){
            console.log(err);
            res.status(404).json({err:"not authorized"})
    }
}if(!token){
    return res.status(401).json({message:"not authorized,no token"})
}}