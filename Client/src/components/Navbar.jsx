import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { Avatar, IconButton } from "@mui/material";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("profilePic");
    alert("Logged out successfully");
    navigate("/login");
  };

  const username = localStorage.getItem("username");
  const profilePic = localStorage.getItem("profilePic");
  const user = { username, profilePic };
  return (
    <nav className="navbar">

      <div className="nav-left">
        <Link to="/" className="nav-logo">Notely</Link>
        {token && <Link to="/notes" className="nav-link">My Notes</Link>}

      </div>
      
       <div className="nav-right">
    {token ? (
      <>
        <IconButton onClick={() => navigate("/profile")} sx={{ ml: 2 }}>
          <Avatar
            src={user?.profilePic || undefined}
            alt={user?.username ? user.username.charAt(0).toUpperCase() : "P"}
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#16918f",
              color: "white",
              fontWeight: "bold"
            }}
          >
            {user?.username ? user.username.charAt(0).toUpperCase() : "P"}
          </Avatar>
        </IconButton>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </>
    ) : (
      <>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/signup" className="nav-link">Signup</Link>
      </>
    )}
  </div>
    </nav>
  );
}
