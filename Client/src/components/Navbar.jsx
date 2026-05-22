
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { clearStoredSession, getStoredUser, isAuthenticated } from "../utils/session";
import { useTheme } from "../hooks/useTheme";

/* ─── icons ─────────────────────────────────────────────────────────── */
const Icon = {
  Notes: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  LogOut: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Menu: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  User: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

/* ─── NavLink ────────────────────────────────────────────────────────── */
function NavLink({ to, label, icon: IconComp, onClick }) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
        active
          ? "bg-[var(--brand-soft)] text-[var(--brand-strong)]"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      }`}
    >
      {IconComp && (
        <span className={`${active ? "text-[var(--brand-strong)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"}`}>
          <IconComp />
        </span>
      )}
      {label}
    </Link>
  );
}

/* ─── Avatar ─────────────────────────────────────────────────────────── */
function Avatar({ initial }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-bold text-white">
      {initial}
    </span>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────────────── */
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getStoredUser();
  const loggedIn = isAuthenticated();
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = () => {
    clearStoredSession();
    navigate("/login");
  };

  const initial = user?.username?.[0]?.toUpperCase() || "N";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-shadow duration-200 ${
        scrolled ? "border-[var(--surface-border)] shadow-sm" : "border-transparent shadow-none"
      }`}
      style={{ background: "var(--surface-strong, var(--surface))" }}
    >
      <div className="mx-auto flex h-[64px] max-w-7xl items-center justify-between gap-4 px-3 sm:px-5 lg:px-6">

        {/* ── left: wordmark ── */}
        <Link
          to={loggedIn ? "/notes" : "/"}
          className="shrink-0 font-['Plus_Jakarta_Sans'] text-xl font-extrabold tracking-tight text-[var(--brand)]"
        >
          Notely
        </Link>

        {/* ── center: nav links (desktop) ── */}
        {loggedIn && (
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/notes" label="Notes" icon={Icon.Notes} />
            <NavLink to="/add" label="Add Note" icon={Icon.Plus} />
          </nav>
        )}

        {/* ── right: controls ── */}
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

          {loggedIn ? (
            <>
              {/* profile button — desktop */}
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="hidden items-center gap-2 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-strong)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface)] md:inline-flex"
              >
                <Avatar initial={initial} />
                <span className="max-w-[90px] truncate">Profile</span>
              </button>

              {/* logout — desktop */}
              <button
                type="button"
                onClick={handleLogout}
                className="hidden items-center gap-1.5 rounded-lg border border-[var(--surface-border)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-800 dark:hover:bg-red-950/30 dark:hover:text-red-400 md:inline-flex"
              >
                <Icon.LogOut />
                Logout
              </button>

              {/* mobile: avatar + hamburger */}
              <div className="flex items-center gap-1.5 md:hidden">
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  aria-label="Profile"
                  className="rounded-full"
                >
                  <Avatar initial={initial} />
                </button>
                <button
                  type="button"
                  onClick={() => setMobileOpen((v) => !v)}
                  className="rounded-lg border border-[var(--surface-border)] p-1.5 text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)]"
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? <Icon.X /> : <Icon.Menu />}
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-[var(--brand)] px-3.5 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-95"
              >
                Start free
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── mobile drawer ── */}
      {mobileOpen && loggedIn && (
        <div className="border-t border-[var(--surface-border)] bg-[var(--surface-strong)] px-3 pb-3 pt-2 md:hidden">
          {/* user row */}
          <div className="mb-2 flex items-center gap-3 rounded-lg bg-[var(--surface-strong)] px-3 py-2.5">
            <Avatar initial={initial} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{user?.username || "User"}</p>
              <p className="text-[11px] text-[var(--text-secondary)]">Notely account</p>
            </div>
          </div>

          {/* links */}
          <nav className="space-y-0.5">
            <NavLink to="/notes" label="Notes" icon={Icon.Notes} onClick={() => setMobileOpen(false)} />
            <NavLink to="/add" label="Add Note" icon={Icon.Plus} onClick={() => setMobileOpen(false)} />
            <NavLink to="/profile" label="Profile" icon={Icon.User} onClick={() => setMobileOpen(false)} />
          </nav>

          {/* logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--surface-border)] py-2 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-800 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          >
            <Icon.LogOut /> Log out
          </button>
        </div>
      )}
    </header>
  );
}
