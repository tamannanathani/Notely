import { Link } from "react-router-dom";
import { isAuthenticated } from "../utils/session";

/* ─── feature cards data ─────────────────────────────────────────────── */
const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.4 7.6H22l-6.4 4.6 2.4 7.8L12 17.4l-6 4.6 2.4-7.8L2 9.6h7.6z" />
      </svg>
    ),
    tag: "AI-powered",
    title: "Write smarter, not harder",
    desc: "AI generates summaries, suggests titles, and extracts keywords from your notes automatically — so every note is instantly searchable and useful.",
    accent: "#6366f1",
    accentSoft: "rgba(99,102,241,0.08)",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    ),
    tag: "Semantic search",
    title: "Ask your notes anything",
    desc: "Type a question in plain English — \"What did I write about the Q3 plan?\" — and get a direct answer sourced from your own knowledge base.",
    accent: "#0ea5e9",
    accentSoft: "rgba(14,165,233,0.08)",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    tag: "Organisation",
    title: "Every note, in its place",
    desc: "Folders, tags, pinning, archiving, and trash. A complete system so nothing gets lost — and anything can be found in seconds.",
    accent: "#10b981",
    accentSoft: "rgba(16,185,129,0.08)",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    tag: "Import",
    title: "Bring your existing notes",
    desc: "Drop in TXT, DOCX, or PDF files and Notely parses, indexes, and stores them — ready to search, summarise, and work with immediately.",
    accent: "#f59e0b",
    accentSoft: "rgba(245,158,11,0.08)",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    tag: "Security",
    title: "Your notes, only yours",
    desc: "JWT authentication keeps every workspace private and isolated. Your data is never shared, never mixed, and always under your control.",
    accent: "#ef4444",
    accentSoft: "rgba(239,68,68,0.08)",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    tag: "Productivity",
    title: "From capture to clarity",
    desc: "A distraction-free editor, grid and list views, rich previews, and a persistent AI chat — everything designed to help you think, not fidget with tools.",
    accent: "#8b5cf6",
    accentSoft: "rgba(139,92,246,0.08)",
  },
];

const avatars = ["A", "M", "R", "S", "J"];
const heroPills = ["AI summary ready", "6 tagged notes", "Answer sourced from notes"];

