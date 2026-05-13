import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "../components/ui/Button";
import TextArea from "../components/ui/TextArea";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";

export default function EnhanceNotes() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [enhancedNote, setEnhancedNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
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
        setError("Failed to load note");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  // Enhance note handler
  const handleEnhance = async () => {
    if (!note) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/ai/enhance", { noteId: note._id });
      setEnhancedNote(res.data.enhancedNote);
    } catch (err) {
      console.error("Enhance note failed:", err);
      setError(err.response?.data?.message || "Failed to enhance note");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!note) return;
    setLoading(true);
    setError("");
    try {
      await api.put(`/notes/${note._id}`, {
        title: note.title,
        content: enhancedNote,
      });
      alert("Enhanced note saved!");
      navigate("/notes");
    } catch (err) {
      console.error("Save failed:", err);
      setError(err.response?.data?.message || "Failed to save note");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <p className="text-red-600 text-center">Failed to load note</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-primary-600 mb-2">Enhance Note</h1>
              <p className="text-gray-600">Review your original note and the AI-enhanced version</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Original Note */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Original Note</h2>
              <div className="bg-gray-100 border-2 border-gray-200 rounded-lg p-4 text-gray-700 leading-relaxed max-h-48 overflow-y-auto">
                {note.content}
              </div>
            </div>

            {/* Enhanced Note */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Enhanced Note</h2>
              <TextArea
                value={enhancedNote}
                onChange={(e) => setEnhancedNote(e.target.value)}
                rows={8}
                placeholder="Enhanced content will appear here..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate("/notes")}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                loading={loading}
                onClick={handleEnhance}
              >
                {loading ? "Enhancing..." : "Enhance with AI"}
              </Button>
              <Button
                variant="primary"
                size="md"
                loading={loading}
                onClick={handleSave}
              >
                Save Enhanced Note
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
