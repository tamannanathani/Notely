export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--text-primary)] shadow-sm backdrop-blur"
    >
      <span className="text-base">{isDark ? "☀" : "☾"}</span>
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
