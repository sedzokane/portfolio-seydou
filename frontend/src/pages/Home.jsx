import { useEffect, useState } from "react";
import {
  User, Mail, Phone, Briefcase, MessageSquare,
  Send, CheckCircle2, AlertCircle,
} from "lucide-react";
import api from "../api/axios.js";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import SkillBar, { categoryLabels, categoryOrder } from "../components/SkillBar.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import Reveal from "../components/Reveal.jsx";
import Footer from "../components/Footer.jsx";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", service: "", message: "" });
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    api.get("/projects").then((res) => setProjects(res.data)).catch(() => {});
    api.get("/skills").then((res) => setSkills(res.data)).catch(() => {});
  }, []);

  const grouped = categoryOrder
    .map((cat) => ({ cat, items: skills.filter((s) => s.category === cat) }))
    .filter((g) => g.items.length > 0);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await api.post("/messages", form);
      setStatus("ok");
      setForm({ fullName: "", email: "", phone: "", service: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.response?.data?.message || "Une erreur est survenue, veuillez réessayer.");
    }
  };

  return (
    // pb-16 sur mobile pour laisser place à la bottom nav
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Navbar />
      <main className="flex-1">
        <Hero />

        {/* À propos */}
        <section id="about" className="py-12 md:py-16 px-4 sm:px-6 max-w-6xl mx-auto">
          <Reveal>
            <SectionHeader
              number="01"
              filename="about"
              title="À propos de moi"
              subtitle="Quelques mots sur mon parcours et ma façon de travailler."
            />
          </Reveal>
          <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
            <Reveal delay={100} className="md:col-span-2 space-y-4 text-muted leading-relaxed text-sm sm:text-base">
              <div>
                <p className="mb-4">
                  Je suis développeur full-stack <span className="text-text">polyvalent</span>, capable
                  d'intervenir sur l'ensemble d'un projet : interface utilisateur, logique métier,
                  API, base de données et déploiement. J'aime comprendre un besoin métier et
                  proposer la stack la plus adaptée plutôt que d'imposer une seule technologie.
                </p>
                <p className="mb-4">
                  Je travaille principalement avec la stack <span className="text-accent">MERN</span> (MongoDB,
                  Express, React, Node.js) pour les applications web modernes, <span className="text-accent">Django</span> /
                  Python pour les API robustes et les back-offices, <span className="text-accent">React Native
                  / Expo</span> pour les applications mobiles iOS &amp; Android, et <span className="text-accent">WordPress</span> pour
                  les sites vitrines, blogs et e-commerce sur-mesure.
                </p>
                <p>
                  Quelle que soit la technologie, je porte une attention particulière à la qualité
                  du code, à l'expérience utilisateur, à la performance et aux bonnes pratiques de
                  sécurité.
                </p>
              </div>
            </Reveal>
            <Reveal delay={200} className="border border-border rounded-lg bg-surface p-4 sm:p-5 font-mono text-xs sm:text-sm">
              <p className="text-muted mb-3">// infos rapides</p>
              <ul className="space-y-2.5">
                <li><span className="text-accent2">Statut</span> : Disponible ✓</li>
                <li><span className="text-accent2">Web</span> : MERN, Django, WordPress</li>
                <li><span className="text-accent2">Mobile</span> : React Native / Expo</li>
                <li><span className="text-accent2">Langues</span> : Français, Anglais</li>
              </ul>
            </Reveal>
          </div>
        </section>

        {/* Compétences */}
        <section id="skills" className="py-12 md:py-16 px-4 sm:px-6 max-w-6xl mx-auto">
          <Reveal>
            <SectionHeader
              number="02"
              filename="skills"
              title="Compétences techniques"
              subtitle="Technologies et outils que j'utilise au quotidien."
            />
          </Reveal>
          {grouped.length === 0 ? (
            <p className="font-mono text-muted text-sm">Aucune compétence ajoutée pour le moment.</p>
          ) : (
            <div className="space-y-10">
              {grouped.map((group, gi) => (
                <Reveal key={group.cat} delay={gi * 80}>
                  <div>
                    <h3 className="font-mono text-xs uppercase tracking-wider text-accent2 mb-6">
                      {categoryLabels[group.cat]}
                    </h3>
                    {/* Grille adaptative : 3 sur mobile, 4 sur sm, 5+ sur lg */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6">
                      {group.items.map((skill) => (
                        <SkillBar key={skill._id} skill={skill} />
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </section>

        {/* Projets */}
        <section id="projects" className="py-12 md:py-16 px-4 sm:px-6 max-w-6xl mx-auto">
          <Reveal>
            <SectionHeader
              number="03"
              filename="projects"
              title="Projets réalisés"
              subtitle="Une sélection de projets sur lesquels j'ai travaillé."
            />
          </Reveal>
          {projects.length === 0 ? (
            <p className="font-mono text-muted text-sm">Aucun projet ajouté pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {projects.map((project, i) => (
                <Reveal key={project._id} delay={(i % 3) * 100}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          )}
        </section>

        {/* Contact */}
        <section id="contact" className="py-12 md:py-16 px-4 sm:px-6 max-w-6xl mx-auto">
          <Reveal>
            <SectionHeader
              number="04"
              filename="contact"
              title="Me contacter"
              subtitle="Une question, une proposition de collaboration ? Écrivez-moi."
            />
          </Reveal>
          <Reveal delay={100}>
            {/* Mobile : colonne unique / Desktop : 2 colonnes */}
            <form onSubmit={handleSubmit} className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs text-muted flex items-center gap-1.5" htmlFor="fullName">
                    <User size={13} /> nom complet
                  </label>
                  <input id="fullName" name="fullName" required value={form.fullName} onChange={handleChange}
                    placeholder="votre nom complet"
                    className="bg-surface border border-border rounded px-3 py-3 text-sm focus:border-accent outline-none transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs text-muted flex items-center gap-1.5" htmlFor="email">
                    <Mail size={13} /> email
                  </label>
                  <input id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                    placeholder="votre@email.com"
                    className="bg-surface border border-border rounded px-3 py-3 text-sm focus:border-accent outline-none transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs text-muted flex items-center gap-1.5" htmlFor="phone">
                    <Phone size={13} /> whatsapp / téléphone
                  </label>
                  <input id="phone" name="phone" value={form.phone} onChange={handleChange}
                    placeholder="votre numéro"
                    className="bg-surface border border-border rounded px-3 py-3 text-sm focus:border-accent outline-none transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs text-muted flex items-center gap-1.5" htmlFor="service">
                    <Briefcase size={13} /> service souhaité
                  </label>
                  <select id="service" name="service" value={form.service} onChange={handleChange}
                    className="bg-surface border border-border rounded px-3 py-3 text-sm focus:border-accent outline-none appearance-none transition-colors">
                    <option value="">Sélectionner...</option>
                    <option value="Application web (MERN)">Application web (MERN)</option>
                    <option value="API / Backend Django">API / Backend Django</option>
                    <option value="Application mobile (React Native / Expo)">Application mobile</option>
                    <option value="Site WordPress">Site WordPress</option>
                    <option value="Refonte ou maintenance">Refonte ou maintenance</option>
                    <option value="Consulting / Conseil technique">Consulting</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-muted flex items-center gap-1.5" htmlFor="message">
                  <MessageSquare size={13} /> message
                </label>
                <textarea id="message" name="message" required value={form.message} onChange={handleChange}
                  placeholder="Décrivez votre projet ou votre besoin..."
                  className="flex-1 bg-surface border border-border rounded px-3 py-3 text-sm focus:border-accent outline-none resize-none transition-colors min-h-[160px] md:min-h-[280px]" />
              </div>

              {/* Bouton — pleine largeur sur mobile */}
              <div className="md:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button type="submit" disabled={status === "sending"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-bg font-mono text-sm font-semibold rounded hover:bg-accent/90 transition-all disabled:opacity-50">
                  {status === "sending" ? "Envoi..." : "Envoyer le message"}
                  {status !== "sending" && <Send size={16} />}
                </button>
                {status === "ok" && (
                  <span className="inline-flex items-center justify-center gap-1.5 font-mono text-sm text-accent">
                    <CheckCircle2 size={16} /> Message envoyé !
                  </span>
                )}
                {status === "error" && (
                  <span className="inline-flex items-center justify-center gap-1.5 font-mono text-sm text-danger">
                    <AlertCircle size={16} /> {errorMsg}
                  </span>
                )}
              </div>
            </form>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;