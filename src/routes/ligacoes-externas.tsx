import { createFileRoute } from "@tanstack/react-router";
import { Home, Building2, Users, Calendar, ExternalLink as ExtIcon } from "lucide-react";
import { useExternalLinks } from "@/hooks/use-external-links";

export const Route = createFileRoute("/ligacoes-externas")({
  head: () => ({
    meta: [
      { title: "Ligações Externas — Paulo Reis" },
      {
        name: "description",
        content:
          "Avaliação rápida do seu imóvel, portfólio, programa de afiliados e agenda — todos os links úteis num só lugar.",
      },
      { property: "og:title", content: "Ligações Externas — Paulo Reis" },
      {
        property: "og:description",
        content: "Avaliação, portfólio, afiliados e agenda — links rápidos.",
      },
    ],
  }),
  component: LinksPage,
});

const ICONS: Record<string, typeof Home> = {
  Home,
  Building2,
  Users,
  Calendar,
};

function LinksPage() {
  const { links, loading } = useExternalLinks();

  return (
    <div className="relative min-h-screen bg-[var(--navy-deep)] pb-24 pt-32 text-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
            Acesso rápido
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Ligações Externas</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Ferramentas e plataformas que utilizo no dia-a-dia para servir clientes e parceiros.
          </p>
        </header>

        {loading && <p className="mt-12 text-center text-white/60">A carregar…</p>}

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {links.map((link) => {
            const Icon = (link.icon_name && ICONS[link.icon_name]) || ExtIcon;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-8 transition-all hover:-translate-y-1 hover:border-[var(--gold)]/50 hover:shadow-[var(--shadow-gold)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[var(--gold)]/10 text-[var(--gold)] transition-colors group-hover:bg-[var(--gold)] group-hover:text-[var(--navy-deep)]">
                    <Icon className="h-7 w-7" />
                  </div>
                  <ExtIcon className="h-5 w-5 text-white/40 transition-colors group-hover:text-[var(--gold)]" />
                </div>
                <h2 className="mt-6 font-display text-2xl text-white transition-colors group-hover:text-[var(--gold)]">
                  {link.title}
                </h2>
                {link.description && (
                  <p className="mt-2 text-sm text-white/70">{link.description}</p>
                )}
                <p className="mt-6 text-xs uppercase tracking-[0.2em] text-white/50">
                  Abrir →
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
