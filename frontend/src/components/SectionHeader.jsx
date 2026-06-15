// En-tête de section façon "onglet de fichier" dans un éditeur de code
const SectionHeader = ({ number, filename, title, subtitle }) => (
  <div className="mb-10">
    <div className="inline-flex items-center gap-2 font-mono text-xs text-muted border border-border rounded-t px-3 py-1.5 bg-surface">
      <span className="text-accent2">{number}</span>
      <span>{filename}</span>
    </div>
    <div className="border-t border-border" />
    <h2 className="font-display text-3xl sm:text-4xl font-bold mt-5">{title}</h2>
    {subtitle && <p className="text-muted mt-2 max-w-xl">{subtitle}</p>}
  </div>
);

export default SectionHeader;
