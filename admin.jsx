/* ============================================================
   admin.jsx — Admin panel (restricted to is_admin users)
   ============================================================ */

function AdminPage({ user, isAdmin, setPage }) {
  const { useState, useEffect, useRef } = React;
  const [activeTab, setActiveTab] = useState("subscribers");

  /* ── Subscribers state ───────────────────────────────────── */
  const [subscribers, setSubscribers] = useState([]);
  const [subLoading, setSubLoading]   = useState(true);
  const [saving, setSaving]           = useState({});
  const [search, setSearch]           = useState("");
  const [stats, setStats]             = useState({ total: 0, subscribed: 0 });

  /* ── Recipes state ───────────────────────────────────────── */
  const [dbRecipes, setDbRecipes]     = useState([]);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [showForm, setShowForm]       = useState(false);
  const [formData, setFormData]       = useState({ name: "", n: "", tags: "", serves: "" });
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps]             = useState([]);
  const [imgFile, setImgFile]         = useState(null);
  const [imgPreview, setImgPreview]   = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [formMsg, setFormMsg]         = useState("");
  const imgInputRef = useRef();

  useEffect(() => {
    if (!isAdmin) return;
    fetchSubscribers();
    fetchDbRecipes();
  }, [isAdmin]);

  /* ── Subscriber helpers ──────────────────────────────────── */
  const fetchSubscribers = async () => {
    setSubLoading(true);
    const { data, error } = await supabase
      .from("subscribers")
      .select("id, email, subscribed, tier, discount_code, subscribed_at, created_at, is_admin")
      .order("created_at", { ascending: false });
    if (!error && data) {
      setSubscribers(data);
      setStats({ total: data.length, subscribed: data.filter(s => s.subscribed).length });
    }
    setSubLoading(false);
  };

  const toggleSubscribed = async (id, current) => {
    setSaving(s => ({ ...s, [id]: true }));
    const { error } = await supabase
      .from("subscribers")
      .update({ subscribed: !current, subscribed_at: !current ? new Date().toISOString() : null })
      .eq("id", id);
    if (!error) {
      setSubscribers(prev => prev.map(s => s.id === id ? { ...s, subscribed: !current } : s));
      setStats(st => ({ ...st, subscribed: st.subscribed + (!current ? 1 : -1) }));
    }
    setSaving(s => ({ ...s, [id]: false }));
  };

  const deleteUser = async (id, email) => {
    if (!confirm(`Remove ${email} from the database?`)) return;
    setSaving(s => ({ ...s, [id]: true }));
    await supabase.from("subscribers").delete().eq("id", id);
    setSubscribers(prev => prev.filter(s => s.id !== id));
    setStats(st => ({ total: st.total - 1, subscribed: st.subscribed }));
    setSaving(s => ({ ...s, [id]: false }));
  };

  const filtered = subscribers.filter(s =>
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Recipe helpers ──────────────────────────────────────── */
  const fetchDbRecipes = async () => {
    setRecipeLoading(true);
    const { data } = await supabase.from("recipes").select("*").order("created_at", { ascending: true });
    if (data) setDbRecipes(data);
    setRecipeLoading(false);
  };

  const resetForm = () => {
    setFormData({ name: "", n: "", tags: "", serves: "" });
    setIngredients([]);
    setSteps([]);
    setImgFile(null);
    setImgPreview("");
    setFormMsg("");
    setShowForm(false);
  };

  /* Ingredients */
  const addIngSection = () => setIngredients(p => [...p, { type: "section", value: "" }]);
  const addIngItem    = () => setIngredients(p => [...p, { type: "item", name: "", amount: "" }]);
  const updateIng = (i, field, val) => setIngredients(p => p.map((x, idx) => idx === i ? { ...x, [field]: val } : x));
  const removeIng = (i) => setIngredients(p => p.filter((_, idx) => idx !== i));
  const moveIng   = (i, dir) => {
    const arr = [...ingredients];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setIngredients(arr);
  };

  /* Steps */
  const addStepSection = () => setSteps(p => [...p, { type: "section", value: "" }]);
  const addStepItem    = () => setSteps(p => [...p, { type: "step", text: "" }]);
  const updateStep = (i, field, val) => setSteps(p => p.map((x, idx) => idx === i ? { ...x, [field]: val } : x));
  const removeStep = (i) => setSteps(p => p.filter((_, idx) => idx !== i));
  const moveStep   = (i, dir) => {
    const arr = [...steps];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setSteps(arr);
  };

  /* Image */
  const onImgChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file) => {
    const ext = file.name.split(".").pop();
    const path = `recipe-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("recipe-images").upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("recipe-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const submitRecipe = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormMsg("");
    try {
      let imgUrl = "";
      if (imgFile) imgUrl = await uploadImage(imgFile);

      const ingredientsData = ingredients.map(x =>
        x.type === "section" ? { section: x.value } : { name: x.name, amount: x.amount, img: "" }
      );
      const stepsData = steps.map(x =>
        x.type === "section" ? { section: x.value } : { text: x.text }
      );
      const tags = formData.tags.split(",").map(t => t.trim()).filter(Boolean);

      const { error } = await supabase.from("recipes").insert({
        n: formData.n,
        name: formData.name,
        tags,
        serves: formData.serves,
        img: imgUrl,
        ingredients: ingredientsData,
        steps: stepsData,
      });
      if (error) throw error;

      setFormMsg("✓ Recipe added!");
      fetchDbRecipes();
      resetForm();
    } catch (err) {
      setFormMsg("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteRecipe = async (id) => {
    if (!confirm("Delete this recipe?")) return;
    await supabase.from("recipes").delete().eq("id", id);
    setDbRecipes(prev => prev.filter(r => r.id !== id));
  };

  /* ── Guards ──────────────────────────────────────────────── */
  if (!user) return (
    <div className="page admin-page">
      <div className="container" style={{ paddingTop: 120, textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: "clamp(32px,5vw,64px)", textTransform: "uppercase", letterSpacing: "-0.03em" }}>Admin</h1>
        <p style={{ color: "var(--muted)", marginBottom: 32 }}>You need to be logged in.</p>
        <button className="btn" onClick={() => openAuthModal("login")}>Log In</button>
      </div>
    </div>
  );

  if (!isAdmin) return (
    <div className="page admin-page">
      <div className="container" style={{ paddingTop: 120, textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: "clamp(32px,5vw,64px)", textTransform: "uppercase", letterSpacing: "-0.03em" }}>Not authorized.</h1>
        <p style={{ color: "var(--muted)" }}>This page is restricted.</p>
      </div>
    </div>
  );

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <div className="page admin-page">
      <div className="container" style={{ paddingTop: 100, paddingBottom: 80 }}>

        {/* Header */}
        <div style={{ borderBottom: "1px solid var(--rule)", paddingBottom: 32, marginBottom: 40 }}>
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

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={"admin-tab-btn" + (activeTab === "subscribers" ? " active" : "")} onClick={() => setActiveTab("subscribers")}>Subscribers</button>
          <button className={"admin-tab-btn" + (activeTab === "recipes" ? " active" : "")} onClick={() => setActiveTab("recipes")}>Recipes</button>
        </div>

        {/* ── Subscribers Tab ── */}
        {activeTab === "subscribers" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
              <h2 style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: "clamp(22px,3vw,36px)", textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0 }}>Users</h2>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <input className="admin-search" type="text" placeholder="Search by email…" value={search} onChange={e => setSearch(e.target.value)}/>
                <button className="btn ghost" onClick={fetchSubscribers} style={{ whiteSpace: "nowrap" }}>↺ Refresh</button>
              </div>
            </div>
            {subLoading ? (
              <p style={{ color: "var(--muted)" }}>Loading…</p>
            ) : filtered.length === 0 ? (
              <p style={{ color: "var(--muted)" }}>No users found.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Email</th><th>Joined</th><th>Subscribed</th><th>Since</th><th>Role</th><th></th>
                    </tr>
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
                        <td>
                          {!s.is_admin && (
                            <button className="admin-delete" onClick={() => deleteUser(s.id, s.email)} disabled={saving[s.id]} title="Remove">×</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Recipes Tab ── */}
        {activeTab === "recipes" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
              <h2 style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: "clamp(22px,3vw,36px)", textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0 }}>Recipes</h2>
              <button className="btn" onClick={() => { setShowForm(!showForm); setFormMsg(""); }}>
                {showForm ? "Cancel" : "+ Add Recipe"}
              </button>
            </div>

            {/* Add Recipe Form */}
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

                {/* Image Upload */}
                <div className="recipe-form-field">
                  <label>Photo</label>
                  <div className="recipe-form-img-row">
                    {imgPreview && <img src={imgPreview} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 2 }} alt="preview"/>}
                    <button type="button" className="btn ghost" onClick={() => imgInputRef.current.click()}>
                      {imgFile ? "Change Photo" : "Upload Photo"}
                    </button>
                    {imgFile && <span style={{ fontSize: 13, color: "var(--muted)" }}>{imgFile.name}</span>}
                    <input ref={imgInputRef} type="file" accept="image/*,.heic" style={{ display: "none" }} onChange={onImgChange}/>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>Requires "recipe-images" bucket in Supabase Storage (set to Public).</p>
                </div>

                {/* Ingredients Builder */}
                <div className="recipe-form-section">
                  <div className="recipe-form-section-head">
                    <span>Ingredients</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button type="button" className="btn ghost" style={{ fontSize: 12, padding: "6px 12px" }} onClick={addIngSection}>+ Section</button>
                      <button type="button" className="btn ghost" style={{ fontSize: 12, padding: "6px 12px" }} onClick={addIngItem}>+ Ingredient</button>
                    </div>
                  </div>
                  {ingredients.length === 0 && <p style={{ color: "var(--muted)", fontSize: 13 }}>No ingredients yet. Add a section or ingredient above.</p>}
                  {ingredients.map((ing, i) => (
                    <div key={i} className={"recipe-form-entry" + (ing.type === "section" ? " section-entry" : "")}>
                      {ing.type === "section" ? (
                        <input className="admin-input" type="text" placeholder="Section name (e.g. The Marinade)" value={ing.value} onChange={e => updateIng(i, "value", e.target.value)}/>
                      ) : (
                        <div style={{ display: "flex", gap: 8, flex: 1 }}>
                          <input className="admin-input" type="text" placeholder="Ingredient" value={ing.name} onChange={e => updateIng(i, "name", e.target.value)} style={{ flex: 2 }}/>
                          <input className="admin-input" type="text" placeholder="Amount" value={ing.amount} onChange={e => updateIng(i, "amount", e.target.value)} style={{ flex: 1 }}/>
                        </div>
                      )}
                      <div className="recipe-form-entry-actions">
                        <button type="button" onClick={() => moveIng(i, -1)} title="Move up">↑</button>
                        <button type="button" onClick={() => moveIng(i, 1)} title="Move down">↓</button>
                        <button type="button" onClick={() => removeIng(i)} title="Remove" style={{ color: "#c0392b" }}>×</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Steps Builder */}
                <div className="recipe-form-section">
                  <div className="recipe-form-section-head">
                    <span>Steps</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button type="button" className="btn ghost" style={{ fontSize: 12, padding: "6px 12px" }} onClick={addStepSection}>+ Section</button>
                      <button type="button" className="btn ghost" style={{ fontSize: 12, padding: "6px 12px" }} onClick={addStepItem}>+ Step</button>
                    </div>
                  </div>
                  {steps.length === 0 && <p style={{ color: "var(--muted)", fontSize: 13 }}>No steps yet. Add a section or step above.</p>}
                  {steps.map((step, i) => (
                    <div key={i} className={"recipe-form-entry" + (step.type === "section" ? " section-entry" : "")}>
                      {step.type === "section" ? (
                        <input className="admin-input" type="text" placeholder="Section name (e.g. Prep)" value={step.value} onChange={e => updateStep(i, "value", e.target.value)}/>
                      ) : (
                        <textarea className="admin-input admin-textarea" placeholder="Write the step…" value={step.text} onChange={e => updateStep(i, "text", e.target.value)} rows={3}/>
                      )}
                      <div className="recipe-form-entry-actions">
                        <button type="button" onClick={() => moveStep(i, -1)} title="Move up">↑</button>
                        <button type="button" onClick={() => moveStep(i, 1)} title="Move down">↓</button>
                        <button type="button" onClick={() => removeStep(i)} title="Remove" style={{ color: "#c0392b" }}>×</button>
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

            {/* DB Recipes List */}
            {recipeLoading ? (
              <p style={{ color: "var(--muted)", marginTop: 24 }}>Loading…</p>
            ) : dbRecipes.length === 0 && !showForm ? (
              <p style={{ color: "var(--muted)", marginTop: 24 }}>No recipes added yet. Hit "+ Add Recipe" to get started.</p>
            ) : dbRecipes.length > 0 ? (
              <div className="admin-table-wrap" style={{ marginTop: showForm ? 40 : 0 }}>
                <table className="admin-table">
                  <thead>
                    <tr><th>No.</th><th>Name</th><th>Tags</th><th>Serves</th><th>Added</th><th></th></tr>
                  </thead>
                  <tbody>
                    {dbRecipes.map(r => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 700 }}>№ {r.n}</td>
                        <td className="admin-email">{r.name}</td>
                        <td><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{(r.tags || []).map((t, i) => <span key={i} className="recipe-tag" style={{ fontSize: 11 }}>{t}</span>)}</div></td>
                        <td className="admin-date">{r.serves || "—"}</td>
                        <td className="admin-date">{r.created_at ? new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                        <td><button className="admin-delete" onClick={() => deleteRecipe(r.id)} title="Delete">×</button></td>
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
