import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { clearStoredSession } from "../utils/session";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/users/me").then((response) => setUser(response.data)).catch(() => navigate("/login"));
  }, [navigate]);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Delete your account and all notes?");
    if (!confirmed) return;

    await api.delete("/users/me");
    clearStoredSession();
    navigate("/signup");
  };

  if (!user) {
    return <div className="mx-auto max-w-4xl rounded-[28px] border border-[var(--surface-border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-xl)]">Loading profile...</div>;
  }

  const daysActive = Math.max(
    1,
    Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-[32px] border border-[var(--surface-border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-xl)] backdrop-blur-xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--brand)] text-3xl font-bold text-white">
              {user.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[var(--text-secondary)]">Profile</p>
              <h1 className="mt-2 font-['Plus_Jakarta_Sans'] text-3xl font-extrabold">{user.username}</h1>
              <p className="mt-1 text-[var(--text-secondary)]">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
          >
            Delete account
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-[28px] border border-[var(--surface-border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-xl)]">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-secondary)]">Notes</p>
          <p className="mt-3 text-4xl font-extrabold">{user.notesCount}</p>
        </article>
        <article className="rounded-[28px] border border-[var(--surface-border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-xl)]">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-secondary)]">Days active</p>
          <p className="mt-3 text-4xl font-extrabold">{daysActive}</p>
        </article>
        <article className="rounded-[28px] border border-[var(--surface-border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-xl)]">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-secondary)]">Workspace</p>
          <p className="mt-3 text-lg font-semibold">AI-enhanced knowledge base</p>
        </article>
      </section>
    </div>
  );
}
