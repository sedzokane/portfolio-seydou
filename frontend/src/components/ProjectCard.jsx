const ProjectCard = ({ project }) => (
  <div className="group border border-border rounded-lg overflow-hidden bg-surface hover:border-accent/50 hover:-translate-y-1 transition-all duration-300 flex flex-col">
    <div className="aspect-video bg-surface2 overflow-hidden border-b border-border">
      {project.image ? (
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center font-mono text-muted text-sm">
          aucune capture d'écran
        </div>
      )}
    </div>
    <div className="p-5 flex flex-col flex-1">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-display text-lg font-semibold">{project.title}</h3>
        {project.featured && (
          <span className="font-mono text-xs text-accent2 border border-accent2/30 rounded px-2 py-0.5 shrink-0">
            phare
          </span>
        )}
      </div>
      <p className="text-muted text-sm mb-4 flex-1">{project.description}</p>
      {project.technologies?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="font-mono text-xs px-2 py-1 rounded bg-surface2 text-accent border border-border"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-4 font-mono text-sm">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Démo →
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-text hover:underline"
          >
            Code source →
          </a>
        )}
      </div>
    </div>
  </div>
);

export default ProjectCard;
