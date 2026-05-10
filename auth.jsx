/* ============================================================
   auth.jsx — Supabase auth client + AuthModal
   ============================================================ */

const SUPABASE_URL  = "https://rdnavqlxmmzlapfvlyqw.supabase.co";
const SUPABASE_KEY  = "sb_publishable_WPC9qX-Rki2mQ_ytwT2JVw_MdT890vE";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ── Auth Modal ─────────────────────────────────────────────── */
let _setAuthModalOpen = null;
function openAuthModal(mode) { if (_setAuthModalOpen) _setAuthModalOpen(mode || "login"); }

function AuthModal() {
  const { useState, useEffect, useRef } = React;
  const [open, setOpen]       = useState(false);
  const [mode, setMode]       = useState("login"); // "login" | "signup" | "reset"
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [msg, setMsg]         = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { _setAuthModalOpen = (m) => { setOpen(true); setMode(m || "login"); setError(""); setMsg(""); }; }, []);

  const close = () => { setOpen(false); setEmail(""); setPassword(""); setError(""); setMsg(""); };

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setMsg(""); setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        close();
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Check your email to confirm your account, then come back and log in.");
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.href,
        });
        if (error) throw error;
        setMsg("Password reset email sent. Check your inbox.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="auth-modal">
        <button className="auth-close" onClick={close}>×</button>
        <div className="auth-logo">yur cooked.</div>

        <div className="auth-tabs">
          <button className={"auth-tab" + (mode === "login" ? " active" : "")} onClick={() => { setMode("login"); setError(""); setMsg(""); }}>Log In</button>
          <button className={"auth-tab" + (mode === "signup" ? " active" : "")} onClick={() => { setMode("signup"); setError(""); setMsg(""); }}>Sign Up</button>
        </div>

        {mode === "reset" ? (
          <form onSubmit={submit}>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>Enter your email and we'll send a reset link.</p>
            <input className="auth-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/>
            {error && <p className="auth-error">{error}</p>}
            {msg   && <p className="auth-msg">{msg}</p>}
            <button className="btn" type="submit" disabled={loading} style={{ width: "100%", marginTop: 8 }}>{loading ? "Sending…" : "Send Reset Link"}</button>
            <button type="button" className="auth-link" onClick={() => setMode("login")}>Back to log in</button>
          </form>
        ) : (
          <form onSubmit={submit}>
            <input className="auth-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/>
            <input className="auth-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}/>
            {error && <p className="auth-error">{error}</p>}
            {msg   && <p className="auth-msg">{msg}</p>}
            <button className="btn" type="submit" disabled={loading} style={{ width: "100%", marginTop: 8 }}>
              {loading ? "…" : mode === "login" ? "Log In" : "Create Account"}
            </button>
            {mode === "login" && (
              <button type="button" className="auth-link" onClick={() => setMode("reset")}>Forgot password?</button>
            )}
            {mode === "signup" && (
              <p className="auth-fine">By signing up you agree to our terms. Subscribers get full recipe access + 15% off every shop drop.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { supabase, openAuthModal, AuthModal });
