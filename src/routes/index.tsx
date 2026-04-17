import { createFileRoute, Link } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { ApresentacaoSection } from "@/components/ApresentacaoSection";
import { StarsGrid } from "@/components/StarsGrid";
import { usePageSections, useStars, sectionBySlug, useSiteSettings } from "@/hooks/use-site-data";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Paulo Reis — Consultor Imobiliário | Orion Legacy" },
      {
        name: "description",
        content:
          "Consultoria imobiliária estratégica no Algarve. Estrutura, direção e legado para investidores, compradores, vendedores e profissionais do setor.",
      },
      { property: "og:title", content: "Paulo Reis — Orion Legacy" },
      {
        property: "og:description",
        content:
          "Onde decisões estruturadas transformam pessoas em legado. Conheça a Constelação Órion.",
      },
    ],
  }),
});

function Index() {
  const { sections } = usePageSections("inicio");
  const { stars } = useStars({ featuredOnly: true });
  const { settings } = useSiteSettings();

  const apresentacao = sectionBySlug(sections, "apresentacao");
  const manifesto = sectionBySlug(sections, "manifesto");
  const processo = sectionBySlug(sections, "processo");
  const ctaFinal = sectionBySlug(sections, "cta-final");
  const destaque = sectionBySlug(sections, "estrelas-destaque");

  const agendaUrl = settings.agenda_url ?? "https://bit.ly/agendaAON";

  return (
    <>
      <Hero />

      <ApresentacaoSection
        title={apresentacao?.title ?? "Não comecei com certezas."}
        subtitle={apresentacao?.subtitle ?? "Quem é Paulo Reis"}
        content={
          apresentacao?.content ??
          "Hoje não trabalho para reagir ao mercado. Trabalho para o antecipar."
        }
        imageUrl={apresentacao?.image_url}
      />

      {manifesto && (
        <ApresentacaoSection
          title={manifesto.title}
          subtitle={manifesto.subtitle}
          content={manifesto.content}
          imageUrl={manifesto.image_url}
          reverse
        />
      )}

      <StarsGrid
        stars={stars}
        title={destaque?.title ?? "Três estrelas. Três caminhos."}
        subtitle={destaque?.subtitle ?? "Constelação Órion"}
      />

      {processo && <MetodoSection section={processo} />}

      {ctaFinal && <CtaFinalSection section={ctaFinal} agendaUrl={agendaUrl} />}
    </>
  );
}

function MetodoSection({
  section,
}: {
  section: { title: string | null; subtitle: string | null; content: string | null; image_url: string | null };
}) {
  const ref = useReveal();
  const blocks = (section.content ?? "").split(/\n\n+/).filter(Boolean);
  return (
    <section
      ref={ref}
      className="reveal relative overflow-hidden bg-[var(--navy-deep)] px-4 py-24 text-white sm:py-32"
    >
      {section.image_url && (
        <div
          className="absolute inset-0 -z-10 opacity-20"
          style={{
            backgroundImage: `url(${section.image_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--navy-deep)]/95 via-[var(--navy)]/85 to-[var(--navy-deep)]" />
      <div className="mx-auto max-w-5xl text-center">
        {section.subtitle && (
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
            {section.subtitle}
          </span>
        )}
        {section.title && (
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">{section.title}</h2>
        )}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {blocks.map((b, i) => {
            const m = b.match(/^\*\*([^*]+)\*\*\n?(.*)$/s);
            const heading = m?.[1] ?? `Passo ${i + 1}`;
            const body = m?.[2]?.trim() ?? b;
            return (
              <div
                key={i}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-left transition-all hover:-translate-y-1 hover:border-[var(--gold)]/40"
              >
                <span className="font-display text-3xl text-[var(--gold)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-xl text-white">{heading}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CtaFinalSection({
  section,
  agendaUrl,
}: {
  section: { title: string | null; subtitle: string | null; content: string | null; image_url: string | null };
  agendaUrl: string;
}) {
  const ref = useReveal();
  return (
    <section ref={ref} className="reveal relative overflow-hidden bg-white px-4 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        {section.image_url && (
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-md bg-gradient-to-br from-[var(--gold)]/25 to-transparent blur-2xl" />
            <img
              src={section.image_url}
              alt={section.title ?? ""}
              className="relative w-full rounded-md object-cover shadow-[0_20px_60px_-15px_rgba(10,25,47,0.4)]"
              loading="lazy"
            />
            <div className="absolute -top-3 -left-3 h-24 w-24 border-l-4 border-t-4 border-[var(--gold)]" />
          </div>
        )}
        <div>
          {section.subtitle && (
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
              {section.subtitle}
            </span>
          )}
          {section.title && (
            <h2 className="mt-3 font-display text-4xl leading-tight text-[var(--navy)] sm:text-5xl">
              {section.title}
            </h2>
          )}
          {section.content && (
            <p className="mt-6 text-lg leading-relaxed text-[var(--neutral-dark)]">
              {section.content}
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={agendaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold inline-flex items-center justify-center rounded-md px-7 py-3.5 text-sm font-semibold uppercase tracking-wider"
            >
              Marcar conversa
            </a>
            <Link
              to="/contactos"
              className="inline-flex items-center justify-center rounded-md border border-[var(--navy)]/20 px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-[var(--navy)] transition-all hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 hover:text-[var(--gold)]"
            >
              Enviar mensagem
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
