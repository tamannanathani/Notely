import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function LoginPage(){
    const [form,setForm]=useState({email:"",password:""})
    const [error,setError]=useState("");
    const navigate = useNavigate();

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post("http://localhost:5000/api/auth/login", form);

      
      localStorage.setItem("token", res.data.token);

      alert("Login successful!");
      navigate("/notes"); 
    } catch (err) {
      alert("Login failed: " + err.response?.data?.message);
    }
  };

    return(
        <div style={{ padding: "10px" }}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>   
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
                <button type="submit">Login</button>
            </form>
        </div>
        )
    }