/* global React */
const { useState, useEffect, useRef } = React;

/* ============ Icons ============ */
const Icon = {
  arrow: (p) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}>
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  arrowLg: (p) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M3 10h14M12 4l5 6-5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ig: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor"/>
    </svg>
  ),
  yt: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M10 9.5v5l4.5-2.5L10 9.5z" fill="currentColor"/>
    </svg>
  ),
  tt: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M14 4c.5 2.5 2.5 4.5 5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  close: (p) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}>
      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
};

/* ============ Nav ============ */
function Nav({ page, setPage, user, isAdmin }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [page]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  const links = [
    ["recipe", "Recipes"],
    ["shop", "Shop"],
    ["subscribe", "Subscribe"],
    ["about", "About"],
    ["contact", "Contact"],
  ];
  const go = (p) => (e) => { e.preventDefault(); setPage(p); window.scrollTo({ top: 0, behavior: "instant" }); };
  const logout = async (e) => { e.preventDefault(); await supabase.auth.signOut(); };
  return (
    <>
      <header className="nav">
        <div className="container nav-row">
          <a href="#" onClick={go("home")} className="logo">
            yur cooked.
          </a>
          <nav className="nav-links">
            {links.map(([k, l]) => (
              <a key={k} href="#" onClick={go(k)} className={"nav-link" + (page === k ? " active" : "")}>{l}</a>
            ))}
            {isAdmin && (
              <a href="#" onClick={go("admin")} className={"nav-link" + (page === "admin" ? " active" : "")} style={{ color: "var(--accent)" }}>Admin</a>
            )}
            {user
              ? <a href="#" onClick={logout} className="nav-link">Log Out</a>
              : <a href="#" onClick={(e) => { e.preventDefault(); openAuthModal("login"); }} className="nav-link">Log In</a>
            }
          </nav>
          <button className={"nav-burger" + (open ? " open" : "")} onClick={() => setOpen(!open)} aria-label="Menu">
            <span></span><span></span>
          </button>
        </div>
      </header>
      <div className={"mobile-menu" + (open ? " open" : "")}>
        <a href="#" onClick={go("home")} className="nav-link">Home</a>
        {links.map(([k, l]) => (
          <a key={k} href="#" onClick={go(k)} className="nav-link">{l}</a>
        ))}
        {isAdmin && (
          <a href="#" onClick={go("admin")} className="nav-link" style={{ color: "var(--accent)" }}>Admin</a>
        )}
        {user
          ? <a href="#" onClick={logout} className="nav-link">Log Out</a>
          : <a href="#" onClick={(e) => { e.preventDefault(); openAuthModal("login"); }} className="nav-link">Log In</a>
        }
        <div className="mobile-menu-foot">
          <a href="https://instagram.com/clintyurr" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://youtube.com/@ClintYur" target="_blank" rel="noreferrer">YouTube</a>
        </div>
      </div>
    </>
  );
}

/* ============ Footer ============ */
function Footer({ setPage }) {
  const go = (p) => (e) => { e.preventDefault(); setPage(p); window.scrollTo({ top: 0, behavior: "instant" }); };
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-mark">yur cooked.</div>
            <p className="footer-tag">Recipes, goods, and the art of eating well — from a kitchen in New York.</p>
            <div className="cluster" style={{ marginTop: 24 }}>
              <a href="https://instagram.com/clintyurr" target="_blank" rel="noreferrer" className="social-bar" style={{ display: "inline-flex" }}>
                <Icon.ig /> @clintyurr
              </a>
            </div>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><a href="#" onClick={go("recipe")}>Recipes</a></li>
              <li><a href="#" onClick={go("shop")}>Shop</a></li>
              <li><a href="#" onClick={go("about")}>About</a></li>
              <li><a href="#" onClick={go("contact")}>Contact</a></li>
            </ul>
          </div>
          <div>
            <h4>Follow</h4>
            <ul>
              <li><a href="https://instagram.com/clintyurr" target="_blank" rel="noreferrer"><span style={{display:"inline-flex",gap:8,alignItems:"center"}}><Icon.ig/> Instagram</span></a></li>
              <li><a href="https://youtube.com/@ClintYur" target="_blank" rel="noreferrer"><span style={{display:"inline-flex",gap:8,alignItems:"center"}}><Icon.yt/> YouTube</span></a></li>
            </ul>
          </div>
          <div>
            <h4>Inquiries</h4>
            <ul>
              <li><a href="#" onClick={go("contact")}>Private Chef</a></li>
              <li><a href="#" onClick={go("contact")}>Collaborations</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bot">
          <span>© {new Date().getFullYear()} yur cooked. All rights reserved.</span>
          <span>New York, NY</span>
        </div>
      </div>
    </footer>
  );
}

