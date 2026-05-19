import { createFileRoute, Link } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { ApresentacaoSection } from "@/components/ApresentacaoSection";
import { StarsGrid } from "@/components/StarsGrid";
import { usePageSections, useStars, sectionBySlug, useSiteSettings } from "@/hooks/use-site-data";
import { useReveal } from "@/hooks/use-reveal";
import { Star } from "lucide-react";

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

      <DepoimentosSection />
    </>
  );
}

const DEPOIMENTOS = [
  {
    nome: "Theo",
    texto:
      "Recomendo 100%. Exímio representante no processo todo. A voltar a comprar é com este senhor. Recomendo.",
  },
  {
    nome: "Miguel Vieira",
    texto:
      "Excelente. O Paulo foi um mediador de excelência. Tudo correu na perfeição, com calma, dentro dos tempos e com extremo rigor para ambas as partes. Recomendo!",
  },
  {
    nome: "Caio",
    texto:
      "Muito boa qualidade de serviço. O Paulo Reis foi impecável durante todo o processo. Sempre disponível, direto nas respostas e sem complicações. Tratou de tudo com rapidez e deu-me total confiança em cada decisão. Nota-se que conhece bem o mercado e sabe o que está a fazer. Facilitou bastante um processo que podia ser chato e burocrático. Recomendo sem qualquer dúvida.",
  },
  {
    nome: "Ester Xavier",
    texto:
      "Magnífico. O Paulo é um profissional magnífico porque, para além de extremamente competente no que faz, é muito pragmático com as análises que faz e, com isso, acaba por transmitir imensa confiança ao cliente. Obrigada Paulo pelos excelentes negócios que fizeste. Muitos parabéns por seres essa maravilhosa pessoa.",
  },
];

function DepoimentosSection() {
  const ref = useReveal();
  return (
    <section
      ref={ref}
      className="reveal relative overflow-hidden bg-[var(--neutral-light,#f7f5f0)] px-4 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
            Depoimentos
          </span>
          <h2 className="mt-3 font-display text-4xl text-[var(--navy)] sm:text-5xl">
            O que dizem os clientes
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {DEPOIMENTOS.map((d) => (
            <figure
              key={d.nome}
              className="group relative flex h-full flex-col rounded-lg border border-[var(--navy)]/10 bg-white p-8 shadow-[0_10px_40px_-20px_rgba(10,25,47,0.2)] transition-all hover:-translate-y-1 hover:border-[var(--gold)]/40 hover:shadow-[0_20px_50px_-20px_rgba(10,25,47,0.3)]"
            >
              <div className="flex items-center gap-1 text-[var(--gold)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 text-base leading-relaxed text-[var(--neutral-dark)]">
                “{d.texto}”
              </blockquote>
              <figcaption className="mt-6 border-t border-[var(--navy)]/10 pt-4 font-display text-lg text-[var(--navy)]">
                {d.nome}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function MetodoSection({
  section,
}: {
  section: { title: string | null; subtitle: string | null; content: string | null; image_url: string | null };
}) {
  const ref = useReveal();
  // Normaliza conteúdo: aceita texto simples (markdown com **) ou HTML vindo do editor.
  const raw = section.content ?? "";
  const plain = raw
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/\s*(p|div|li|h[1-6])\s*>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\r/g, "")
    .trim();

  // Divide pelos marcadores **N. titulo** independentemente das quebras de linha.
  const parts = plain.split(/(?=\*\*\s*\d+\.\s)/).map((s) => s.trim()).filter(Boolean);
  const blocks = parts.length > 1 ? parts : plain.split(/\n\n+/).filter(Boolean);
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
            const m = b.match(/^\*\*\s*(?:\d+\.\s*)?([^*]+?)\s*\*\*\s*([\s\S]*)$/);
            const heading = (m?.[1] ?? `Passo ${i + 1}`).replace(/\.$/, "").trim();
            const body = (m?.[2] ?? b).replace(/\*\*/g, "").trim();
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
