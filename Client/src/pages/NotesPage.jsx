
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

/* ─── helpers ──────────────────────────────────────────────────────── */
function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
function getPreviewText(note) {
  const summary = stripHtml(note.summary || "");
  if (summary) return summary.slice(0, 120);
  return stripHtml(note.content || "").slice(0, 140);
}
function getAttachmentLabel(note) {
  const fileName = note.attachments?.[0]?.filename;
  if (!fileName) return null;
  const extension = fileName.split(".").pop()?.toUpperCase();
  return extension ? `Imported ${extension}` : "Imported file";
}

/* ─── icons ─────────────────────────────────────────────────────────── */
const Icon = {
  Grid: () => (
    <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="1" width="5.5" height="5.5" rx="1.5" fill="currentColor" />
      <rect x="8.5" y="1" width="5.5" height="5.5" rx="1.5" fill="currentColor" />
      <rect x="1" y="8.5" width="5.5" height="5.5" rx="1.5" fill="currentColor" />
      <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.5" fill="currentColor" />
    </svg>
  ),
  List: () => (
    <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="2.5" width="13" height="2" rx="1" fill="currentColor" />
      <rect x="1" y="6.5" width="13" height="2" rx="1" fill="currentColor" />
      <rect x="1" y="10.5" width="13" height="2" rx="1" fill="currentColor" />
    </svg>
  ),
  Pin: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
    </svg>
  ),
  Search: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  Sparkle: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.4 7.6H22l-6.4 4.6 2.4 7.8L12 17.4l-6 4.6 2.4-7.8L2 9.6h7.6z" />
    </svg>
  ),
  Plus: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Upload: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Archive: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  ),
  Trash: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  X: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
};

/* ─── StatCard ──────────────────────────────────────────────────────── */
function StatCard({ label, value, accent }) {
  return (
    <article
      className="group relative overflow-hidden rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{ boxShadow: "var(--shadow-xl)" }}
    >
      <div
        className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 rounded-full opacity-10 transition-opacity duration-300 group-hover:opacity-20"
        style={{ background: accent || "var(--brand)" }}
      />
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">{label}</p>
      <p className="mt-1.5 font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-none tracking-tight">{value}</p>
    </article>
  );
}

