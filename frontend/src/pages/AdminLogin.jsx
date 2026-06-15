import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-border rounded-lg bg-surface overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface2">
          <span className="w-3 h-3 rounded-full bg-danger" />
          <span className="w-3 h-3 rounded-full bg-accent2" />
          <span className="w-3 h-3 rounded-full bg-accent" />
          <span className="ml-3 font-mono text-xs text-muted">admin-login.js</span>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h1 className="font-display text-2xl font-bold mb-2 flex items-center gap-2">
            <Lock size={20} className="text-accent" /> Connexion admin
          </h1>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-muted" htmlFor="email">email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="email" type="email" required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-bg border border-border rounded pl-10 pr-3 py-2 text-sm focus:border-accent outline-none transition-colors"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-muted" htmlFor="password">mot de passe</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="password" type="password" required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-bg border border-border rounded pl-10 pr-3 py-2 text-sm focus:border-accent outline-none transition-colors"
              />
            </div>
          </div>
          {error && <p className="text-danger font-mono text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent text-bg font-mono text-sm font-semibold rounded hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
          <a href="/" className="block text-center font-mono text-xs text-muted hover:text-accent">
            ← retour au site
          </a>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
