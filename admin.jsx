/* ============================================================
   admin.jsx — Admin panel (restricted to is_admin users)
   ============================================================ */

const MONTHLY_PRICE = 7.99; // monthly plan price; annual = $47.94/yr (~$3.99/mo)

/* ── Chart helpers ───────────────────────────────────────── */
function getLast12Months() {
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    months.push({
      label: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      year: d.getFullYear(),
      month: d.getMonth(),
    });
  }
  return months;
}

function buildChartData(subscribers) {
  const months = getLast12Months();
  let cumulative = 0;

  // count subs created before window starts
  const windowStart = new Date();
  windowStart.setDate(1);
  windowStart.setMonth(windowStart.getMonth() - 11);
  subscribers.forEach(s => {
    if (s.created_at && new Date(s.created_at) < windowStart) cumulative++;
  });

  const newPerMonth = months.map(m => {
    return subscribers.filter(s => {
      if (!s.created_at) return false;
      const d = new Date(s.created_at);
      return d.getFullYear() === m.year && d.getMonth() === m.month;
    }).length;
  });

  const cumulativePerMonth = newPerMonth.map(n => {
    cumulative += n;
    return cumulative;
  });

  const subscribedPerMonth = months.map(m => {
    return subscribers.filter(s => {
      if (!s.subscribed || !s.subscribed_at) return false;
      const d = new Date(s.subscribed_at);
      return d.getFullYear() === m.year && d.getMonth() === m.month;
    }).length;
  });

  let cumSubs = 0;
  const activeSubs = subscribers.filter(s => s.subscribed).length;
  // build revenue curve — cumulative active subs × price per month
  let cumSubsArr = [];
  let running = 0;
  subscribedPerMonth.forEach(n => { running += n; cumSubsArr.push(running); });

  return {
    labels: months.map(m => m.label),
    newPerMonth,
    cumulativePerMonth,
    revenuePerMonth: cumSubsArr.map(n => parseFloat((n * MONTHLY_PRICE).toFixed(2))),
  };
}

/* ── Tiny chart component ────────────────────────────────── */
function AdminChart({ id, type, labels, datasets, height = 220 }) {
  const { useEffect, useRef } = React;
  const ref = useRef();
  const chartRef = useRef();

  useEffect(() => {
    if (!ref.current || !window.Chart) return;
    if (chartRef.current) chartRef.current.destroy();

    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const gridColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
    const tickColor = isDark ? "#888" : "#999";

    chartRef.current = new window.Chart(ref.current, {
      type,
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: datasets.length > 1, labels: { color: tickColor, font: { family: "Archivo", size: 11 }, boxWidth: 12, padding: 16 } },
          tooltip: {
            backgroundColor: isDark ? "#111" : "#000",
            titleColor: "#fff",
            bodyColor: "#ccc",
            padding: 12,
            cornerRadius: 0,
            titleFont: { family: "Archivo", weight: "700", size: 12 },
            bodyFont: { family: "Archivo", size: 12 },
          },
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { family: "Archivo", size: 11 } } },
          y: { grid: { color: gridColor }, ticks: { color: tickColor, font: { family: "Archivo", size: 11 }, precision: 0 }, beginAtZero: true },
        },
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [labels, datasets]);

  return (
    <div style={{ position: "relative", height }}>
      <canvas ref={ref} id={id}/>
    </div>
  );
}

