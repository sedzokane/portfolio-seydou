const categoryLabels = {
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
export { categoryLabels };

const CircleProgress = ({ skill }) => {
  const size = 80;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (skill.level / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Cercle de fond */}
        <svg width={size} height={size} className="absolute top-0 left-0 -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#272733"
            strokeWidth={strokeWidth}
          />
          {/* Cercle de progression */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#34D399"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>

        {/* Logo ou emoji au centre */}
        <div className="absolute inset-0 flex items-center justify-center">
          {skill.logo ? (
            <img
              src={skill.logo}
              alt={skill.name}
              style={{ width: "44px", height: "44px", objectFit: "contain" }}
            />
          ) : skill.icon ? (
            <span style={{ fontSize: "28px", lineHeight: 1 }}>{skill.icon}</span>
          ) : (
            <span className="font-mono text-xs text-muted">{skill.name.slice(0, 2).toUpperCase()}</span>
          )}
        </div>
      </div>

      {/* Nom de la technologie */}
      <p className="font-mono text-xs text-center text-muted leading-tight max-w-[80px] truncate" title={skill.name}>
        {skill.name}
      </p>
    </div>
  );
};

const SkillBar = ({ skill }) => <CircleProgress skill={skill} />;

export default SkillBar;