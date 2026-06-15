import { useState, useEffect } from "react";
import { User, Code2, FolderKanban, Mail } from "lucide-react";

const links = [
  { id: "about", label: "about", icon: User },
  { id: "skills", label: "skills", icon: Code2 },
  { id: "projects", label: "projects", icon: FolderKanban },
  { id: "contact", label: "contact", icon: Mail },
];

const Navbar = () => {
  const [active, setActive] = useState("about");

  useEffect(() => {
    const onScroll = () => {
      let current = "about";
      for (const link of links) {
        const el = document.getElementById(link.id);
        if (el && window.scrollY + 120 >= el.offsetTop) {
          current = link.id;
        }
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Header desktop uniquement */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <button
            onClick={() => scrollTo("about")}
            className="font-mono text-accent text-lg font-semibold tracking-tight"
          >
            <span className="text-muted">&lt;</span>SEYDOU KANE
            <span className="text-accent2">.</span>Portfolio
            <span className="text-muted">/&gt;</span>
          </button>
          <nav className="flex items-stretch font-mono text-sm">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`px-4 h-16 flex items-center gap-2 border-r border-border transition-colors ${
                  active === link.id
                    ? "bg-surface text-accent border-t-2 border-t-accent -mt-px"
                    : "text-muted hover:text-text hover:bg-surface/50"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${active === link.id ? "bg-accent2" : "bg-border"}`} />
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Header mobile en haut — logo uniquement */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="px-4 h-14 flex items-center justify-center">
          <button
            onClick={() => scrollTo("about")}
            className="font-mono text-accent text-base font-semibold tracking-tight"
          >
            <span className="text-muted">&lt;</span>SEYDOU KANE
            <span className="text-accent2">.</span>dev
            <span className="text-muted">/&gt;</span>
          </button>
        </div>
      </header>

      {/* Bottom navigation mobile — style app */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg/95 backdrop-blur-sm">
        <div className="flex items-stretch h-16">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = active === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all ${
                  isActive ? "text-accent" : "text-muted"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="font-mono text-[10px]">{link.label}</span>
                {isActive && (
                  <span className="absolute top-0 w-8 h-0.5 bg-accent rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;