/* ============ Ticker ============ */
function Ticker({ items }) {
  const content = (
    <>
      {items.map((t, i) => (
        <React.Fragment key={i}>
          <span className={i % 2 ? "it" : ""}>{t}</span>
          <span className="sep"></span>
        </React.Fragment>
      ))}
    </>
  );
  return (
    <div className="ticker">
      <div className="ticker-track">
        {content}{content}
      </div>
    </div>
  );
}

/* ============ Promo bar ============ */
function PromoBar({ onClose, setPage }) {
  const goSubscribe = (e) => { e.preventDefault(); if (setPage) setPage("subscribe"); window.scrollTo({ top: 0, behavior: "instant" }); };
  return (
    <div className="promo">
      <div className="container promo-row">
        <span className="promo-spacer"></span>
        <div className="promo-msg">
          <span className="promo-eyebrow">Limited</span>
          <span className="promo-text">
            Unlock <strong>50% off for a year</strong> when you subscribe now
          </span>
          <a href="#" onClick={goSubscribe} className="promo-cta">Subscribe <Icon.arrow/></a>
        </div>
        <button className="promo-close" onClick={onClose} aria-label="Dismiss">
          <Icon.close/>
        </button>
      </div>
    </div>
  );
}

/* ============ Watch / YouTube section ============ */
// Channel: @ClintYur — UCk87vy9lWNcu-vng4vF2WQA
const CLINT_CHANNEL_ID = "UCk87vy9lWNcu-vng4vF2WQA";
const FALLBACK_VIDEOS = [
  { id: "fb1", title: "Latest from @ClintYur", date: "Watch on YouTube", videoId: null, thumb: null, link: "https://youtube.com/@ClintYur" },
  { id: "fb2", title: "Latest from @ClintYur", date: "Watch on YouTube", videoId: null, thumb: null, link: "https://youtube.com/@ClintYur" },
  { id: "fb3", title: "Latest from @ClintYur", date: "Watch on YouTube", videoId: null, thumb: null, link: "https://youtube.com/@ClintYur" },
  { id: "fb4", title: "Latest from @ClintYur", date: "Watch on YouTube", videoId: null, thumb: null, link: "https://youtube.com/@ClintYur" },
];

