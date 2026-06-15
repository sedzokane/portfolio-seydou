import { useEffect, useState } from "react";
import { FolderKanban, Code2, FileText, Mail, LogOut, ExternalLink } from "lucide-react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { categoryLabels, categoryOrder } from "../components/SkillBar.jsx";

const tabs = [
  { id: "projects", label: "projets", icon: FolderKanban },
  { id: "skills", label: "competences", icon: Code2 },
  { id: "cv", label: "cv", icon: FileText },
  { id: "messages", label: "messages", icon: Mail },
];

const emptyProject = {
  title: "", description: "", technologies: "", githubUrl: "", liveUrl: "", featured: false, order: 0,
};
const emptySkill = { name: "", category: "fullstack", level: 70, icon: "", order: 0 };

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const [tab, setTab] = useState("projects");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <h1 className="font-mono text-accent text-sm">
            espace-admin <span className="text-muted">— {admin?.email}</span>
          </h1>
          <div className="flex items-center gap-4 font-mono text-xs">
            <a href="/" className="flex items-center gap-1.5 text-muted hover:text-accent transition-colors">
              <ExternalLink size={14} /> voir le site
            </a>
            <button onClick={logout} className="flex items-center gap-1.5 text-muted hover:text-danger transition-colors">
              <LogOut size={14} /> déconnexion
            </button>
          </div>
        </div>
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex font-mono text-sm overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 border-r border-border whitespace-nowrap transition-colors ${
                  tab === t.id ? "bg-surface text-accent border-t-2 border-t-accent" : "text-muted hover:text-text"
                }`}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </nav>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        {tab === "projects" && <ProjectsTab />}
        {tab === "skills" && <SkillsTab />}
        {tab === "cv" && <CVTab />}
        {tab === "messages" && <MessagesTab />}
      </main>
    </div>
  );
};

/* ---------------- Projets ---------------- */
const ProjectsTab = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyProject);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState("");

  const load = () => api.get("/projects").then((res) => setProjects(res.data));
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm(emptyProject);
    setImageFile(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("technologies", JSON.stringify(
      form.technologies.split(",").map((t) => t.trim()).filter(Boolean)
    ));
    data.append("githubUrl", form.githubUrl);
    data.append("liveUrl", form.liveUrl);
    data.append("featured", form.featured);
    data.append("order", form.order);
    if (imageFile) data.append("image", imageFile);

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, data);
        setMsg("Projet mis à jour ✓");
      } else {
        await api.post("/projects", data);
        setMsg("Projet ajouté ✓");
      }
      resetForm();
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || "Erreur");
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title,
      description: p.description,
      technologies: (p.technologies || []).join(", "),
      githubUrl: p.githubUrl || "",
      liveUrl: p.liveUrl || "",
      featured: p.featured,
      order: p.order,
    });
    setImageFile(null);
  };

  const remove = async (id) => {
    if (!confirm("Supprimer ce projet ?")) return;
    await api.delete(`/projects/${id}`);
    load();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <h2 className="font-display text-xl font-bold mb-4">
          {editingId ? "Modifier le projet" : "Ajouter un projet"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 border border-border rounded-lg bg-surface p-5">
          <Field label="titre">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className={inputClass} />
          </Field>
          <Field label="description">
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows="3" className={inputClass + " resize-none"} />
          </Field>
          <Field label="technologies (séparées par des virgules)">
            <input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="React, Node.js, MongoDB" className={inputClass} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="lien GitHub">
              <input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className={inputClass} />
            </Field>
            <Field label="lien démo">
              <input value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} className={inputClass} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="ordre d'affichage">
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className={inputClass} />
            </Field>
            <Field label="image (capture d'écran)">
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="font-mono text-xs text-muted" />
            </Field>
          </div>
          <label className="flex items-center gap-2 font-mono text-sm cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Mettre en avant comme projet phare
          </label>
          <div className="flex items-center gap-3">
            <button type="submit" className="px-5 py-2.5 bg-accent text-bg font-mono text-sm font-semibold rounded hover:bg-accent/90 transition-colors">
              {editingId ? "Enregistrer" : "Ajouter"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-5 py-2.5 border border-border font-mono text-sm rounded text-muted hover:text-text transition-colors">
                Annuler
              </button>
            )}
            {msg && <span className="font-mono text-xs text-accent">{msg}</span>}
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold mb-4">Projets existants ({projects.length})</h2>
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p._id} className="border border-border rounded-lg bg-surface p-4 flex items-start gap-3">
              {p.image && (
                <img src={p.image} alt={p.title} className="w-16 h-12 object-cover rounded border border-border shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">
                  {p.title} {p.featured && <span className="text-accent2 font-mono text-xs">★ phare</span>}
                </p>
                <p className="text-muted text-sm line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.technologies?.map((t) => (
                    <span key={t} className="font-mono text-xs px-2 py-0.5 rounded bg-surface2 border border-border text-accent">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 font-mono text-xs shrink-0">
                <button onClick={() => startEdit(p)} className="text-accent hover:underline">modifier</button>
                <button onClick={() => remove(p._id)} className="text-danger hover:underline">supprimer</button>
              </div>
            </div>
          ))}
          {projects.length === 0 && <p className="font-mono text-muted text-sm">Aucun projet pour le moment.</p>}
        </div>
      </div>
    </div>
  );
};

/* ---------------- Compétences ---------------- */
const SkillsTab = () => {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(emptySkill);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState("");

  const load = () => api.get("/skills").then((res) => setSkills(res.data));
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm(emptySkill);
    setLogoFile(null);
    setLogoPreview(null);
    setEditingId(null);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    const data = new FormData();
    data.append("name", form.name);
    data.append("category", form.category);
    data.append("level", form.level);
    data.append("icon", form.icon);
    data.append("order", form.order);
    if (logoFile) data.append("logo", logoFile);

    try {
      if (editingId) {
        await api.put(`/skills/${editingId}`, data);
        setMsg("Compétence mise à jour ✓");
      } else {
        await api.post("/skills", data);
        setMsg("Compétence ajoutée ✓");
      }
      resetForm();
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || "Erreur");
    }
  };

  const startEdit = (s) => {
    setEditingId(s._id);
    setForm({ name: s.name, category: s.category, level: s.level, icon: s.icon || "", order: s.order });
    setLogoFile(null);
    setLogoPreview(s.logo || null);
  };

  const remove = async (id) => {
    if (!confirm("Supprimer cette compétence ?")) return;
    await api.delete(`/skills/${id}`);
    load();
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <h2 className="font-display text-xl font-bold mb-4">
          {editingId ? "Modifier la compétence" : "Ajouter une compétence / technologie apprise"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 border border-border rounded-lg bg-surface p-5">
          <Field label="nom">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="ex: React, Django, WordPress..." className={inputClass} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="catégorie">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                {categoryOrder.map((c) => (
                  <option key={c} value={c}>{categoryLabels[c]}</option>
                ))}
              </select>
            </Field>
            <Field label="emoji de secours (si pas de logo)">
              <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="⚙️" className={inputClass} />
            </Field>
          </div>

          {/* Upload logo avec aperçu */}
          <Field label="logo de la technologie (image PNG/SVG recommandé)">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded border border-border bg-surface2 flex items-center justify-center shrink-0 overflow-hidden">
                {logoPreview ? (
                  <img src={logoPreview} alt="aperçu" className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-muted text-xs">logo</span>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleLogoChange} className="font-mono text-xs text-muted flex-1" />
            </div>
          </Field>

          <Field label={`niveau de maîtrise : ${form.level}%`}>
            <div className="flex items-center gap-3">
              <input
                type="range" min="0" max="100" value={form.level}
                onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
                className="flex-1 accent-[#34D399]"
              />
              <span className="font-mono text-xs text-accent w-10 text-right">{form.level}%</span>
            </div>
          </Field>

          <Field label="ordre d'affichage">
            <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className={inputClass} />
          </Field>

          <div className="flex items-center gap-3">
            <button type="submit" className="px-5 py-2.5 bg-accent text-bg font-mono text-sm font-semibold rounded hover:bg-accent/90 transition-colors">
              {editingId ? "Enregistrer" : "Ajouter"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-5 py-2.5 border border-border font-mono text-sm rounded text-muted hover:text-text transition-colors">
                Annuler
              </button>
            )}
            {msg && <span className="font-mono text-xs text-accent">{msg}</span>}
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold mb-4">Compétences existantes ({skills.length})</h2>
        <div className="space-y-2">
          {categoryOrder.map((cat) => {
            const group = skills.filter((s) => s.category === cat);
            if (group.length === 0) return null;
            return (
              <div key={cat}>
                <p className="font-mono text-xs uppercase tracking-wider text-accent2 mb-2 mt-4">
                  {categoryLabels[cat]}
                </p>
                {group.map((s) => (
                  <div key={s._id} className="border border-border rounded-lg bg-surface p-3 flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded bg-surface2 border border-border flex items-center justify-center shrink-0 overflow-hidden p-1">
                      {s.logo ? (
                        <img src={s.logo} alt={s.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-lg">{s.icon || "•"}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm font-medium truncate">{s.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 rounded-full bg-surface2 overflow-hidden">
                          <div className="h-full bg-accent transition-all" style={{ width: `${s.level}%` }} />
                        </div>
                        <span className="font-mono text-xs text-muted shrink-0">{s.level}%</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 font-mono text-xs shrink-0">
                      <button onClick={() => startEdit(s)} className="text-accent hover:underline">modifier</button>
                      <button onClick={() => remove(s._id)} className="text-danger hover:underline">supprimer</button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
          {skills.length === 0 && <p className="font-mono text-muted text-sm">Aucune compétence pour le moment.</p>}
        </div>
      </div>
    </div>
  );
};

/* ---------------- CV ---------------- */
const CVTab = () => {
  const [cv, setCv] = useState(null);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const load = () => api.get("/cv").then((res) => setCv(res.data)).catch(() => setCv(null));
  useEffect(() => { load(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setMsg("");
    const data = new FormData();
    data.append("cv", file);
    try {
      await api.post("/cv", data);
      setMsg("CV mis à jour ✓ — il remplace désormais l'ancien sur le site public.");
      setFile(null);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="font-display text-xl font-bold mb-4">Gestion du CV</h2>
      <div className="border border-border rounded-lg bg-surface p-5 space-y-4">
        <div className="font-mono text-sm">
          <p className="text-muted mb-1">CV actuellement en ligne :</p>
          {cv ? (
            <p className="flex items-center gap-2">
              <span className="text-accent">📄</span>
              {cv.originalName} —{" "}
              <a href="/api/cv/download" className="text-accent hover:underline">télécharger</a>
            </p>
          ) : (
            <p className="text-muted">Aucun CV n'a encore été mis en ligne.</p>
          )}
        </div>
        <form onSubmit={handleUpload} className="space-y-3">
          <Field label="nouveau CV (PDF uniquement)">
            <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} className="font-mono text-xs text-muted" />
          </Field>
          {file && (
            <p className="font-mono text-xs text-muted">Fichier sélectionné : {file.name}</p>
          )}
          <button
            type="submit"
            disabled={!file || loading}
            className="px-5 py-2.5 bg-accent text-bg font-mono text-sm font-semibold rounded hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Envoi en cours..." : "Mettre à jour le CV"}
          </button>
          {msg && <p className="font-mono text-xs text-accent">{msg}</p>}
        </form>
        <p className="font-mono text-xs text-muted border-t border-border pt-3">
          Le bouton « Télécharger le CV » sur le site public pointe toujours vers le CV le plus récent.
        </p>
      </div>
    </div>
  );
};

/* ---------------- Messages ---------------- */
const MessagesTab = () => {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("all"); // all | unread | read

  const load = () => api.get("/messages").then((res) => setMessages(res.data));
  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await api.put(`/messages/${id}/read`);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Supprimer ce message ?")) return;
    await api.delete(`/messages/${id}`);
    load();
  };

  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.read;
    if (filter === "read") return m.read;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="font-display text-xl font-bold">
          Messages reçus ({messages.length})
          {unreadCount > 0 && (
            <span className="ml-2 font-mono text-xs bg-accent text-bg px-2 py-0.5 rounded-full">
              {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
            </span>
          )}
        </h2>
        <div className="flex gap-2 font-mono text-xs">
          {["all", "unread", "read"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded border transition-colors ${
                filter === f
                  ? "border-accent text-accent bg-accent/10"
                  : "border-border text-muted hover:text-text"
              }`}
            >
              {f === "all" ? "tous" : f === "unread" ? "non lus" : "lus"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((m) => (
          <div
            key={m._id}
            className={`border rounded-lg bg-surface p-4 transition-colors ${
              !m.read ? "border-l-2 border-l-accent border-border" : "border-border opacity-80"
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="font-semibold">
                  {m.fullName}
                  {!m.read && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-accent align-middle" />}
                </p>
                <p className="font-mono text-xs text-muted">{m.email}</p>
                <div className="flex flex-wrap gap-3 font-mono text-xs text-muted mt-1">
                  {m.phone && <span>📱 {m.phone}</span>}
                  {m.service && <span className="text-accent2">🎯 {m.service}</span>}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 font-mono text-xs shrink-0 items-end">
                <span className="text-muted">{new Date(m.createdAt).toLocaleDateString("fr-FR")}</span>
                {!m.read && (
                  <button onClick={() => markRead(m._id)} className="text-accent hover:underline">
                    marquer lu
                  </button>
                )}
                <button onClick={() => remove(m._id)} className="text-danger hover:underline">
                  supprimer
                </button>
              </div>
            </div>
            <p className="text-muted text-sm whitespace-pre-wrap border-t border-border pt-2 mt-2">
              {m.message}
            </p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="font-mono text-muted text-sm">
            {filter === "unread" ? "Aucun message non lu." : filter === "read" ? "Aucun message lu." : "Aucun message pour le moment."}
          </p>
        )}
      </div>
    </div>
  );
};

/* ---------------- Helpers ---------------- */
const inputClass = "bg-bg border border-border rounded px-3 py-2 text-sm focus:border-accent outline-none w-full transition-colors";

const Field = ({ label, children }) => (
  <label className="flex flex-col gap-1.5">
    <span className="font-mono text-xs text-muted">{label}</span>
    {children}
  </label>
);

export default AdminDashboard;