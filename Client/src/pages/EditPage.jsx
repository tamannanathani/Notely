
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button
} from "@mui/material";

export default function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", content: "" });

  // fetch single note
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setForm({ title: res.data.title, content: res.data.content });
      } catch (err) {
        console.log("Failed to fetch note", err);
        alert("Could not load note details");
      }
    };
    fetchNote();
  }, [id]);

  // update note
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/notes/${id}`, form);
      alert("Note updated successfully!");
      navigate("/notes");
    } catch (err) {
      console.log("Error updating note", err);
      alert("Failed to update note");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#16918f",
          mb: 3,
          textAlign: "center"
        }}
      >
        Edit Note
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          fullWidth
        />

        <TextField
          label="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
          fullWidth
          multiline
          rows={6}
        />

        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Save Changes
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/notes")}
        >
          Cancel
        </Button>
      </Box>
    </Container>
  );
}
