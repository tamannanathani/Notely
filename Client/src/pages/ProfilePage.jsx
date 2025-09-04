import { useEffect, useState } from "react";
import { Container, Typography, Avatar, Box, Grid, Paper, Button } from "@mui/material";
import api from "../services/api";

export default function ProfilePage() {
    const [user, setUser] = useState(null);

    const fetchProfile = async () => {
  try {
    const res = await api.get("/users/me");
    console.log("Profile data from backend:", res.data);
    setUser(res.data);
  } catch (err) {
    console.error(err);
    alert("Failed to load profile");
  }
};

  useEffect(() => {
    fetchProfile();
    }, []);
if (!user) return <Typography>Loading...</Typography>;

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
      navigate("/signup")
    } catch (err) {
      console.error(err);
      alert("Failed to delete account");
    }
  };
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
          <Avatar
            src={user.profilePic}
            alt="user.username"
            variant="circular"
            sx={{ width: 100, height: 100, mb: 2, objectFit:"cover"}}
          />
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#16918f" }}>
            {user.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">Email: 
         <i>{user.email}</i>
         </Typography>
          <Typography variant="body2" color="text.secondary">
            DOB: {user.dob}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper elevation={1} sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
              <Typography variant="h6">{user.notesCount}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Notes
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper elevation={1} sx={{ p: 2, textAlign: "center", borderRadius: 2,}}>
              <Typography variant="h6">{daysActive}</Typography>
              <Typography variant="body2" color="text.secondary">
                Days Active
              </Typography>
            </Paper></Grid>
            <Grid item xs={12}>
              <Paper elevation={1} sx={{p: 2,textAlign: "center",borderRadius: 2,bgcolor: "#fff5f5", 
              }}>
                <Button
                variant="contained"
                color="error"
                onClick={handleDeleteAccount}>
                  Delete Account
                  </Button>
                  </Paper>
                  </Grid>
          
        </Grid>
      </Paper>
    </Container>
  );
}

