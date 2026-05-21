import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Star } from "@/hooks/use-site-data";
import { useStarSections } from "@/hooks/use-star-sections";
import { Briefcase, Home, KeyRound, Building2, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/constelacao-orion/$slug")({
  component: StarPage,
});

const AUDIENCE_ICONS: Record<string, typeof Briefcase> = {
  investidores: Briefcase,
  compradores: Home,
  vendedores: KeyRound,
  arrendamentos: Building2,
};

function StarPage() {
  const { slug } = Route.useParams();
  const [star, setStar] = useState<Star | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("stars")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        setStar((data as Star | null) ?? null);
        setLoading(false);
      });
  }, [slug]);

  const { sections } = useStarSections(star?.id);
  const audience = sections.filter((s) => s.section_type === "audience");
  const embaixador = sections.filter((s) => s.section_type === "embaixador");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--navy-deep)] text-white/60">
        A carregar…
      </div>
    );
  }

  if (!star) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--navy-deep)] px-4 text-white">
        <h1 className="font-display text-4xl text-[var(--gold)]">Estrela não encontrada</h1>
        <Link
          to="/constelacao-orion"
          className="mt-6 text-sm uppercase tracking-wider text-[var(--gold)] hover:underline"
        >
          Ver todas as estrelas
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[var(--navy-deep)] px-4 pb-24 pt-40 text-white sm:pt-48">
        {star.hero_image_url && (
          <div
            className="absolute inset-0 -z-20 opacity-40"
            style={{
              backgroundImage: `url(${star.hero_image_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--navy-deep)]/85 via-[var(--navy-deep)]/75 to-[var(--navy-deep)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,oklch(0.738_0.094_75.2/0.15),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl">
          <Link
            to="/constelacao-orion"
            className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--gold)] hover:underline"
          >
            ← Constelação
          </Link>
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
            Estrela {String(star.display_order).padStart(2, "0")}
          </span>
          <h1 className="font-display text-6xl text-[var(--gold)] sm:text-7xl lg:text-8xl">
            {star.star_name}
          </h1>
          <p className="mt-3 font-display text-2xl text-white/95 sm:text-3xl">
            {star.service_name}
          </p>
          {star.tagline && (
            <p className="mt-6 max-w-2xl font-display text-lg italic text-white/70 sm:text-xl">
              {star.tagline}
            </p>
          )}
        </div>
      </section>

      {/* Storytelling */}
      {(star.full_storytelling || star.focus_strategy) && (
        <section className="bg-white px-4 py-24">
          <div className="mx-auto max-w-3xl space-y-10 text-[var(--neutral-dark)]">
            {star.full_storytelling && (
              <div className="whitespace-pre-line text-lg leading-relaxed">
                {star.full_storytelling}
              </div>
            )}
            {star.focus_strategy && (
              <div className="rounded-md border-l-[3px] border-l-[var(--gold)] bg-[var(--light-bg)] p-8">
                <h2 className="mb-3 font-display text-2xl text-[var(--navy)]">
                  Foco estratégico
                </h2>
                <p className="whitespace-pre-line text-base leading-relaxed">
                  {star.focus_strategy}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Audience sub-sections */}
      {audience.length > 0 && (
        <section className="star-pattern bg-[var(--light-bg)] px-4 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">
                Para quem é
              </span>
              <h2 className="font-display text-4xl text-[var(--navy)] sm:text-5xl">
                Conheça o seu lugar nesta estrela
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {audience.map((s) => {
                const Icon = AUDIENCE_ICONS[s.slug] ?? Briefcase;
                return (
                  <article
                    key={s.id}
                    className="group relative overflow-hidden rounded-md border border-[var(--neutral-dark)]/15 bg-white p-8 shadow-[var(--shadow-premium)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-gold)]"
                  >
                    <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-50 transition-opacity group-hover:opacity-100" />
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-md bg-[var(--navy-deep)] text-[var(--gold)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-2xl text-[var(--navy)]">{s.title}</h3>
                    {s.content && (
                      <p className="mt-3 leading-relaxed text-[var(--neutral-dark)]/85">
                        {s.content}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Embaixador accordion */}
      {embaixador.length > 0 && (
        <section className="bg-[var(--navy-deep)] px-4 py-24 text-white">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
                <Sparkles className="h-4 w-4" /> Programa Embaixador
              </span>
              <h2 className="font-display text-4xl text-white sm:text-5xl">
                Indique. Participe. Receba.
              </h2>
            </div>
            <div className="overflow-hidden rounded-md border border-[var(--gold)]/20 bg-white/5 backdrop-blur">
              {embaixador.map((s) => (
                <div
                  key={s.id}
                  className="border-b border-[var(--gold)]/15 px-6 py-5 last:border-0"
                >
                  <h3 className="font-display text-lg text-[var(--gold)]">{s.title}</h3>
                  {s.content && (
                    <p className="mt-3 text-base leading-relaxed text-white/80 whitespace-pre-line">
                      {s.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl text-[var(--navy)] sm:text-4xl">
            Pronto para uma decisão estruturada?
          </h2>
          <p className="mt-4 text-[var(--neutral-dark)]">
            Comece por uma conversa. Sem pressão, com clareza.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/contactos"
              className="btn-gold inline-flex items-center gap-2 rounded-md px-7 py-3.5 text-sm font-semibold uppercase tracking-wider"
            >
              Falar com Paulo Reis <ArrowRight className="h-4 w-4" />
            </Link>
            {star.cta_url && (
              <a
                href={star.cta_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border-2 border-[var(--navy-deep)] px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-[var(--navy-deep)] transition-colors hover:bg-[var(--navy-deep)] hover:text-white"
              >
                {star.cta_label ?? "Saber mais"}
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
