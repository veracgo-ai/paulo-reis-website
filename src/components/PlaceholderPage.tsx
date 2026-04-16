import { Link } from "@tanstack/react-router";

export function PlaceholderPage({ title, description }: { title: string; description?: string }) {
  return (
    <div className="relative min-h-screen bg-[var(--navy-deep)] px-4 pb-20 pt-40 text-white">
      <div className="mx-auto max-w-3xl text-center">
        <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
          Em breve
        </span>
        <h1 className="font-display text-4xl sm:text-6xl">{title}</h1>
        {description && (
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            {description}
          </p>
        )}
        <Link
          to="/"
          className="btn-gold mt-10 inline-flex rounded-md px-6 py-3 text-sm font-semibold uppercase tracking-wider"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
