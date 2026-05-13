import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/me");
        console.log("Profile data from backend:", res.data);
        setUser(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchProfile();
    }, []);

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      );
    }

    if (!user) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card>
            <p className="text-gray-600">Failed to load profile</p>
          </Card>
        </div>
      );
    }

    // Days active = today - createdAt
    const daysActive = Math.floor(
      (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
    );

    const handleDeleteAccount = async () => {
      if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        return;
      }

      try {
        await api.delete("/users/me");
        localStorage.removeItem("token");
        alert("Account deleted successfully");
        navigate("/signup");
      } catch (err) {
        console.error(err);
        alert("Failed to delete account");
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            {/* Profile Header */}
            <div className="mb-8">
              {user.profilePic && (
                <img
                  src={user.profilePic}
                  alt={user.username}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-primary-100"
                />
              )}
              <h1 className="text-3xl font-bold text-primary-600 mb-2">{user.username}</h1>
              <p className="text-gray-600 text-sm">{user.email}</p>
              {user.dob && (
                <p className="text-gray-500 text-sm mt-1">DOB: {user.dob}</p>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8 py-6 border-y border-gray-200">
              <div>
                <div className="text-3xl font-bold text-primary-600">{user.notesCount || 0}</div>
                <p className="text-gray-600 text-sm mt-1">Total Notes</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600">{daysActive}</div>
                <p className="text-gray-600 text-sm mt-1">Days Active</p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mb-8">
              <Badge variant="success" size="lg">
                Active Member
              </Badge>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center flex-wrap">
              <Button 
                variant="secondary" 
                size="md"
                onClick={() => navigate("/notes")}
              >
                Back to Notes
              </Button>
              <Button 
                variant="danger" 
                size="md"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
}

