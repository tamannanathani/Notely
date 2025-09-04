import mongoose from "mongoose";


const userSchema= new mongoose.Schema({
    username:{
        type: "String",
        required:true
    },
    email:{
        type:"String",
        required:true,
        lowercase:true,
        unique:true,
    },
    password:{
        type: "String",
        required:true
    },
  profilePic:{
    type: String,
    default: ""
  },
  
},{timeStamp:true})
export default mongoose.model("User",userSchema)

