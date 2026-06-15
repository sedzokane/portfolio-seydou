import { Mail, Github, Gitlab, Linkedin, MessageCircle } from "lucide-react";

const socials = [
  { name: "Email", href: "seydoukane015@gmail.com", icon: Mail },
  { name: "GitHub", href: "https://github.com/sedzokane", icon: Github },
  { name: "GitLab", href: "https://gitlab.com/Sedzokane31", icon: Gitlab },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/seydou-kane-02ba0133b", icon: Linkedin },
  { name: "WhatsApp", href: "https://wa.me/221781944541", icon: MessageCircle },
].filter((s) => s.href);

const Footer = () => (
  <footer className="border-t border-border py-8 px-4 sm:px-6">
    <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 text-center font-mono text-xs text-muted">
      <div className="flex items-center gap-3">
        {socials.map((s) => {
          const Icon = s.icon;
          return (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.name}
              title={s.name}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted hover:text-accent hover:border-accent hover:-translate-y-0.5 transition-all"
            >
              <Icon size={16} />
            </a>
          );
        })}
      </div>
      <p>© SEYDOU KANE | {new Date().getFullYear()}</p>
    </div>
  </footer>
);

export default Footer;