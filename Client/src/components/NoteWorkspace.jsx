import { startTransition, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import RichTextEditor from "./RichTextEditor";

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeRagHtml(html = "") {
  if (!html) return "";

  return html
    .replace(/<p>\s*(<(?:ul|ol)[\s\S]*?<\/(?:ul|ol)>)\s*<\/p>/gi, "$1")
    .replace(/<p>\s*(<(?:ul|ol)[\s\S]*?<\/(?:ul|ol)>)([\s\S]*?)<\/p>/gi, (_, listHtml, trailingText) => {
      const tail = trailingText.replace(/<br\s*\/?>/gi, " ").trim();
      return `${listHtml}${tail ? `<p>${tail}</p>` : ""}`;
    })
    .replace(/<p>\s*(<(?:blockquote|pre|table)[\s\S]*?<\/(?:blockquote|pre|table)>)\s*<\/p>/gi, "$1")
    .replace(/<p>\s*<(ul|ol)>([\s\S]*?)<\/(ul|ol)>\s*<\/p>/gi, "<$1>$2</$3>")
    .replace(/<p>\s*<(ul|ol)[^>]*>([\s\S]*?)<\/(ul|ol)>\s*<\/p>/gi, "<$1>$2</$3>");
}

function decodeHtmlEntities(value = "") {
  if (!value) return "";

  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function cleanSummary(value = "") {
  return stripHtml(normalizeRagHtml(decodeHtmlEntities(value)));
}

function normalizeNotePayload(form) {
  const plainText = stripHtml(form.content);
  return {
    title: form.title.trim() || "Untitled note",
    content: form.content || "<p></p>",
    tags: form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    folderId: form.folderId || null,
    summary: cleanSummary(form.summary),
    isPinned: form.isPinned,
    isArchived: form.isArchived,
    isTrashed: form.isTrashed,
    color: form.color || "default",
    plainText,
  };
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? "bg-[var(--brand)]" : "bg-[var(--surface-strong)] border border-[var(--surface-border)]"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function NoteWorkspace({ noteId = null, autoEnhance = false }) {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(Boolean(noteId));
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(noteId ? "Saved" : "Draft ready");
  const [currentId, setCurrentId] = useState(noteId);
  const [aiLoading, setAiLoading] = useState(false);
  // RAG (retrieve-and-generate) state
  const [ragQuestion, setRagQuestion] = useState("");
  const [ragAnswer, setRagAnswer] = useState("");
  const [ragLoading, setRagLoading] = useState(false);
  const [ragSources, setRagSources] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "<p></p>",
    tags: "",
    folderId: "",
    summary: "",
    isPinned: false,
    isArchived: false,
    isTrashed: false,
    color: "default",
  });
  const bootstrappedRef = useRef(false);

  const buildRequestBody = () => {
    const payload = normalizeNotePayload(form);
    return {
      payload,
      requestBody: {
        title: payload.title,
        content: payload.content,
        tags: payload.tags,
        folderId: payload.folderId,
        summary: payload.summary,
        isPinned: form.isPinned,
        isArchived: form.isArchived,
        isTrashed: form.isTrashed,
        color: form.color,
      },
    };
  };

  useEffect(() => {
    api.get("/meta/folders").then((r) => setFolders(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!noteId) { bootstrappedRef.current = true; return; }
    api.get(`/notes/${noteId}`)
      .then(({ data: note }) => {
        setForm({
          title: note.title || "",
          content: note.content || "<p></p>",
          tags: note.tags?.map((t) => t.name).join(", ") || "",
          folderId: note.folder?._id || "",
          summary: cleanSummary(note.summary || ""),
          isPinned: Boolean(note.isPinned),
          isArchived: Boolean(note.isArchived),
          isTrashed: Boolean(note.isTrashed),
          color: note.color || "default",
        });
        setCurrentId(note._id);
        bootstrappedRef.current = true;
      })
      .catch(() => navigate("/notes"))
      .finally(() => setLoading(false));
  }, [navigate, noteId]);

  useEffect(() => {
    if (!autoEnhance || !currentId || !bootstrappedRef.current) return;
    api.post("/ai/enhance", { noteId: currentId })
      .then(({ data }) =>
        setForm((c) => ({ ...c, content: `<p>${data.enhancedNote.replace(/\n/g, "</p><p>")}</p>` }))
      )
      .catch(() => {});
  }, [autoEnhance, currentId]);

  useEffect(() => {
    if (!bootstrappedRef.current) return;
    const { payload, requestBody } = buildRequestBody();
    if (!payload.title.trim() && !payload.plainText) return;

    const id = window.setTimeout(async () => {
      setSaving(true);
      setSaveStatus("Saving...");
      try {
        if (currentId) {
          await api.put(`/notes/${currentId}`, requestBody);
        } else if (payload.plainText) {
          const { data } = await api.post("/notes", requestBody);
          setCurrentId(data._id);
          startTransition(() => navigate(`/edit/${data._id}`, { replace: true }));
        }
        setSaveStatus("Saved just now");
      } catch {
        setSaveStatus("Save failed");
      } finally {
        setSaving(false);
      }
    }, 900);

    return () => window.clearTimeout(id);
  }, [currentId, form, navigate]);

  const handleSaveNow = async () => {
    const { payload, requestBody } = buildRequestBody();
    if (!payload.plainText) { setSaveStatus("Add some content first"); return; }
    setSaving(true); setSaveStatus("Saving...");
    try {
      if (currentId) {
        await api.put(`/notes/${currentId}`, requestBody);
      } else {
        const { data } = await api.post("/notes", requestBody);
        setCurrentId(data._id);
        startTransition(() => navigate(`/edit/${data._id}`, { replace: true }));
      }
      setSaveStatus("Saved just now");
      // Note: backend handles indexing/updating embeddings on save — no client action required
    } catch {
      setSaveStatus("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSummarize = async () => {
    if (!currentId || aiLoading) return;
    setAiLoading(true);
    try {
      const { data } = await api.post("/ai/summarize", { noteId: currentId });
      setForm((c) => ({ ...c, summary: cleanSummary(data.summary || "") }));
    } catch (error) {
      console.error('Summarize failed:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateTitle = async () => {
    if (!currentId || aiLoading) return;
    setAiLoading(true);
    try {
      const { data } = await api.post("/ai/title", { noteId: currentId });
      setForm((c) => ({ ...c, title: data.title }));
    } catch (error) {
      console.error('Generate title failed:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleExtractKeywords = async () => {
    if (!currentId || aiLoading) return;
    setAiLoading(true);
    try {
      const { data } = await api.post("/ai/keywords", { noteId: currentId });
      setForm((c) => ({ ...c, tags: data.tags.map((t) => t.name).join(", ") }));
    } catch (error) {
      console.error('Extract keywords failed:', error);
    } finally {
      setAiLoading(false);
    }
  };

  // RAG ask handler
  const handleAskRAG = async () => {
    if (!ragQuestion.trim()) return;

    setRagLoading(true);
    setRagAnswer("");
    setRagSources([]);

    try {
      const { data } = await api.post("/ai/ask-rag", { question: ragQuestion });

      setRagAnswer(normalizeRagHtml(data.answer || ""));
      setRagSources(data.sources || []);

      if (data.method === "rag_no_results") {
        setSaveStatus("No relevant notes found");
      }
    } catch (error) {
      console.error('❌ RAG Ask failed:', error);
      setRagAnswer("Failed to get answer. Please try again.");
    } finally {
      setRagLoading(false);
    }
  };

 const handleEnhance = async () => {
  if (!currentId) return;
  
  try {
    setSaveStatus("Enhancing...");
    
    const { data } = await api.post("/ai/enhance", { noteId: currentId });
    
    if (data.enhancedNote) {
      // Clean up any remaining markdown artifacts
      let enhancedContent = data.enhancedNote;
      
      // Remove common AI intro phrases
      enhancedContent = enhancedContent
        .replace(/^(Here's|Here is|Below is)(.*?)(enhanced|improved|expanded)(.*?)(version|note)(:|\n)/i, '')
        .trim();
      
      // Convert markdown to HTML for the rich text editor
      enhancedContent = enhancedContent
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/\n\n/g, '<br/><br/>');
      
      setForm((c) => ({ 
        ...c, 
        content: enhancedContent 
      }));
      
      setSaveStatus("Enhanced! Saving...");
    }
    
    if (data.stats) {
      console.log(`📊 Enhancement stats: ${data.stats.originalWords} → ${data.stats.enhancedWords} words (${data.stats.improvement})`);
    }
    
  } catch (error) {
    console.error('❌ Enhance failed:', error);
    setSaveStatus('Enhancement failed');
  }
};

  const createFolder = async () => {
    const name = window.prompt("New folder name");
    if (!name?.trim()) return;
    const { data } = await api.post("/meta/folders", { name: name.trim() });
    setFolders((c) => [...c, data].sort((a, b) => a.name.localeCompare(b.name)));
    setForm((c) => ({ ...c, folderId: data._id }));
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl rounded-[28px] border border-[var(--surface-border)] bg-[var(--surface)] px-8 py-8 shadow-[var(--shadow-xl)]">
        Loading note...
      </div>
    );
  }

  const isSaved = !saving && (saveStatus === "Saved" || saveStatus === "Saved just now" || saveStatus === "Draft ready");

  return (
    <div className="flex h-full flex-col px-4 sm:px-6 lg:px-12">

      {/* ── Sticky top bar ── */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--surface-border)] bg-[var(--surface)] px-4 py-2.5 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate("/notes")}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--surface-border)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-strong)]"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Notes
          </button>
          <span className="text-xs text-[var(--text-secondary)]">/</span>
          <span className="text-xs font-medium text-[var(--text-primary)]">
            {currentId ? "Edit note" : "New note"}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Save status indicator */}
          <span className="flex items-center gap-1.5 rounded-full bg-[var(--surface-accent)] px-3 py-1.5 text-xs font-medium text-[var(--brand-strong)]">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                saving ? "animate-pulse bg-amber-400" : isSaved ? "bg-emerald-400" : "bg-red-400"
              }`}
            />
            {saving ? "Saving…" : saveStatus}
          </span>

          <button
            type="button"
            onClick={handleSaveNow}
            className="rounded-xl bg-[var(--brand)] px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 active:scale-95"
          >
            Save note
          </button>
        </div>
      </header>

      {/* ── Main layout ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: editor column ── */}
        <section className="flex flex-1 flex-col overflow-y-auto">

          {/* Title + inline meta */}
          <div className="px-5 pt-5 pb-0">
            <input
              value={form.title}
              onChange={(e) => setForm((c) => ({ ...c, title: e.target.value }))}
              placeholder="Untitled note"
              className="w-full border-none bg-transparent font-['Plus_Jakarta_Sans'] text-3xl font-extrabold tracking-tight text-[var(--text-primary)] outline-none placeholder:text-slate-400"
            />

            {/* Tags + folder inline row */}
            <div className="mt-3 flex flex-wrap items-center gap-2 border-b border-[var(--surface-border)] pb-3">
              <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-strong)] px-3 py-2">
                {/* tag icon */}
                <svg className="h-3.5 w-3.5 flex-shrink-0 text-[var(--text-secondary)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M3 3h7.5a2 2 0 011.415.586l7.5 7.5a2 2 0 010 2.828l-5.5 5.5a2 2 0 01-2.828 0l-7.5-7.5A2 2 0 013 17.5V3z" />
                </svg>
                <input
                  value={form.tags}
                  onChange={(e) => setForm((c) => ({ ...c, tags: e.target.value }))}
                  placeholder="Add tags, comma separated"
                  className="min-w-0 flex-1 border-none bg-transparent text-xs text-[var(--text-primary)] outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-1.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-strong)] px-3 py-2">
                {/* folder icon */}
                <svg className="h-3.5 w-3.5 flex-shrink-0 text-[var(--text-secondary)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                </svg>
                <select
                  value={form.folderId}
                  onChange={(e) => setForm((c) => ({ ...c, folderId: e.target.value }))}
                  className="border-none bg-transparent text-xs text-[var(--text-primary)] outline-none"
                >
                  <option value="">No folder</option>
                  {folders.map((f) => (
                    <option key={f._id} value={f._id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={createFolder}
                className="flex items-center gap-1 rounded-xl border border-dashed border-[var(--surface-border)] px-3 py-2 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New folder
              </button>
            </div>
          </div>

          {/* Rich text editor */}
          <div className="flex-1 px-5 py-4">
            <RichTextEditor
              value={form.content}
              onChange={(content) => setForm((c) => ({ ...c, content }))}
            />
          </div>
        </section>

        {/* ── Right: sidebar ── */}
        <aside className="flex w-64 flex-shrink-0 flex-col overflow-y-auto border-l border-[var(--surface-border)] bg-[var(--surface)]">

          {/* AI Actions */}
          <div className="px-3.5 pt-4 pb-3">
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              AI Actions
            </p>
            <div className="space-y-1.5">
              {aiLoading && (
                <div className="flex items-center gap-2.5 rounded-2xl bg-[var(--surface-accent)] px-3.5 py-2.5 text-xs font-semibold text-[var(--brand-strong)]">
                  <svg className="h-3.5 w-3.5 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 0116 0m0 0a8 8 0 01-16 0m0 0a8 8 0 1116 0" />
                  </svg>
                  AI is processing...
                </div>
              )}
              <button
                type="button"
                onClick={handleEnhance}
                disabled={aiLoading}
                className={`flex w-full items-center gap-2.5 rounded-2xl bg-[var(--brand)] px-3.5 py-2.5 text-left text-xs font-semibold text-white transition-opacity ${
                  aiLoading ? 'cursor-not-allowed opacity-50' : 'hover:opacity-90'
                }`}
              >
                <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Enhance writing
              </button>

              <button
                type="button"
                onClick={handleGenerateTitle}
                disabled={aiLoading}
                className={`flex w-full items-center gap-2.5 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-strong)] px-3.5 py-2.5 text-left text-xs font-semibold text-[var(--text-primary)] transition-colors ${
                  aiLoading ? 'cursor-not-allowed opacity-50' : 'hover:border-[var(--brand)] hover:text-[var(--brand)]'
                }`}
              >
                <svg className="h-3.5 w-3.5 flex-shrink-0 text-[var(--text-secondary)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Generate title
              </button>

              <button
                type="button"
                onClick={handleSummarize}
                disabled={aiLoading}
                className={`flex w-full items-center gap-2.5 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-strong)] px-3.5 py-2.5 text-left text-xs font-semibold text-[var(--text-primary)] transition-colors ${
                  aiLoading ? 'cursor-not-allowed opacity-50' : 'hover:border-[var(--brand)] hover:text-[var(--brand)]'
                }`}
              >
                <svg className="h-3.5 w-3.5 flex-shrink-0 text-[var(--text-secondary)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10" />
                </svg>
                Summarize note
              </button>

              <button
                type="button"
                onClick={handleExtractKeywords}
                disabled={aiLoading}
                className={`flex w-full items-center gap-2.5 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-strong)] px-3.5 py-2.5 text-left text-xs font-semibold text-[var(--text-primary)] transition-colors ${
                  aiLoading ? 'cursor-not-allowed opacity-50' : 'hover:border-[var(--brand)] hover:text-[var(--brand)]'
                }`}
              >
                <svg className="h-3.5 w-3.5 flex-shrink-0 text-[var(--text-secondary)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M3 3h7.5a2 2 0 011.415.586l7.5 7.5a2 2 0 010 2.828l-5.5 5.5a2 2 0 01-2.828 0l-7.5-7.5A2 2 0 013 17.5V3z" />
                </svg>
                Extract keywords
              </button>
            </div>
          </div>

          <div className="mx-3.5 border-t border-[var(--surface-border)]" />

          {/* Status toggles */}
          <div className="px-3.5 py-3">
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              Status
            </p>
            <div className="space-y-1">
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[var(--surface-border)] px-3 py-2.5">
                <span className="flex items-center gap-2 text-xs font-medium text-[var(--text-primary)]">
                  <svg className="h-3.5 w-3.5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Pin note
                </span>
                <Toggle
                  checked={form.isPinned}
                  onChange={(val) => setForm((c) => ({ ...c, isPinned: val }))}
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[var(--surface-border)] px-3 py-2.5">
                <span className="flex items-center gap-2 text-xs font-medium text-[var(--text-primary)]">
                  <svg className="h-3.5 w-3.5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  Archive note
                </span>
                <Toggle
                  checked={form.isArchived}
                  onChange={(val) => setForm((c) => ({ ...c, isArchived: val }))}
                />
              </label>
            </div>
          </div>

          <div className="mx-3.5 border-t border-[var(--surface-border)]" />

          {/* Summary */}
          <div className="flex flex-1 flex-col px-3.5 py-3">
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              Summary
            </p>
            <textarea
              value={form.summary}
              onChange={(e) => setForm((c) => ({ ...c, summary: cleanSummary(e.target.value) }))}
              rows={6}
              placeholder="Summary appears here…"
              className="flex-1 resize-none rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-strong)] px-3 py-2.5 text-xs text-[var(--text-primary)] outline-none placeholder:text-slate-400 focus:border-[var(--brand)]"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}