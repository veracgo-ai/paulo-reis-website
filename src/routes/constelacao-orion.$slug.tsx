import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Star } from "@/hooks/use-site-data";

export const Route = createFileRoute("/constelacao-orion/$slug")({
  component: StarPage,
});

function StarPage() {
  const { slug } = Route.useParams();
  const [star, setStar] = useState<Star | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        <Link to="/constelacao-orion" className="mt-6 text-sm uppercase tracking-wider text-[var(--gold)] hover:underline">
          Ver todas as estrelas
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="relative bg-[var(--navy-deep)] px-4 pb-20 pt-40 text-white sm:pt-48">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/constelacao-orion"
            className="mb-6 inline-block text-xs uppercase tracking-[0.3em] text-[var(--gold)] hover:underline"
          >
            ← Constelação
          </Link>
          <h1 className="font-display text-5xl text-[var(--gold)] sm:text-7xl">{star.star_name}</h1>
          <p className="mt-2 font-display text-2xl text-white/90 sm:text-3xl">
            {star.service_name}
          </p>
          {star.tagline && (
            <p className="mt-4 font-display text-lg italic text-white/70">{star.tagline}</p>
          )}
        </div>
      </section>

      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-3xl space-y-8 text-[var(--neutral-dark)]">
          {star.full_storytelling && (
            <p className="text-lg leading-relaxed">{star.full_storytelling}</p>
          )}
          {star.focus_strategy && (
            <div>
              <h2 className="mb-3 font-display text-2xl text-[var(--navy)]">Foco estratégico</h2>
              <p className="text-base leading-relaxed">{star.focus_strategy}</p>
            </div>
          )}
          {star.cta_url && (
            <div className="pt-4">
              <a
                href={star.cta_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex rounded-md px-7 py-3.5 text-sm font-semibold uppercase tracking-wider"
              >
                {star.cta_label ?? "Saber mais"}
              </a>
            </div>
          )}
          <p className="pt-8 text-sm italic text-[var(--neutral-dark)]/70">
            Página completa com sub-secções específicas (investidores, compradores, vendedores,
            etc.) em construção — Fase 2.
          </p>
        </div>
      </section>
    </>
  );
}
