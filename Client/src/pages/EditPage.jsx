import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", content: "" });

  // Fetch note details
  useEffect(() => {
    const fetchOneNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setForm({ title: res.data.title, content: res.data.content });
      } catch (err) {
        console.error(err);
        alert("Failed to load note");
      }
    };
    fetchOneNote();
  }, [id]);

  // Update note
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/notes/${id}`, form);
      navigate("/notes");
    } catch (err) {
      console.error(err);
      alert("Failed to update note");
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <h1>Edit Note</h1>
      <form onSubmit={handleEdit}>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        /><br></br><br></br>
        <textarea
          placeholder="Note content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        /><br></br><br></br>
        <button type="submit">Update Note</button>
      </form>
    </div>
  );
}