export default function WelcomePage() {
  const loggedIn = isAuthenticated();

  return (
    <div className="relative min-h-screen overflow-x-hidden">

      {/* ── ambient glow blobs ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-120px] left-[50%] -translate-x-1/2 h-[560px] w-[900px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 65%)" }} />
        <div className="absolute top-[60%] right-[-200px] h-[420px] w-[420px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-[-100px] h-[360px] w-[360px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)" }} />
      </div>

      <div className="mx-auto max-w-7xl px-3 sm:px-5 pb-24">

        {/* ─────────────── HERO ─────────────────── */}
        <section className="flex flex-col items-center text-center pt-12 pb-16 gap-7">

          {/* eyebrow badge */}
          <div className="flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--brand)]">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
                <path d="M12 2l2.4 7.6H22l-6.4 4.6 2.4 7.8L12 17.4l-6 4.6 2.4-7.8L2 9.6h7.6z" />
              </svg>
            </span>
            <span className="text-xs font-semibold text-[var(--text-secondary)]">Powered by AI · Free to start</span>
          </div>

          {/* headline */}
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold leading-[1.05] tracking-tight text-[var(--text-primary)] max-w-3xl"
            style={{ fontSize: "clamp(2.1rem, 5.5vw, 3.75rem)" }}>
            The notes app that{" "}
            <span className="relative whitespace-nowrap">
              <span
                className="relative z-10"
                style={{
                  backgroundImage: "linear-gradient(135deg, var(--brand) 0%, var(--brand-strong, #4f46e5) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                thinks with you.
              </span>
              <span
                className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                style={{ background: "linear-gradient(90deg, var(--brand), transparent)" }}
              />
            </span>
          </h1>

          {/* subheadline */}
          <p className="max-w-xl text-base leading-7 text-[var(--text-secondary)] sm:text-[1.05rem]">
            Notely turns scattered thoughts into a structured, searchable knowledge base —
            with AI that summarises, suggests, and answers questions straight from your own notes.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to={loggedIn ? "/notes" : "/signup"}
              className="group inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg active:scale-95"
            >
              {loggedIn ? "Open my workspace" : "Get started free"}
              <svg className="transition-transform group-hover:translate-x-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            {!loggedIn && (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-strong)]"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* social proof */}
          <div className="flex items-center gap-3 pt-1">
            <div className="flex -space-x-2">
              {avatars.map((a) => (
                <span key={a}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--surface)] bg-[var(--brand)] text-[10px] font-bold text-white">
                  {a}
                </span>
              ))}
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Trusted by <span className="font-semibold text-[var(--text-primary)]">1,200+ users</span> to organise their thinking
            </p>
          </div>

          {/* hero visual */}
          <div className="relative mt-4 w-full max-w-5xl px-2 sm:px-0">
            <div className="pointer-events-none absolute inset-x-12 top-6 -z-10 h-48 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(15,118,110,0.14) 0%, rgba(14,165,233,0.1) 35%, transparent 70%)" }} />

            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative overflow-hidden rounded-[28px] border border-[var(--surface-border)] bg-[var(--surface)] p-4 text-left shadow-[var(--shadow-xl)]">
                <div className="absolute inset-x-0 top-0 h-20"
                  style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.18), transparent)" }} />

                <div className="flex flex-wrap items-center gap-2 border-b border-[var(--surface-border)] pb-3">
                  <span className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-[11px] font-semibold text-[var(--brand-strong)]">
                    Product strategy
                  </span>
                  <span className="rounded-full border border-[var(--surface-border)] bg-[var(--surface-strong)] px-3 py-1 text-[11px] font-medium text-[var(--text-secondary)]">
                    Updated 2 min ago
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <div className="h-3 w-28 rounded-full bg-[var(--brand-soft)]" />
                    <div className="h-4 w-[78%] rounded-full bg-[var(--surface-strong)]" />
                    <div className="h-4 w-[92%] rounded-full bg-[var(--surface-strong)]" />
                    <div className="h-4 w-[66%] rounded-full bg-[var(--surface-strong)]" />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {heroPills.map((pill, index) => (
                      <div
                        key={pill}
                        className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-strong)] px-3 py-3"
                        style={{
                          boxShadow: index === 0 ? "0 10px 30px rgba(15, 118, 110, 0.08)" : "none",
                        }}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                          Insight
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{pill}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-strong)] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Ask Notely</p>
                        <p className="mt-1 text-sm text-[var(--text-primary)]">What did I decide about launch timing?</p>
                      </div>
                      <span className="rounded-full bg-[var(--brand-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--brand-strong)]">
                        3 notes matched
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                      Launch stays in July, but onboarding copy and pricing tiers need one more review before announcement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[26px] border border-[var(--surface-border)] bg-[var(--surface)] p-4 text-left shadow-[var(--shadow-xl)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Daily flow</p>
                      <h3 className="mt-1 font-['Plus_Jakarta_Sans'] text-lg font-bold text-[var(--text-primary)]">
                        Capture. Connect. Ask.
                      </h3>
                    </div>
                    <span className="rounded-xl bg-[var(--surface-strong)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-strong)]">
                      Live
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {[
                      ["Drop in notes", "Import PDFs, docs, and quick thoughts in one workspace."],
                      ["Auto-structure", "Titles, summaries, and keywords appear without extra work."],
                      ["Ask in plain English", "Get answers grounded in your own notes, not generic web text."],
                    ].map(([title, copy]) => (
                      <div key={title} className="flex gap-3 rounded-2xl bg-[var(--surface-strong)] px-3 py-3">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-xs font-bold text-[var(--brand-strong)]">
                          •
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
                          <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">{copy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[26px] border border-[var(--surface-border)] bg-[var(--surface)] p-4 text-left shadow-[var(--shadow-xl)]">
                  <div className="absolute right-4 top-4 h-16 w-16 rounded-full opacity-20"
                    style={{ background: "radial-gradient(circle, rgba(14,165,233,0.5), transparent 70%)" }} />
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)]">Why it feels different</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    Notely is less like a blank page and more like a second brain with taste: calm writing space, strong organisation, and an AI layer that actually helps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── FEATURE CARDS ─────────────────── */}
        <section>
          <div className="mb-7 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-secondary)]">Everything you need</p>
            <h2 className="mt-1.5 font-['Plus_Jakarta_Sans'] text-2xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-3xl">
              Built for how you actually think
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-md mx-auto">
              Six tools in one workspace — no plugins, no integrations, no duct tape.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              >
                {/* hover glow */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{ background: `radial-gradient(circle at top left, ${f.accent}18 0%, transparent 55%)` }}
                />
                {/* top accent line */}
                <div
                  className="absolute top-0 left-5 right-5 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, ${f.accent}, transparent)` }}
                />

                {/* icon badge */}
                <span
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105"
                  style={{ background: f.accentSoft, color: f.accent }}
                >
                  {f.icon}
                </span>

                {/* tag */}
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: f.accent }}>
                  {f.tag}
                </p>

                {/* title */}
                <h3 className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold leading-snug text-[var(--text-primary)]">
                  {f.title}
                </h3>

                {/* desc */}
                <p className="mt-2 text-xs leading-[1.7] text-[var(--text-secondary)]">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─────────────── BOTTOM CTA ─────────────────── */}
        <section className="mt-10">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] px-6 py-10 text-center sm:px-12">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.07) 0%, transparent 65%)" }}
            />
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-secondary)]">Ready when you are</p>
            <h2 className="mt-2 font-['Plus_Jakarta_Sans'] text-2xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-3xl">
              Start building your knowledge base today.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
              No credit card. No complicated setup. Sign up and your workspace is ready in seconds.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to={loggedIn ? "/notes" : "/signup"}
                className="group inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
              >
                {loggedIn ? "Go to my notes" : "Create free account"}
                <svg className="transition-transform group-hover:translate-x-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              {!loggedIn && (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-strong)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface)]"
                >
                  I already have an account
                </Link>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
