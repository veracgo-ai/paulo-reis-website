import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { type Star } from "@/hooks/use-site-data";
import { useReveal } from "@/hooks/use-reveal";

interface Props {
  stars: Star[];
  title?: string;
  subtitle?: string;
}

export function StarsGrid({ stars, title, subtitle }: Props) {
  const ref = useReveal();
  return (
    <section ref={ref} className="reveal star-pattern relative bg-[var(--light-bg)] px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        {(title || subtitle) && (
          <div className="mx-auto mb-14 max-w-3xl text-center">
            {subtitle && (
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">
                {subtitle}
              </span>
            )}
            {title && (
              <h2 className="font-display text-4xl text-[var(--navy)] sm:text-5xl">{title}</h2>
            )}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stars.map((s, i) => (
            <Link
              key={s.id}
              to="/constelacao-orion/$slug"
              params={{ slug: s.slug }}
              className="card-lift group relative flex flex-col overflow-hidden rounded-md border border-[var(--neutral-dark)]/15 bg-white p-7 text-left"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* gold top border */}
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold text-[var(--gold)]">
                  {s.star_name}
                </span>
                <span className="text-xs uppercase tracking-wider text-[var(--neutral-dark)]/60">
                  {String(s.display_order).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-1 font-display text-xl text-[var(--navy)]">
                {s.service_name}
              </h3>

              {s.tagline && (
                <p className="mt-2 text-sm font-medium italic text-[var(--neutral-dark)]">
                  {s.tagline}
                </p>
              )}

              {s.short_description && (
                <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--neutral-dark)]/85">
                  {s.short_description}
                </p>
              )}

              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--gold)] transition-all group-hover:gap-3">
                Explorar
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
