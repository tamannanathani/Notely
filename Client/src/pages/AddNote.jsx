import { useState } from "react";
import { Container, Box, TextField, Button, Typography } from "@mui/material";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AddNotePage() {
  const [form, setForm] = useState({ title: "", content: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/notes", form);
      alert("Note added successfully!");
      setForm({ title: "", content: "" });
      navigate("/notes"); 
    } catch (err) {
      alert("Failed to save note");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ color: "#16918f", mb: 2 }}>
        Add a New Note
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
        />
        <TextField
          label="Content"
          multiline
          rows={4}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
        <Button type="submit" variant="contained">Save Note</Button>
      </Box>
    </Container>
  );
}
