type SectionTitleProps = {
  label?: string;
  title: string;
  description?: string;
};

export function SectionTitle({ label, title, description }: SectionTitleProps) {
  return (
    <div className="mb-8">
      {label ? <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">{label}</p> : null}
      <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
      <div className="mt-3 h-1 w-16 rounded-full bg-blue-600" />
      {description ? <p className="mt-4 max-w-2xl text-slate-600">{description}</p> : null}
    </div>
  );
}
