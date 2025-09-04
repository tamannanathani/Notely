import {Container, Typography, Button, Box} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"; // AI / sparkle
import SecurityIcon from "@mui/icons-material/Security"; // secure
import SpeedIcon from "@mui/icons-material/Speed"; // fast

export default function WelcomePage(){
    const navigate=useNavigate();
    return(
        <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        textAlign: "center",
        gap: 3,
      }}
    >
      <Typography
  variant="h2"
  sx={{
    fontWeight: "bold",
    fontFamily: "'Montserrat', sans-serif",
    letterSpacing: 1.5,
    textAlign: "center",
  }}
>
  Welcome to{" "}
  <Box
    component="span"
    sx={{
      background: "linear-gradient(90deg, #16918f, #12aeab)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontFamily:"Comic Sans MS, sans-serif"
    }}
  >
    Notely
  </Box>
</Typography>

      <Typography variant="h6" sx={{ color: "text.secondary", maxWidth: "700px" }}>
        A modern notes app to keep your thoughts organized and accessible
        anytime, anywhere.
      </Typography>

      <Box sx={{ mt: 3, textAlign: "left" }}>
        <Typography
          variant="h6"
          sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
        >
          <AutoAwesomeIcon color="primary" /> AI-powered note summarization & search
        </Typography>
        <Typography
          variant="h6"
          sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
        >
          <SpeedIcon color="success" /> Super fast & intuitive experience
        </Typography>
        <Typography
          variant="h6"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <SecurityIcon color="error" /> Secure and private
        </Typography>
      </Box>
      <Box>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate("/signup")}
        >
        Let's get Started
        </Button>
      </Box>
    </Container>
  );
    }