/* ─── FilterChip (custom themed dropdown) ───────────────────────────── */
function FilterChip({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative min-w-[145px] flex-1 sm:flex-none">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left shadow-sm transition-colors ${
          open
            ? "border-[var(--brand)]/60 bg-[var(--surface)]"
            : "border-[var(--surface-border)] bg-[var(--surface-strong)] hover:border-[var(--brand)]/35"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
          {label}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[var(--text-primary)]">
          {(options.find((o) => o.value === value) || options[0])?.label}
        </span>
        <span className={`shrink-0 text-[var(--text-secondary)] transition-transform ${open ? "rotate-180" : ""}`}>
          <Icon.ChevronDown />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-full overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-strong)] shadow-2xl">
          <div className="max-h-64 overflow-y-auto py-1.5">
            {options.map((option) => {
              const selected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2.5 text-sm transition-colors ${
                    selected
                      ? "bg-[var(--brand-soft)] font-semibold text-[var(--brand-strong)]"
                      : "text-[var(--text-primary)] hover:bg-[var(--surface)]"
                  }`}
                  role="option"
                  aria-selected={selected}
                >
                  <span className="flex w-4 shrink-0 justify-center">
                    {selected ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : null}
                  </span>
                  <span className="truncate">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── NoteCard ───────────────────────────────────────────────────────── */
function NoteCard({ note, viewMode, onOpen, onTogglePin, onArchive, onTrash, onRestore, onDelete }) {
  const previewText = getPreviewText(note);
  const attachmentLabel = getAttachmentLabel(note);
  const isList = viewMode === "list";

  if (isList) {
    return (
      <article
        className="group relative flex items-center gap-4 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-3 transition-all duration-150 hover:border-[var(--brand)]/30 hover:shadow-sm"
        style={{ boxShadow: "var(--shadow-xl)" }}
      >
        {/* accent bar */}
        <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-[var(--brand)] opacity-20 group-hover:opacity-70 transition-opacity" />

        {/* main content */}
        <div className="min-w-0 flex-1 pl-1">
          <div className="flex flex-wrap items-center gap-1 mb-0.5">
            {note.isPinned && (
              <span className="flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <Icon.Pin /> Pinned
              </span>
            )}
            {note.isArchived && (
              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">Archived</span>
            )}
            {note.folder?.name && (
              <span className="rounded-full bg-[var(--brand-soft)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--brand-strong)]">{note.folder.name}</span>
            )}
            {attachmentLabel && (
              <span className="rounded-full bg-sky-100 px-1.5 py-0.5 text-[10px] font-bold text-sky-700">{attachmentLabel}</span>
            )}
          </div>
          <h3 className="truncate text-sm font-semibold leading-snug">{note.title}</h3>
          <p className="mt-0.5 line-clamp-1 text-xs leading-relaxed text-[var(--text-secondary)]">
            {previewText}{previewText.length >= 120 ? "…" : ""}
          </p>
          {note.tags?.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {note.tags.slice(0, 3).map((tag) => (
                <span key={tag._id} className="rounded-full border border-[var(--surface-border)] px-1.5 py-0.5 text-[10px] text-[var(--text-secondary)]">#{tag.name}</span>
              ))}
            </div>
          )}
        </div>

        {/* actions */}
        <div className="flex shrink-0 items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button type="button" onClick={() => onTogglePin(note)}
            className={`rounded-lg p-1.5 transition-colors ${note.isPinned ? "bg-amber-100 text-amber-700" : "border border-[var(--surface-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
            title={note.isPinned ? "Unpin" : "Pin"}>
            <Icon.Pin />
          </button>
          <button type="button" onClick={() => onArchive(note)}
            className="rounded-lg border border-[var(--surface-border)] p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title={note.isArchived ? "Unarchive" : "Archive"}>
            <Icon.Archive />
          </button>
          {note.isTrashed ? (
            <>
              <button type="button" onClick={() => onRestore(note)}
                className="rounded-lg border border-[var(--surface-border)] px-2.5 py-1.5 text-xs font-medium hover:bg-[var(--surface-strong)] transition-colors">
                Restore
              </button>
              <button type="button" onClick={() => onDelete(note)}
                className="rounded-lg border border-[var(--surface-border)] p-1.5 text-red-500 hover:bg-red-50 transition-colors" title="Delete forever">
                <Icon.Trash />
              </button>
            </>
          ) : (
            <button type="button" onClick={() => onTrash(note)}
              className="rounded-lg border border-[var(--surface-border)] p-1.5 text-[var(--text-secondary)] hover:text-red-500 transition-colors" title="Trash">
              <Icon.Trash />
            </button>
          )}
          <button type="button" onClick={() => onOpen(note)}
            className="rounded-lg bg-[var(--brand)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity">
            Open
          </button>
        </div>
      </article>
    );
  }

  // Grid card
  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--brand)]/30"
      style={{ boxShadow: "var(--shadow-xl)" }}
    >
      {/* header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1 mb-1">
            {note.isPinned && (
              <span className="flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <Icon.Pin /> Pinned
              </span>
            )}
            {note.isArchived && (
              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">Archived</span>
            )}
            {note.folder?.name && (
              <span className="rounded-full bg-[var(--brand-soft)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--brand-strong)]">{note.folder.name}</span>
            )}
            {attachmentLabel && (
              <span className="rounded-full bg-sky-100 px-1.5 py-0.5 text-[10px] font-bold text-sky-700">{attachmentLabel}</span>
            )}
          </div>
          <h3 className="truncate text-sm font-semibold leading-snug">{note.title}</h3>
        </div>
        <button
          type="button"
          onClick={() => onTogglePin(note)}
          className={`shrink-0 rounded-lg p-1.5 transition-colors ${
            note.isPinned
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              : "border border-[var(--surface-border)] text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 hover:text-[var(--text-primary)]"
          }`}
          title={note.isPinned ? "Unpin" : "Pin"}
        >
          <Icon.Pin />
        </button>
      </div>

      {/* body */}
      <div className="mt-2 flex-1">
        <p className="line-clamp-3 min-h-[54px] text-xs leading-relaxed text-[var(--text-secondary)]">
          {previewText}{previewText.length >= 120 ? "…" : ""}
        </p>
        {attachmentLabel && (
          <div className="mt-2 rounded-lg bg-[var(--surface-accent)] px-2.5 py-1.5 text-[11px] text-[var(--brand-strong)]">
            Preview hidden. Open note to read extracted text.
          </div>
        )}
        {note.tags?.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {note.tags.slice(0, 4).map((tag) => (
              <span key={tag._id} className="rounded-full border border-[var(--surface-border)] px-1.5 py-0.5 text-[10px] text-[var(--text-secondary)]">
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* footer actions */}
      <div className="mt-3 flex items-center gap-1.5 border-t border-[var(--surface-border)] pt-3">
        <button type="button" onClick={() => onOpen(note)}
          className="flex-1 rounded-lg bg-[var(--brand)] py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity">
          Open
        </button>
        <button type="button" onClick={() => onArchive(note)}
          className="rounded-lg border border-[var(--surface-border)] p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          title={note.isArchived ? "Unarchive" : "Archive"}>
          <Icon.Archive />
        </button>
        {note.isTrashed ? (
          <>
            <button type="button" onClick={() => onRestore(note)}
              className="flex-1 rounded-lg border border-[var(--surface-border)] py-1.5 text-xs font-semibold hover:bg-[var(--surface-strong)] transition-colors">
              Restore
            </button>
            <button type="button" onClick={() => onDelete(note)}
              className="rounded-lg border border-[var(--surface-border)] p-1.5 text-red-500 hover:bg-red-50 transition-colors" title="Delete forever">
              <Icon.Trash />
            </button>
          </>
        ) : (
          <button type="button" onClick={() => onTrash(note)}
            className="rounded-lg border border-[var(--surface-border)] p-1.5 text-[var(--text-secondary)] hover:text-red-500 transition-colors" title="Trash">
            <Icon.Trash />
          </button>
        )}
      </div>
    </article>
  );
}

/* ─── main page ─────────────────────────────────────────────────────── */
export default function NotesPage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [tags, setTags] = useState([]);
  const [stats, setStats] = useState({ all: 0, pinned: 0, archived: 0, trashed: 0 });
  const [view, setView] = useState("active");
  const [search, setSearch] = useState("");
  const [folderId, setFolderId] = useState("");
  const [tagId, setTagId] = useState("");
  const [sort, setSort] = useState("updatedAt_desc");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiMessages, setAiMessages] = useState([]);
  const chatEndRef = useRef(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [importStatus, setImportStatus] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const fileInputRef = useRef(null);
  const deferredSearch = useDeferredValue(search);

  const fetchWorkspace = async () => {
    const [notesRes, foldersRes, tagsRes, statsRes] = await Promise.all([
      api.get("/notes", { params: { view, search: deferredSearch, folderId, tag: tagId, sort } }),
      api.get("/meta/folders"),
      api.get("/meta/tags"),
      api.get("/notes/stats"),
    ]);
    setNotes(notesRes.data);
    setFolders(foldersRes.data);
    setTags(tagsRes.data);
    setStats(statsRes.data);
  };

  useEffect(() => {
    fetchWorkspace().catch(() => navigate("/login"));
  }, [deferredSearch, folderId, navigate, sort, tagId, view]);

  const statCards = useMemo(
    () => [
      { label: "Active notes", value: stats.all, accent: "#6366f1" },
      { label: "Pinned", value: stats.pinned, accent: "#f59e0b" },
      { label: "Archived", value: stats.archived, accent: "#64748b" },
      { label: "In trash", value: stats.trashed, accent: "#ef4444" },
    ],
    [stats]
  );

  const refresh = () => fetchWorkspace().catch(() => {});

  const handleAsk = async () => {
    if (!aiQuestion.trim()) return;
    const question = aiQuestion.trim();
    setAiMessages((prev) => [...prev, { role: "user", text: question }]);
    setAiQuestion("");
    setAiLoading(true);
    try {
      const res = await api.post("/ai/ask", { question });
      setAiMessages((prev) => [...prev, { role: "ai", text: res.data.answer }]);
    } catch {
      setAiMessages((prev) => [...prev, { role: "ai", text: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages, aiLoading]);

  const patchNote = async (id, path, body = {}) => {
    await api.patch(`/notes/${id}/${path}`, body);
    refresh();
  };

  const handleDeleteForever = async (note) => {
    await api.delete(`/notes/${note._id}`);
    refresh();
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const payload = new FormData();
    payload.append("file", file);
    setImportStatus(`Importing ${file.name}…`);
    try {
      await api.post("/notes/import", payload);
      setImportStatus(`✓ Imported ${file.name}`);
      refresh();
    } catch (err) {
      setImportStatus(err.response?.data?.message || "Import failed");
    } finally {
      event.target.value = "";
    }
  };

  const folderOptions = [
    { value: "", label: "All folders" },
    ...folders.map((f) => ({ value: f._id, label: f.name })),
  ];
  const tagOptions = [
    { value: "", label: "All tags" },
    ...tags.map((t) => ({ value: t._id, label: `#${t.name}` })),
  ];
  const viewOptions = [
    { value: "active", label: "Active" },
    { value: "archived", label: "Archived" },
    { value: "trashed", label: "Trashed" },
    { value: "all", label: "All notes" },
  ];
  const sortOptions = [
    { value: "updatedAt_desc", label: "Recently updated" },
    { value: "createdAt_desc", label: "Recently created" },
    { value: "updatedAt_asc", label: "Oldest updated" },
    { value: "title_asc", label: "Title A–Z" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-4 pb-16">

      {/* ── top header ── */}
      <header className="flex flex-col gap-3 pt-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-secondary)]">
            Notely Workspace
          </p>
          <h1 className="mt-0.5 font-['Plus_Jakarta_Sans'] text-xl font-extrabold tracking-tight sm:text-2xl">
            Your notes, organised.
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {importStatus && (
            <span className="rounded-lg bg-[var(--surface-strong)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] border border-[var(--surface-border)]">
              {importStatus}
            </span>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-[var(--surface-strong)]"
          >
            <Icon.Upload /> Import
          </button>
          <input ref={fileInputRef} type="file" accept=".txt,.docx,.pdf" className="hidden" onChange={handleImport} />
          <button
            type="button"
            onClick={() => navigate("/add")}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--brand)] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
          >
            <Icon.Plus /> New note
          </button>
        </div>
      </header>

      {/* ── stat row ── */}
      <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 mb-4">
        {statCards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </section>

      {/* ── search + filter bar ── */}
      <div
        className="sticky top-16 z-20 mb-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)]/95 p-4 backdrop-blur-xl"
        style={{ boxShadow: "var(--shadow-xl)" }}
      >
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          {/* search */}
          <div className="relative min-w-0 flex-1 xl:max-w-[420px]">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
              <Icon.Search />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search titles, content, summaries…"
              className="w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface-strong)] py-3 pl-10 pr-4 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--brand)]/50 transition-colors"
            />
          </div>

          {/* filters + view toggle row */}
          <div className="flex w-full flex-wrap items-center gap-2 xl:w-auto">
            <FilterChip label="View" value={view} options={viewOptions} onChange={setView} />
            <FilterChip label="Folder" value={folderId} options={folderOptions} onChange={setFolderId} />
            <FilterChip label="Tag" value={tagId} options={tagOptions} onChange={setTagId} />
            <FilterChip label="Sort" value={sort} options={sortOptions} onChange={setSort} />

            <div className="flex items-center gap-1 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-strong)] p-1 shadow-sm sm:ml-auto">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${viewMode === "grid" ? "bg-[var(--brand)] text-white" : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"}`}
                title="Grid view"
              >
                <Icon.Grid />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${viewMode === "list" ? "bg-[var(--brand)] text-white" : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"}`}
                title="List view"
              >
                <Icon.List />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── notes grid / list (full width) ── */}
      <div
        className={
          viewMode === "grid"
            ? "grid auto-rows-fr gap-2.5 content-start sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
            : "flex flex-col gap-2 content-start"
        }
      >
        {notes.length ? (
          notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              viewMode={viewMode}
              onOpen={() => navigate(`/edit/${note._id}`)}
              onTogglePin={(item) => patchNote(item._id, "pin", { isPinned: !item.isPinned })}
              onArchive={(item) => patchNote(item._id, "archive", { isArchived: !item.isArchived })}
              onTrash={(item) => patchNote(item._id, "trash", { isTrashed: true })}
              onRestore={(item) => patchNote(item._id, "restore")}
              onDelete={handleDeleteForever}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--surface-border)] bg-[var(--surface)] py-16 text-center">
            <p className="text-sm text-[var(--text-secondary)]">No notes match these filters yet.</p>
            <button
              type="button"
              onClick={() => navigate("/add")}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand)] px-3.5 py-2 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
            >
              <Icon.Plus /> Create your first note
            </button>
          </div>
        )}
      </div>

      {/* ── AI popover (opens upward from FAB, bottom-right) ── */}
      <div className="fixed inset-x-3 bottom-4 z-40 flex flex-col items-end gap-3 sm:left-auto sm:right-6">
        {/* popover panel */}
        {isAiPanelOpen && (
          <div className="w-full max-w-[480px] rounded-[28px] border border-[var(--surface-border)] bg-[var(--surface-strong)] overflow-hidden shadow-2xl flex flex-col"
            style={{ maxHeight: "min(680px, calc(100vh - 7rem))", boxShadow: "0 30px 90px rgba(15, 23, 42, 0.22)" }}>
            {/* header */}
            <div className="flex items-center justify-between border-b border-[var(--surface-border)] bg-[var(--surface)] px-5 py-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand)] text-white shadow-sm">
                  <Icon.Sparkle />
                </span>
                <div>
                  <p className="text-sm font-bold leading-none text-[var(--text-primary)]">Ask your notes</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">AI-powered search</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {aiMessages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setAiMessages([])}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-strong)] hover:text-[var(--text-primary)] transition-colors"
                    title="Clear chat"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsAiPanelOpen(false)}
                    className="rounded-lg p-1.5 text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-strong)] hover:text-[var(--text-primary)]"
                  title="Close"
                >
                  <Icon.X />
                </button>
              </div>
            </div>

            {/* messages */}
            <div className="flex-1 overflow-y-auto bg-[var(--surface-strong)] px-4 py-4 space-y-4 min-h-0" style={{ minHeight: "320px" }}>
              {aiMessages.length === 0 && !aiLoading && (
                <div className="flex flex-col items-center justify-center h-full py-10 gap-3 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand-strong)]">
                    <Icon.Sparkle />
                  </span>
                  <p className="text-base font-semibold text-[var(--text-primary)]">Ask anything about your notes</p>
                  <p className="max-w-[34ch] text-sm text-[var(--text-secondary)] leading-relaxed">e.g. "What did I write about sprint planning?" or "Summarise my archived notes"</p>
                </div>
              )}

              {aiMessages.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "ai" && (
                    <span className="flex h-7 w-7 shrink-0 mt-0.5 items-center justify-center rounded-lg bg-[var(--brand)] text-white">
                      <Icon.Sparkle />
                    </span>
                  )}
                  <div
                    className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm ${
                      msg.role === "user"
                        ? "rounded-tr-sm bg-[var(--brand)] text-white"
                        : "rounded-tl-sm border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-primary)]"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.role === "user" && (
                    <span className="flex h-7 w-7 shrink-0 mt-0.5 items-center justify-center rounded-lg bg-[var(--surface)] border border-[var(--surface-border)] text-[var(--text-secondary)] text-[10px] font-bold">
                      U
                    </span>
                  )}
                </div>
              ))}

              {aiLoading && (
                <div className="flex gap-2.5 justify-start">
                  <span className="flex h-7 w-7 shrink-0 mt-0.5 items-center justify-center rounded-lg bg-[var(--brand)] text-white">
                    <Icon.Sparkle />
                  </span>
                  <div className="rounded-2xl rounded-tl-sm border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-3 flex items-center gap-1.5 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-[var(--brand)] opacity-60 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-[var(--brand)] opacity-60 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-[var(--brand)] opacity-60 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* input */}
            <div className="shrink-0 border-t border-[var(--surface-border)] bg-[var(--surface)] px-4 py-4">
              <div className="flex items-end gap-3 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-strong)] px-4 py-3 focus-within:border-[var(--brand)]/50 transition-colors">
                <textarea
                  rows={1}
                  value={aiQuestion}
                  onChange={(e) => {
                    setAiQuestion(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAsk(); }
                  }}
                  placeholder="Ask your notes…"
                  className="flex-1 resize-none bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] leading-relaxed"
                  style={{ minHeight: "24px", maxHeight: "120px" }}
                />
                <button
                  type="button"
                  onClick={handleAsk}
                  disabled={aiLoading || !aiQuestion.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)] text-white disabled:opacity-40 transition-opacity hover:opacity-90"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
              <p className="mt-1.5 text-center text-[10px] text-[var(--text-secondary)]">Enter to send · Shift+Enter for newline</p>
            </div>
          </div>
        )}

        {/* FAB */}
        <button
          type="button"
          onClick={() => setIsAiPanelOpen((v) => !v)}
          className="flex items-center gap-2 rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
        >
          <Icon.Sparkle />
          {isAiPanelOpen ? "Close AI" : "Ask AI"}
        </button>
      </div>
    </div>
  );
}
