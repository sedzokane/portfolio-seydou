export const categoryLabels = {
  frontend: "Frontend",
  backend: "Backend",
  fullstack: "Full-Stack",
  database: "Bases de données",
  mobile: "Mobile",
  devops: "DevOps",
  outil: "Outils",
  autre: "Autre",
};

export const categoryOrder = ["fullstack", "frontend", "backend", "mobile", "database", "devops", "outil", "autre"];

const SkillIcon = ({ skill }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex items-center justify-center"
        style={{ width: 80, height: 80, background: "var(--color-background-secondary)", borderRadius: 10 }}
      >
        {skill.logo ? (
          <img
            src={skill.logo}
            alt={skill.name}
            style={{ width: "58px", height: "58px", objectFit: "contain" }}
          />
        ) : skill.icon ? (
          <span style={{ fontSize: "38px", lineHeight: 1 }}>{skill.icon}</span>
        ) : (
          <span className="font-mono text-sm text-muted">{skill.name.slice(0, 2).toUpperCase()}</span>
        )}
      </div>
      <p
        className="font-mono text-xs text-center text-muted leading-tight truncate"
        style={{ maxWidth: 80 }}
        title={skill.name}
      >
        {skill.name}
      </p>
    </div>
  );
};

export default SkillIcon;