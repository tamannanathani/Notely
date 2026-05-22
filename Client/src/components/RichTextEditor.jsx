import { useEffect, useRef } from "react";

const TOOLBAR = [
  { label: "B", command: "bold" },
  { label: "I", command: "italic" },
  { label: "U", command: "underline" },
  { label: "List", command: "insertUnorderedList" },
];

function runCommand(command, value) {
  document.execCommand(command, false, value);
}

export default function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  return (
    <div className="rounded-[28px] border border-[var(--surface-border)] bg-[var(--surface-strong)] shadow-sm">
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--surface-border)] px-4 py-3">
        {TOOLBAR.map((item) => (
          <button
            key={item.command}
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              runCommand(item.command);
              editorRef.current?.focus();
            }}
            className="rounded-full border border-[var(--surface-border)] px-3 py-1.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--surface-accent)]"
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
            runCommand("formatBlock", "<h2>");
            editorRef.current?.focus();
          }}
          className="rounded-full border border-[var(--surface-border)] px-3 py-1.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--surface-accent)]"
        >
          H2
        </button>
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
            runCommand("removeFormat");
            editorRef.current?.focus();
          }}
          className="rounded-full border border-[var(--surface-border)] px-3 py-1.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--surface-accent)]"
        >
          Clear
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[360px] px-5 py-4 text-base leading-7 text-[var(--text-primary)] outline-none"
        data-placeholder="Write something thoughtful..."
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
        onBlur={(event) => onChange(event.currentTarget.innerHTML)}
        role="textbox"
        aria-multiline="true"
      />
    </div>
  );
}