function fmtDate(s) {
  try {
    const d = new Date(s);
    const now = Date.now();
    const diff = (now - d.getTime()) / 1000;
    if (diff < 60 * 60 * 24 * 2) return "1 day ago";
    if (diff < 60 * 60 * 24 * 14) return Math.round(diff / 86400) + " days ago";
    if (diff < 60 * 60 * 24 * 60) return Math.round(diff / (86400 * 7)) + " weeks ago";
    if (diff < 60 * 60 * 24 * 365) return Math.round(diff / (86400 * 30)) + " months ago";
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch (e) { return ""; }
}

function WatchSection() {
  const [active, setActive] = React.useState(null);
  const [videos, setVideos] = React.useState(FALLBACK_VIDEOS);
  const [status, setStatus] = React.useState("loading"); // loading | live | fallback
  const open = (v) => { if (v.videoId) setActive(v); else if (v.link) window.open(v.link, "_blank", "noopener,noreferrer"); };
  const close = () => setActive(null);

  React.useEffect(() => {
    let cancelled = false;
    const rss = `https://www.youtube.com/feeds/videos.xml?channel_id=${CLINT_CHANNEL_ID}`;
    const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}`;
    fetch(url)
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then((data) => {
        if (cancelled) return;
        if (!data || !data.items || !data.items.length) { setStatus("fallback"); return; }
        const items = data.items.slice(0, 4).map((it, i) => {
          const m = (it.link || "").match(/[?&]v=([\w-]{11})/);
          const vid = m ? m[1] : null;
          return {
            id: vid || ("rss" + i),
            title: it.title || "Untitled",
            date: fmtDate(it.pubDate),
            videoId: vid,
            thumb: vid ? `https://i.ytimg.com/vi/${vid}/hqdefault.jpg` : (it.thumbnail || null),
            link: it.link || null,
          };
        });
        setVideos(items);
        setStatus("live");
      })
      .catch(() => { if (!cancelled) setStatus("fallback"); });
    return () => { cancelled = true; };
  }, []);
  return (
    <>
      <section className="container section watch">
        <div className="section-head">
          <div>
            <div className="eyebrow"><span className="dot"></span>On YouTube</div>
            <h2 className="section-title">Watch.</h2>
          </div>
          <p className="section-lede">Long-form cooking, travel, and the occasional chaos. New videos most weeks at <a href="https://youtube.com/@ClintYur" target="_blank" rel="noreferrer" style={{ borderBottom: "1px solid currentColor" }}>@ClintYur</a>.</p>
        </div>

        <div className="watch-grid">
          {videos.map((v, i) => (
            <button key={v.id} className="watch" onClick={() => open(v)}>
              <div className="watch-thumb" style={{ background: "var(--ink)" }}>
                {v.thumb ? (
                  <img src={v.thumb} alt={v.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}/>
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "var(--cream)", opacity: 0.5, fontFamily: "var(--display)", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase" }}>
                    {status === "loading" ? "Loading…" : "@ClintYur"}
                  </div>
                )}
                <span className="watch-play">
                  <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                    <path d="M0 0v20l18-10L0 0z" fill="currentColor"/>
                  </svg>
                </span>
              </div>
              <div className="watch-meta">
                <span className="watch-num">№ 0{i + 1}</span>
                <span className="watch-date">{v.date}</span>
              </div>
              <h3 className="watch-title">{v.title}</h3>
            </button>
          ))}
        </div>

        <div className="watch-footer">
          <a href="https://youtube.com/@ClintYur" target="_blank" rel="noreferrer" className="btn ghost">
            <Icon.yt/> Subscribe on YouTube <Icon.arrow className="arrow"/>
          </a>
        </div>
      </section>

      <div className={"modal-bg" + (active ? " open" : "")} onClick={close}>
        {active && (
          <div className="modal video-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={close}><Icon.close/></button>
            <div className="video-player">
              {active.videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${active.videoId}?autoplay=1`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  title={active.title}
                  frameBorder="0"
                />
              ) : (
                <div className="video-fallback">
                  <Icon.yt/>
                  <a href={active.link || "https://youtube.com/@ClintYur"} target="_blank" rel="noreferrer" className="btn" style={{ marginTop: 16 }}>Watch on YouTube <Icon.arrow className="arrow"/></a>
                </div>
              )}
            </div>
            <div className="video-info">
              <div className="eyebrow"><span className="dot"></span>{active.date}</div>
              <h2 className="watch-title" style={{ fontSize: 28, marginTop: 12, lineHeight: 1.15 }}>{active.title}</h2>
              <a href={active.link || "https://youtube.com/@ClintYur"} target="_blank" rel="noreferrer" className="link-arrow" style={{ marginTop: 16, display: "inline-flex" }}>Open on YouTube <Icon.arrow className="arrow"/></a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ============ Signup Modal ============ */
// ─── Paste your Google Apps Script URL here after deploying ───────────────────
const SHEET_URL = "https://script.google.com/macros/s/AKfycbyepLsFHo8vdsoma0CEkHJ5yveH_-FrZ46Dm4-cmVm0qWEhyDBN1GO9iBzfi7ULed3_/exec";
// ─────────────────────────────────────────────────────────────────────────────

function genDiscountCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let c = "YC-";
  for (let i = 0; i < 6; i++) c += chars[Math.floor(Math.random() * chars.length)];
  return c;
}

function SignupModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | done
  const [code, setCode] = useState("");

  useEffect(() => {
    if (localStorage.getItem("yc_signup_seen")) return;
    const t = setTimeout(() => setOpen(true), 2500);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    localStorage.setItem("yc_signup_seen", "1");
    setOpen(false);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    const discountCode = genDiscountCode();
    setCode(discountCode);
    setStatus("submitting");
    fetch(SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, code: discountCode, date: new Date().toISOString() }),
    }).finally(() => {
      setStatus("done");
      localStorage.setItem("yc_signup_seen", "1");
    });
  };

  if (!open) return null;

  return (
    <div className="signup-overlay" onClick={status === "done" ? null : dismiss}>
      <div className="signup-modal" onClick={(e) => e.stopPropagation()}>
        {status !== "done" && (
          <button className="signup-close" onClick={dismiss} aria-label="Close">✕</button>
        )}

        {status === "done" ? (
          <div className="signup-done">
            <span className="signup-done-word">yur in.</span>
            <p>We'll hit you when something drops.</p>
            <div className="signup-code-block">
              <p className="signup-code-label">10% off your first order in the shop</p>
              <div className="signup-code">{code}</div>
              <p className="signup-code-note">Copy this code — use it at checkout. One time use.</p>
            </div>
            <button className="signup-submit" style={{marginTop: 24}} onClick={dismiss}>Close</button>
          </div>
        ) : (
          <>
            <div className="signup-header">
              <span className="signup-logo">yur cooked.</span>
            </div>
            <h2 className="signup-heading">Yur first<br/>to know.</h2>
            <p className="signup-body">New drops, pop-ups, and recipes before anyone else. Sign up and get 10% off your first shop order.</p>
            <form className="signup-form" onSubmit={submit}>
              <input
                className="signup-input"
                type="text"
                placeholder="First name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="signup-input"
                type="email"
                placeholder="Email *"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="signup-input"
                type="tel"
                placeholder="Phone (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button className="signup-submit" type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "Sending..." : "Count me in →"}
              </button>
            </form>
            <p className="signup-fine">No spam. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Icon, Nav, Footer, Ticker, PromoBar, WatchSection, SignupModal });
