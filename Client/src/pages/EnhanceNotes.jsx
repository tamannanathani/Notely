import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api"; // Axios instance with token
import { Container, Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function EnhanceNotes() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [enhancedNote, setEnhancedNote] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch the note by id
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
        setEnhancedNote(res.data.content);
      } catch (err) {
        console.error("Failed to fetch note:", err);
      }
    };
    fetchNote();
  }, [id]);

  // Enhance note handler
  const handleEnhance = async () => {
    if (!note) return;
    setLoading(true);
    try {
      const res = await api.post("/ai/enhance", { noteId: note._id });
      setEnhancedNote(res.data.enhancedNote);
    } catch (err) {
      console.error("Enhance note failed:", err);
      alert("Enhance note failed. Check console.");
    } finally {
      setLoading(false);
    }
  };
const handleSave = async () => {
  if (!note) return;
  setLoading(true);
  try {
    await api.put(`/notes/${note._id}`, {
      title: note.title, // keep the same title
      content: enhancedNote, // update content only
    });
    alert("Enhanced note saved!");
    navigate("/notes");
  } catch (err) {
    console.error("Save failed:", err);
    alert("Save failed. Check console.");
  } finally {
    setLoading(false);
  }
};
  if (!note) return <Typography>Loading note...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2, color: "#16918f" }}>
        Enhance Note
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Original Note"
          multiline
          rows={6}
          value={note.content}
          disabled
        />
        <TextField
          label="Enhanced Note"
          multiline
          rows={8}
          value={enhancedNote}
          onChange={(e) => setEnhancedNote(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleEnhance}
          disabled={loading}
        >
          {loading ? "Enhancing..." : "Enhance Note"}
        </Button>

        <Button
        variant="outlined"
        onClick={handleSave}
        disabled={loading}
      >
        Save Enhanced Note
      </Button>
      </Box>
    </Container>
  );
}
