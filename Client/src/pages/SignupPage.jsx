import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { setStoredSession } from "../utils/session";

export default function SignupPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/signup", form);
      setStoredSession({
        token: response.data.token,
        user: response.data.user,
      });
      navigate("/notes");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-[32px] border border-[var(--surface-border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-xl)] backdrop-blur-xl">
      <p className="text-sm uppercase tracking-[0.28em] text-[var(--text-secondary)]">Get started</p>
      <h1 className="mt-3 font-['Plus_Jakarta_Sans'] text-4xl font-extrabold tracking-tight">Create your Notely account</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          required
          value={form.username}
          onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
          placeholder="Full name"
          className="w-full rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-strong)] px-4 py-3 outline-none"
        />
        <input
          type="email"
          required
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          placeholder="Email address"
          className="w-full rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-strong)] px-4 py-3 outline-none"
        />
        <input
          type="password"
          required
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          placeholder="Password"
          className="w-full rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-strong)] px-4 py-3 outline-none"
        />
        {error && <p className="rounded-2xl bg-[var(--danger-soft)] px-4 py-3 text-sm text-red-700 dark:text-red-300">{error}</p>}
        <button type="submit" className="w-full rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white">
          Create account
        </button>
      </form>

      <p className="mt-6 text-sm text-[var(--text-secondary)]">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-[var(--brand)]">
          Sign in
        </Link>
      </p>
    </div>
  );
}
