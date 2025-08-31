export default function errorHandler(err,req,res,next){
console.log(err.stack)
let statusCode=res.statusCode===200?500:res.statusCode;

res.status(statusCode).json({
    message:err.message||"server error",
    stack: process.env.NODE_ENV==="production"?null:err.stack
});
};