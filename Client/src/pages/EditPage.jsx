
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import TextArea from "../components/ui/TextArea";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";

export default function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // fetch single note
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setForm({ title: res.data.title, content: res.data.content });
      } catch (err) {
        console.log("Failed to fetch note", err);
        setError("Could not load note details");
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  // update note
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.put(`/notes/${id}`, form);
      alert("Note updated successfully!");
      navigate("/notes");
    } catch (err) {
      console.log("Error updating note", err);
      setError(err.response?.data?.message || "Failed to update note");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-primary-600 mb-2">Edit Note</h1>
              <p className="text-gray-600">Update your note content</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label="Note Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />

            <TextArea
              label="Note Content"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
              rows={8}
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
                loading={submitting}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
