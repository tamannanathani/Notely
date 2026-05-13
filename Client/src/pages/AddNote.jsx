import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import TextArea from "../components/ui/TextArea";
import Card from "../components/ui/Card";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AddNotePage() {
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/notes", form);
      alert("Note added successfully!");
      setForm({ title: "", content: "" });
      navigate("/notes"); 
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-primary-600 mb-2">Create a New Note</h1>
              <p className="text-gray-600">Capture your thoughts and ideas</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label="Note Title"
              placeholder="Enter note title..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />

            <TextArea
              label="Note Content"
              placeholder="Write your note here..."
              rows={8}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />

            <div className="flex gap-3 justify-end pt-4">
              <Button 
                type="button" 
                variant="secondary" 
                size="md"
                onClick={() => navigate("/notes")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                size="md" 
                loading={loading}
              >
                Save Note
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
