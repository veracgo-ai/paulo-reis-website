interface Props {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: Props) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
      <div>
        <h1 className="font-serif text-2xl text-[#0A192F]">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {action && <div className="flex gap-2">{action}</div>}
    </header>
  );
}