/* ── Main AdminPage ──────────────────────────────────────── */
function AdminPage({ user, isAdmin, setPage }) {
  const { useState, useEffect, useRef } = React;
  const [activeTab, setActiveTab] = useState("overview");

  /* Subscribers */
  const [subscribers, setSubscribers] = useState([]);
  const [subLoading, setSubLoading]   = useState(true);
  const [saving, setSaving]           = useState({});
  const [search, setSearch]           = useState("");

  /* Recipes */
  const [dbRecipes, setDbRecipes]       = useState([]);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [showForm, setShowForm]         = useState(false);
  const [formData, setFormData]         = useState({ name: "", n: "", tags: "", serves: "" });
  const [ingredients, setIngredients]   = useState([]);
  const [steps, setSteps]               = useState([]);
  const [imgFile, setImgFile]           = useState(null);
  const [imgPreview, setImgPreview]     = useState("");
  const [submitting, setSubmitting]     = useState(false);
  const [formMsg, setFormMsg]           = useState("");
  const imgInputRef = useRef();

  useEffect(() => {
    if (!isAdmin) return;
    fetchSubscribers();
    fetchDbRecipes();
  }, [isAdmin]);

  /* ── Data fetching ───────────────────────────────────────── */
  const fetchSubscribers = async () => {
    setSubLoading(true);
    const { data } = await supabase
      .from("subscribers")
      .select("id, email, subscribed, subscribed_at, created_at, is_admin")
      .order("created_at", { ascending: false });
    if (data) setSubscribers(data);
    setSubLoading(false);
  };

  const fetchDbRecipes = async () => {
    setRecipeLoading(true);
    const { data } = await supabase.from("recipes").select("*").order("created_at", { ascending: true });
    if (data) setDbRecipes(data);
    setRecipeLoading(false);
  };

  /* ── Subscriber actions ──────────────────────────────────── */
  const toggleSubscribed = async (id, current) => {
    setSaving(s => ({ ...s, [id]: true }));
    const { error } = await supabase
      .from("subscribers")
      .update({ subscribed: !current, subscribed_at: !current ? new Date().toISOString() : null })
      .eq("id", id);
    if (!error) setSubscribers(prev => prev.map(s => s.id === id ? { ...s, subscribed: !current, subscribed_at: !current ? new Date().toISOString() : null } : s));
    setSaving(s => ({ ...s, [id]: false }));
  };

  const deleteUser = async (id, email) => {
    if (!confirm(`Remove ${email}?`)) return;
    setSaving(s => ({ ...s, [id]: true }));
    await supabase.from("subscribers").delete().eq("id", id);
    setSubscribers(prev => prev.filter(s => s.id !== id));
    setSaving(s => ({ ...s, [id]: false }));
  };

  /* ── Recipe actions ──────────────────────────────────────── */
  const resetForm = () => { setFormData({ name: "", n: "", tags: "", serves: "" }); setIngredients([]); setSteps([]); setImgFile(null); setImgPreview(""); setFormMsg(""); setShowForm(false); };
  const addIngSection = () => setIngredients(p => [...p, { type: "section", value: "" }]);
  const addIngItem    = () => setIngredients(p => [...p, { type: "item", name: "", amount: "" }]);
  const updateIng = (i, f, v) => setIngredients(p => p.map((x, idx) => idx === i ? { ...x, [f]: v } : x));
  const removeIng = (i) => setIngredients(p => p.filter((_, idx) => idx !== i));
  const moveIng   = (i, dir) => { const a = [...ingredients]; const j = i + dir; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; setIngredients(a); };
  const addStepSection = () => setSteps(p => [...p, { type: "section", value: "" }]);
  const addStepItem    = () => setSteps(p => [...p, { type: "step", text: "" }]);
  const updateStep = (i, f, v) => setSteps(p => p.map((x, idx) => idx === i ? { ...x, [f]: v } : x));
  const removeStep = (i) => setSteps(p => p.filter((_, idx) => idx !== i));
  const moveStep   = (i, dir) => { const a = [...steps]; const j = i + dir; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; setSteps(a); };
  const onImgChange = (e) => { const f = e.target.files[0]; if (!f) return; setImgFile(f); setImgPreview(URL.createObjectURL(f)); };
  const uploadImage = async (file) => {
    const ext = file.name.split(".").pop();
    const path = `recipe-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("recipe-images").upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("recipe-images").getPublicUrl(path);
    return data.publicUrl;
  };
  const submitRecipe = async (e) => {
    e.preventDefault(); setSubmitting(true); setFormMsg("");
    try {
      let imgUrl = "";
      if (imgFile) imgUrl = await uploadImage(imgFile);
      const ingredientsData = ingredients.map(x => x.type === "section" ? { section: x.value } : { name: x.name, amount: x.amount, img: "" });
      const stepsData = steps.map(x => x.type === "section" ? { section: x.value } : { text: x.text });
      const tags = formData.tags.split(",").map(t => t.trim()).filter(Boolean);
      const { error } = await supabase.from("recipes").insert({ n: formData.n, name: formData.name, tags, serves: formData.serves, img: imgUrl, ingredients: ingredientsData, steps: stepsData, published: true });
      if (error) throw error;
      setFormMsg("✓ Recipe saved!");
      fetchDbRecipes();
      resetForm();
    } catch (err) { setFormMsg("Error: " + err.message); }
    finally { setSubmitting(false); }
  };
  const deleteRecipe = async (id) => {
    if (!confirm("Delete this recipe?")) return;
    await supabase.from("recipes").delete().eq("id", id);
    setDbRecipes(prev => prev.filter(r => r.id !== id));
  };

  /* ── Derived stats ───────────────────────────────────────── */
  const totalUsers    = subscribers.length;
  const activeSubs    = subscribers.filter(s => s.subscribed).length;
  const convRate      = totalUsers > 0 ? ((activeSubs / totalUsers) * 100).toFixed(1) : "0";
  const mrr           = (activeSubs * MONTHLY_PRICE).toFixed(2);
  const arr           = (activeSubs * MONTHLY_PRICE * 12).toFixed(2);
  const chartData     = buildChartData(subscribers);
  const filtered      = subscribers.filter(s => s.email?.toLowerCase().includes(search.toLowerCase()));

  const fmt = (n) => Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  /* ── Guards ──────────────────────────────────────────────── */
  if (!user) return (
    <div className="page"><div className="container" style={{ paddingTop: 120, textAlign: "center" }}>
      <h1 style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: "clamp(32px,5vw,64px)", textTransform: "uppercase" }}>Admin</h1>
      <p style={{ color: "var(--muted)", marginBottom: 32 }}>You need to be logged in.</p>
      <button className="btn" onClick={() => openAuthModal("login")}>Log In</button>
    </div></div>
  );
  if (!isAdmin) return (
    <div className="page"><div className="container" style={{ paddingTop: 120, textAlign: "center" }}>
      <h1 style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: "clamp(32px,5vw,64px)", textTransform: "uppercase" }}>Not authorized.</h1>
      <p style={{ color: "var(--muted)" }}>This page is restricted.</p>
    </div></div>
  );

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <div className="page">

      {/* ── Hero bar ── */}
      <div className="admin-hero">
        <div className="container">
          <div className="admin-hero-top">
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5, marginBottom: 6 }}>Admin Panel</div>
              <h1 className="admin-hero-title">Backend</h1>
            </div>
            <div style={{ fontSize: 13, opacity: 0.5 }}>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
          </div>

          {/* Key metrics */}
          <div className="admin-kpis">
            <div className="admin-kpi">
              <div className="admin-kpi-label">MRR</div>
              <div className="admin-kpi-val">${fmt(mrr)}</div>
              <div className="admin-kpi-sub">monthly recurring</div>
            </div>
            <div className="admin-kpi">
              <div className="admin-kpi-label">ARR</div>
              <div className="admin-kpi-val">${fmt(arr)}</div>
              <div className="admin-kpi-sub">annual run rate</div>
            </div>
            <div className="admin-kpi">
              <div className="admin-kpi-label">Subscribers</div>
              <div className="admin-kpi-val">{activeSubs}</div>
              <div className="admin-kpi-sub">active paying</div>
            </div>
            <div className="admin-kpi">
              <div className="admin-kpi-label">Accounts</div>
              <div className="admin-kpi-val">{totalUsers}</div>
              <div className="admin-kpi-sub">total signups</div>
            </div>
            <div className="admin-kpi">
              <div className="admin-kpi-label">Conversion</div>
              <div className="admin-kpi-val">{convRate}%</div>
              <div className="admin-kpi-sub">signup → paid</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 80 }}>

        {/* ── Charts ── */}
        <div className="admin-charts">
          <div className="admin-chart-card">
            <div className="admin-chart-title">Monthly Revenue <span className="admin-chart-note">projected · $3.99/subscriber</span></div>
            {subLoading ? <div className="admin-chart-empty">Loading…</div> : (
              <AdminChart
                id="chart-revenue"
                type="line"
                labels={chartData.labels}
                datasets={[{
                  label: "MRR ($)",
                  data: chartData.revenuePerMonth,
                  borderColor: "var(--accent)",
                  backgroundColor: "rgba(184,68,42,0.08)",
                  borderWidth: 2,
                  fill: true,
                  tension: 0.4,
                  pointRadius: 3,
                  pointBackgroundColor: "var(--accent)",
                }]}
              />
            )}
          </div>

          <div className="admin-chart-card">
            <div className="admin-chart-title">Subscriber Growth <span className="admin-chart-note">cumulative</span></div>
            {subLoading ? <div className="admin-chart-empty">Loading…</div> : (
              <AdminChart
                id="chart-growth"
                type="line"
                labels={chartData.labels}
                datasets={[
                  {
                    label: "Total accounts",
                    data: chartData.cumulativePerMonth,
                    borderColor: "#555",
                    backgroundColor: "rgba(0,0,0,0.04)",
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: "#555",
                  },
                ]}
              />
            )}
          </div>

          <div className="admin-chart-card">
            <div className="admin-chart-title">New Signups <span className="admin-chart-note">per month</span></div>
            {subLoading ? <div className="admin-chart-empty">Loading…</div> : (
              <AdminChart
                id="chart-signups"
                type="bar"
                labels={chartData.labels}
                datasets={[{
                  label: "New accounts",
                  data: chartData.newPerMonth,
                  backgroundColor: "var(--accent)",
                  borderRadius: 2,
                }]}
              />
            )}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="admin-tabs">
          <button className={"admin-tab-btn" + (activeTab === "overview" ? " active" : "")} onClick={() => setActiveTab("overview")}>Subscribers</button>
          <button className={"admin-tab-btn" + (activeTab === "recipes" ? " active" : "")} onClick={() => setActiveTab("recipes")}>Recipes</button>
        </div>

        {/* ── Subscribers tab ── */}
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
              <h2 className="admin-section-title">All Users</h2>
              <div style={{ display: "flex", gap: 12 }}>
                <input className="admin-search" type="text" placeholder="Search by email…" value={search} onChange={e => setSearch(e.target.value)}/>
                <button className="btn ghost" onClick={fetchSubscribers}>↺ Refresh</button>
              </div>
            </div>
            {subLoading ? <p style={{ color: "var(--muted)" }}>Loading…</p>
            : filtered.length === 0 ? <p style={{ color: "var(--muted)" }}>No users found.</p>
            : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Email</th><th>Joined</th><th>Subscribed</th><th>Since</th><th>Role</th><th></th></tr>
                  </thead>
                  <tbody>
                    {filtered.map(s => (
                      <tr key={s.id} className={s.subscribed ? "admin-row--sub" : ""}>
                        <td className="admin-email">{s.email}</td>
                        <td className="admin-date">{s.created_at ? new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                        <td>
                          <button className={"admin-toggle" + (s.subscribed ? " on" : "")} onClick={() => toggleSubscribed(s.id, s.subscribed)} disabled={saving[s.id]}>
                            {saving[s.id] ? "…" : s.subscribed ? "✓ Active" : "Off"}
                          </button>
                        </td>
                        <td className="admin-date">{s.subscribed_at ? new Date(s.subscribed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                        <td><span className={"admin-badge" + (s.is_admin ? " admin" : "")}>{s.is_admin ? "Admin" : "User"}</span></td>
                        <td>{!s.is_admin && <button className="admin-delete" onClick={() => deleteUser(s.id, s.email)} disabled={saving[s.id]}>×</button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Recipes tab ── */}
        {activeTab === "recipes" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
              <h2 className="admin-section-title">Recipes</h2>
              <button className="btn" onClick={() => { setShowForm(!showForm); setFormMsg(""); }}>{showForm ? "Cancel" : "+ Add Recipe"}</button>
            </div>

            {showForm && (
              <form onSubmit={submitRecipe} className="recipe-form">
                <h3 className="recipe-form-title">New Recipe</h3>
                <div className="recipe-form-row">
                  <div className="recipe-form-field">
                    <label>Recipe Name *</label>
                    <input className="admin-input" type="text" placeholder="e.g. Brown Butter Scallops" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}/>
                  </div>
                  <div className="recipe-form-field" style={{ maxWidth: 120 }}>
                    <label>No. *</label>
                    <input className="admin-input" type="text" placeholder="13" required value={formData.n} onChange={e => setFormData(p => ({ ...p, n: e.target.value }))}/>
                  </div>
                </div>
                <div className="recipe-form-row">
                  <div className="recipe-form-field">
                    <label>Tags (comma-separated)</label>
                    <input className="admin-input" type="text" placeholder="Mains, Comfort" value={formData.tags} onChange={e => setFormData(p => ({ ...p, tags: e.target.value }))}/>
                  </div>
                  <div className="recipe-form-field" style={{ maxWidth: 160 }}>
                    <label>Serves</label>
                    <input className="admin-input" type="text" placeholder="2–4" value={formData.serves} onChange={e => setFormData(p => ({ ...p, serves: e.target.value }))}/>
                  </div>
                </div>
                <div className="recipe-form-field" style={{ marginBottom: 0 }}>
                  <label>Photo</label>
                  <div className="recipe-form-img-row">
                    {imgPreview && <img src={imgPreview} style={{ width: 72, height: 72, objectFit: "cover" }} alt="preview"/>}
                    <button type="button" className="btn ghost" onClick={() => imgInputRef.current.click()}>{imgFile ? "Change Photo" : "Upload Photo"}</button>
                    {imgFile && <span style={{ fontSize: 13, color: "var(--muted)" }}>{imgFile.name}</span>}
                    <input ref={imgInputRef} type="file" accept="image/*,.heic" style={{ display: "none" }} onChange={onImgChange}/>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>Requires "recipe-images" public bucket in Supabase Storage.</p>
                </div>

                {/* Ingredients */}
                <div className="recipe-form-section">
                  <div className="recipe-form-section-head">
                    <span>Ingredients</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button type="button" className="btn ghost" style={{ fontSize: 12, padding: "6px 12px" }} onClick={addIngSection}>+ Section</button>
                      <button type="button" className="btn ghost" style={{ fontSize: 12, padding: "6px 12px" }} onClick={addIngItem}>+ Ingredient</button>
                    </div>
                  </div>
                  {ingredients.length === 0 && <p style={{ color: "var(--muted)", fontSize: 13 }}>No ingredients yet.</p>}
                  {ingredients.map((ing, i) => (
                    <div key={i} className={"recipe-form-entry" + (ing.type === "section" ? " section-entry" : "")}>
                      {ing.type === "section"
                        ? <input className="admin-input" type="text" placeholder="Section name" value={ing.value} onChange={e => updateIng(i, "value", e.target.value)}/>
                        : <div style={{ display: "flex", gap: 8, flex: 1 }}>
                            <input className="admin-input" type="text" placeholder="Ingredient" value={ing.name} onChange={e => updateIng(i, "name", e.target.value)} style={{ flex: 2 }}/>
                            <input className="admin-input" type="text" placeholder="Amount" value={ing.amount} onChange={e => updateIng(i, "amount", e.target.value)} style={{ flex: 1 }}/>
                          </div>
                      }
                      <div className="recipe-form-entry-actions">
                        <button type="button" onClick={() => moveIng(i, -1)}>↑</button>
                        <button type="button" onClick={() => moveIng(i, 1)}>↓</button>
                        <button type="button" onClick={() => removeIng(i)} style={{ color: "#c0392b" }}>×</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Steps */}
                <div className="recipe-form-section">
                  <div className="recipe-form-section-head">
                    <span>Steps</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button type="button" className="btn ghost" style={{ fontSize: 12, padding: "6px 12px" }} onClick={addStepSection}>+ Section</button>
                      <button type="button" className="btn ghost" style={{ fontSize: 12, padding: "6px 12px" }} onClick={addStepItem}>+ Step</button>
                    </div>
                  </div>
                  {steps.length === 0 && <p style={{ color: "var(--muted)", fontSize: 13 }}>No steps yet.</p>}
                  {steps.map((step, i) => (
                    <div key={i} className={"recipe-form-entry" + (step.type === "section" ? " section-entry" : "")}>
                      {step.type === "section"
                        ? <input className="admin-input" type="text" placeholder="Section name" value={step.value} onChange={e => updateStep(i, "value", e.target.value)}/>
                        : <textarea className="admin-input admin-textarea" placeholder="Write the step…" value={step.text} onChange={e => updateStep(i, "text", e.target.value)} rows={3}/>
                      }
                      <div className="recipe-form-entry-actions">
                        <button type="button" onClick={() => moveStep(i, -1)}>↑</button>
                        <button type="button" onClick={() => moveStep(i, 1)}>↓</button>
                        <button type="button" onClick={() => removeStep(i)} style={{ color: "#c0392b" }}>×</button>
                      </div>
                    </div>
                  ))}
                </div>

                {formMsg && <p style={{ color: formMsg.startsWith("Error") ? "#c0392b" : "#3b8262", fontWeight: 600, marginTop: 8 }}>{formMsg}</p>}
                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                  <button className="btn" type="submit" disabled={submitting}>{submitting ? "Saving…" : "Save Recipe"}</button>
                  <button className="btn ghost" type="button" onClick={resetForm}>Cancel</button>
                </div>
              </form>
            )}

            {recipeLoading ? <p style={{ color: "var(--muted)", marginTop: 24 }}>Loading…</p>
            : dbRecipes.length === 0 && !showForm ? <p style={{ color: "var(--muted)", marginTop: 24 }}>No recipes added yet.</p>
            : dbRecipes.length > 0 ? (
              <div className="admin-table-wrap" style={{ marginTop: showForm ? 40 : 0 }}>
                <table className="admin-table">
                  <thead><tr><th>No.</th><th>Name</th><th>Tags</th><th>Serves</th><th>Added</th><th></th></tr></thead>
                  <tbody>
                    {dbRecipes.map(r => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 700 }}>№ {r.n}</td>
                        <td className="admin-email">{r.name}</td>
                        <td><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{(r.tags || []).map((t, i) => <span key={i} className="recipe-tag" style={{ fontSize: 11 }}>{t}</span>)}</div></td>
                        <td className="admin-date">{r.serves || "—"}</td>
                        <td className="admin-date">{r.created_at ? new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                        <td><button className="admin-delete" onClick={() => deleteRecipe(r.id)}>×</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
}

Object.assign(window, { AdminPage });
