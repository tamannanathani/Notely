import { Link, useNavigate } from "react-router-dom";
import Button from "./ui/Button";

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
    <nav className="bg-white shadow-md border-b-2 border-primary-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
            Notely
          </Link>
          {token && (
            <Link to="/notes" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              My Notes
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {token ? (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                title={user?.username}
              >
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt={user?.username}
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary-600"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                    {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
