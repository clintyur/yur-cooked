/* ============================================================
   admin.jsx — Admin panel (restricted to is_admin users)
   ============================================================ */

function AdminPage({ user, isAdmin, setPage }) {
  const { useState, useEffect } = React;

  const [subscribers, setSubscribers]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState({});
  const [search, setSearch]             = useState("");
  const [stats, setStats]               = useState({ total: 0, subscribed: 0 });

  useEffect(() => {
    if (!isAdmin) return;
    fetchSubscribers();
  }, [isAdmin]);

  const fetchSubscribers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("subscribers")
      .select("id, email, subscribed, tier, discount_code, subscribed_at, created_at, is_admin")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSubscribers(data);
      setStats({
        total: data.length,
        subscribed: data.filter(s => s.subscribed).length,
      });
    }
    setLoading(false);
  };

  const toggleSubscribed = async (id, current) => {
    setSaving(s => ({ ...s, [id]: true }));
    const { error } = await supabase
      .from("subscribers")
      .update({ subscribed: !current, subscribed_at: !current ? new Date().toISOString() : null })
      .eq("id", id);
    if (!error) {
      setSubscribers(prev =>
        prev.map(s => s.id === id ? { ...s, subscribed: !current } : s)
      );
      setStats(st => ({
        ...st,
        subscribed: st.subscribed + (!current ? 1 : -1),
      }));
    }
    setSaving(s => ({ ...s, [id]: false }));
  };

  const deleteUser = async (id, email) => {
    if (!confirm(`Remove ${email} from the database? This does not delete their auth account.`)) return;
    setSaving(s => ({ ...s, [id]: true }));
    await supabase.from("subscribers").delete().eq("id", id);
    setSubscribers(prev => prev.filter(s => s.id !== id));
    setStats(st => ({ total: st.total - 1, subscribed: st.subscribed }));
    setSaving(s => ({ ...s, [id]: false }));
  };

  const filtered = subscribers.filter(s =>
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) {
    return (
      <div className="page admin-page">
        <div className="container" style={{ paddingTop: 120, textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: "clamp(32px,5vw,64px)", textTransform: "uppercase", letterSpacing: "-0.03em" }}>
            Admin
          </h1>
          <p style={{ color: "var(--muted)", marginBottom: 32 }}>You need to be logged in.</p>
          <button className="btn" onClick={() => openAuthModal("login")}>Log In</button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="page admin-page">
        <div className="container" style={{ paddingTop: 120, textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: "clamp(32px,5vw,64px)", textTransform: "uppercase", letterSpacing: "-0.03em" }}>
            Not authorized.
          </h1>
          <p style={{ color: "var(--muted)" }}>This page is restricted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page admin-page">
      <div className="container" style={{ paddingTop: 100, paddingBottom: 80 }}>

        {/* Header */}
        <div style={{ borderBottom: "1px solid var(--rule)", paddingBottom: 32, marginBottom: 48 }}>
          <div className="eyebrow"><span className="dot"></span>Admin Panel</div>
          <h1 style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: "clamp(40px,6vw,80px)", textTransform: "uppercase", letterSpacing: "-0.03em", margin: "8px 0 0" }}>
            Backend
          </h1>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="admin-stat">
            <div className="admin-stat-num">{stats.total}</div>
            <div className="admin-stat-lbl">Total accounts</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-num">{stats.subscribed}</div>
            <div className="admin-stat-lbl">Active subscribers</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-num">{stats.total - stats.subscribed}</div>
            <div className="admin-stat-lbl">Not subscribed</div>
          </div>
        </div>

        {/* Subscribers table */}
        <div style={{ marginTop: 56 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
            <h2 style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: "clamp(22px,3vw,36px)", textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0 }}>
              Users
            </h2>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <input
                className="admin-search"
                type="text"
                placeholder="Search by email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className="btn ghost" onClick={fetchSubscribers} style={{ whiteSpace: "nowrap" }}>
                ↺ Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <p style={{ color: "var(--muted)" }}>Loading…</p>
          ) : filtered.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>No users found.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Subscribed</th>
                    <th>Since</th>
                    <th>Role</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id} className={s.subscribed ? "admin-row--sub" : ""}>
                      <td className="admin-email">{s.email}</td>
                      <td className="admin-date">{s.created_at ? new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                      <td>
                        <button
                          className={"admin-toggle" + (s.subscribed ? " on" : "")}
                          onClick={() => toggleSubscribed(s.id, s.subscribed)}
                          disabled={saving[s.id]}
                        >
                          {saving[s.id] ? "…" : s.subscribed ? "✓ Active" : "Off"}
                        </button>
                      </td>
                      <td className="admin-date">{s.subscribed_at ? new Date(s.subscribed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                      <td>
                        <span className={"admin-badge" + (s.is_admin ? " admin" : "")}>
                          {s.is_admin ? "Admin" : "User"}
                        </span>
                      </td>
                      <td>
                        {!s.is_admin && (
                          <button
                            className="admin-delete"
                            onClick={() => deleteUser(s.id, s.email)}
                            disabled={saving[s.id]}
                            title="Remove from database"
                          >
                            ×
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

Object.assign(window, { AdminPage });
