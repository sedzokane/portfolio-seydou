import { useState, useEffect } from "react";
import { ArrowRight, Download } from "lucide-react";

const codeLines = [
  { n: 1, content: <><span className="text-[#C792EA]">const</span> <span className="text-[#82AAFF]">developer</span> = {"{"}</> },
  { n: 2, content: <>&nbsp;&nbsp;<span className="text-danger">name</span>: <span className="text-accent">'Seydou KANE'</span>,</> },
  { n: 3, content: <>&nbsp;&nbsp;<span className="text-danger">role</span>: <span className="text-accent">'Développeur Full-Stack'</span>,</> },
  { n: 4, content: <>&nbsp;&nbsp;<span className="text-danger">stack</span>: [</> },
  { n: 5, content: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-accent">'MERN (MongoDB, Express, React, Node)'</span>,</> },
  { n: 6, content: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-accent">'Django'</span>, <span className="text-accent">'React Native / Expo'</span>,</> },
  { n: 7, content: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-accent">'WordPress'</span></> },
  { n: 8, content: <>&nbsp;&nbsp;],</> },
  { n: 9, content: <>&nbsp;&nbsp;<span className="text-danger">focus</span>: <span className="text-accent">'Web, mobile &amp; CMS sur-mesure'</span>,</> },
  { n: 10, content: <>&nbsp;&nbsp;<span className="text-danger">available</span>: <span className="text-[#82AAFF]">true</span>,</> },
  { n: 11, content: <>{"}"};</> },
];

const stackBadges = [
  "React", "Node.js", "Express", "MongoDB", "Django", "Python",
  "React Native", "Expo", "WordPress", "PHP","Bootstrap", "Tailwind CSS", "REST API",
];

const Hero = () => {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines >= codeLines.length) return;
    const timeout = setTimeout(() => setVisibleLines((v) => v + 1), 160);
    return () => clearTimeout(timeout);
  }, [visibleLines]);

  return (
    <>
      <section id="hero" className="relative pt-32 pb-20 px-4 sm:px-6 max-w-6xl mx-auto overflow-hidden">
        {/* Halos décoratifs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 glow pointer-events-none" />
        <div className="absolute top-10 right-0 w-72 h-72 glow-gold pointer-events-none" />

        <div className="relative grid md:grid-cols-2 gap-10 items-center">
          <div className="animate-fadeUp">
            <p className="font-mono text-accent text-sm mb-3">// bienvenue sur mon portfolio</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight mb-4">
              Je transforme vos idées en
              <span className="text-accent"> applications</span> web &amp; mobiles
              <span className="text-accent2"> sur-mesure</span>.
            </h1>
            <p className="text-muted text-lg mb-8 max-w-md">
              Développeur full-stack polyvalent : applications <span className="text-text">MERN</span> (MongoDB,
              Express, React, Node.js), API et back-offices <span className="text-text">Django</span>, applications
              mobiles <span className="text-text">React Native / Expo</span>, et sites
              <span className="text-text"> WordPress</span> sur-mesure.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg font-mono text-sm font-semibold rounded hover:bg-accent/90 transition-all hover:-translate-y-0.5"
              >
                Voir mes projets <ArrowRight size={16} />
              </a>
              <a
                href="/api/cv/download"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border text-text font-mono text-sm font-semibold rounded hover:border-accent hover:text-accent transition-all hover:-translate-y-0.5"
              >
                Télécharger le CV <Download size={16} />
              </a>
            </div>
          </div>

          {/* Fenêtre d'éditeur de code stylisée */}
          <div className="rounded-lg border border-border bg-surface overflow-hidden shadow-2xl shadow-black/40 animate-float">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface2">
              <span className="w-3 h-3 rounded-full bg-danger" />
              <span className="w-3 h-3 rounded-full bg-accent2" />
              <span className="w-3 h-3 rounded-full bg-accent" />
              <span className="ml-3 font-mono text-xs text-muted">portfolio</span>
            </div>
            <pre className="p-5 font-mono text-sm leading-7 overflow-x-auto min-h-[280px]">
              {codeLines.slice(0, visibleLines).map((line) => (
                <div key={line.n} className="flex">
                  <span className="w-6 text-right pr-4 text-muted/50 select-none">{line.n}</span>
                  <span>{line.content}</span>
                </div>
              ))}
              {visibleLines < codeLines.length && (
                <div className="flex">
                  <span className="w-6 text-right pr-4 text-muted/50 select-none">
                    {visibleLines + 1}
                  </span>
                  <span className="cursor-blink text-accent">▍</span>
                </div>
              )}
            </pre>
          </div>
        </div>
      </section>

      {/* Bandeau défilant des technologies */}
      <div className="border-y border-border bg-surface/50 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-4">
          {[...stackBadges, ...stackBadges].map((tech, i) => (
            <span
              key={i}
              className="font-mono text-sm text-muted px-6 flex items-center gap-2 shrink-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
              {tech}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default Hero;
