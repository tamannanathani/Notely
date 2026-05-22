import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { setStoredSession } from "../utils/session";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", form);
      setStoredSession({
        token: response.data.token,
        user: response.data.user,
      });
      navigate(location.state?.from || "/notes");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-[32px] border border-[var(--surface-border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-xl)] backdrop-blur-xl">
      <p className="text-sm uppercase tracking-[0.28em] text-[var(--text-secondary)]">Welcome back</p>
      <h1 className="mt-3 font-['Plus_Jakarta_Sans'] text-4xl font-extrabold tracking-tight">Sign in to your workspace</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
          Login
        </button>
      </form>

      <p className="mt-6 text-sm text-[var(--text-secondary)]">
        New to Notely?{" "}
        <Link to="/signup" className="font-semibold text-[var(--brand)]">
          Create an account
        </Link>
      </p>
    </div>
  );
}
