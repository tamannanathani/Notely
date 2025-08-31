import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignupPage(){
    const [form,setForm]=useState({username:"",email:"",password:""})
    const [error,setError]=useState("");
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
    e.preventDefault();
    setError("")
try{
    const res=await axios.post("http://localhost:5000/api/auth/signup",form);
    localStorage.setItem("token",res.data.token);
    navigate("/notes")
}catch(error){
    setError(error.response?.data?.error||"SignUp failed")
}
  };
    return(
        <div style={{ padding: "10px" }}>
            <h1>SignUp</h1>
            <form onSubmit={handleSubmit}>
                <input type="text"
                placeholder="Enter username"
                value={form.username}
                onChange={(e)=>setForm({...form,username:e.target.value})}
                required
                ></input>
                <br></br><br></br>
               
                <input type="email"
                placeholder="Enter email"
                value={form.email}
                onChange={(e)=>setForm({...form,email:e.target.value})}
                required
                ></input>
                <br></br><br></br>

                 <input type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={(e)=>setForm({...form,password:e.target.value})}
                required
                ></input>
                <br></br><br></br>
                <button type="submit">SignUp</button>
            </form>
        </div>
    )
}