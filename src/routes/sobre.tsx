import { createFileRoute } from "@tanstack/react-router";
import { usePageSections, sectionBySlug } from "@/hooks/use-site-data";
import { useReveal } from "@/hooks/use-reveal";
import fotoModelo from "@/assets/foto-modelo.jpg";
import { Compass, Target, Eye, Heart } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  component: SobrePage,
  head: () => ({
    meta: [
      { title: "Sobre Paulo Reis — Consultor Imobiliário | Orion Legacy" },
      {
        name: "description",
        content:
          "A história, valores, missão e visão de Paulo Reis. Consultoria imobiliária com estrutura, direção e legado.",
      },
      { property: "og:title", content: "Sobre Paulo Reis — Orion Legacy" },
      {
        property: "og:description",
        content:
          "Não trabalho para reagir ao mercado. Trabalho para o antecipar.",
      },
    ],
  }),
});

const ICONS: Record<string, typeof Compass> = {
  historia: Compass,
  valores: Heart,
  missao: Target,
  visao: Eye,
};

function SobrePage() {
  const { sections, loading } = usePageSections("sobre");
  const heroRef = useReveal();

  const historia = sectionBySlug(sections, "historia");
  const valores = sectionBySlug(sections, "valores");
  const missao = sectionBySlug(sections, "missao");
  const visao = sectionBySlug(sections, "visao");

  const blocks = [
    { key: "historia", data: historia },
    { key: "valores", data: valores },
    { key: "missao", data: missao },
    { key: "visao", data: visao },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--navy-deep)] px-4 pb-24 pt-40 text-white sm:pt-48">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.738_0.094_75.2/0.18),transparent_60%)]" />
        <div ref={heroRef} className="reveal relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
              Sobre mim
            </span>
            <h1 className="font-display text-5xl leading-tight sm:text-6xl lg:text-7xl">
              Não comecei <br />
              <span className="text-[var(--gold)]">com certezas.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
              Comecei com decisões. E foi precisamente isso que me trouxe até aqui — a
              construir consultoria imobiliária com estrutura, direção e legado.
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-md bg-gradient-to-br from-[var(--gold)]/30 to-transparent blur-2xl" />
            <img
              src={fotoModelo}
              alt="Paulo Reis"
              className="relative w-full rounded-md border border-[var(--gold)]/20 object-cover shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Story blocks */}
      <section className="bg-[var(--light-bg)] px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl space-y-24">
          {loading && (
            <div className="text-center text-[var(--neutral-dark)]/60">A carregar…</div>
          )}
          {blocks.map(({ key, data }, i) => {
            if (!data) return null;
            const Icon = ICONS[key] ?? Compass;
            const isEven = i % 2 === 0;
            return (
              <BlockReveal key={key}>
                <article
                  className={`relative grid gap-8 rounded-md border border-[var(--neutral-dark)]/10 bg-white p-10 shadow-[var(--shadow-premium)] sm:p-14 ${
                    isEven ? "" : "border-l-[3px] border-l-[var(--gold)]"
                  }`}
                >
                  <div className="absolute -top-6 left-10 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--navy-deep)] text-[var(--gold)] shadow-[var(--shadow-gold)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <header>
                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">
                      {String(i + 1).padStart(2, "0")} — Capítulo
                    </span>
                    <h2 className="mt-2 font-display text-3xl text-[var(--navy)] sm:text-4xl">
                      {data.title}
                    </h2>
                  </header>
                  <div className="prose prose-lg max-w-none whitespace-pre-line font-sans text-[var(--neutral-dark)]">
                    {data.content}
                  </div>
                </article>
              </BlockReveal>
            );
          })}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-[var(--navy-deep)] px-4 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <p className="font-display text-2xl italic text-white/85 sm:text-3xl">
            “A diferença não está em fazer mais. Está em decidir melhor.”
          </p>
          <p className="mt-4 text-sm uppercase tracking-[0.3em] text-[var(--gold)]">
            Paulo Reis
          </p>
        </div>
      </section>
    </>
  );
}

function BlockReveal({ children }: { children: React.ReactNode }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal">
      {children}
    </div>
  );
}
