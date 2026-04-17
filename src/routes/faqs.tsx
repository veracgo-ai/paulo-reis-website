import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useFaqs } from "@/hooks/use-faqs";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/PageHero";
import { usePageSections, sectionBySlug } from "@/hooks/use-site-data";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs — Paulo Reis" },
      {
        name: "description",
        content:
          "Perguntas frequentes sobre aquisição, venda, investimento imobiliário e carreira de consultor.",
      },
      { property: "og:title", content: "FAQs — Paulo Reis" },
      {
        property: "og:description",
        content:
          "Respostas claras às dúvidas mais comuns sobre o mercado imobiliário e investimento.",
      },
    ],
  }),
  component: FaqsPage,
});

function FaqsPage() {
  const { categories, faqs, loading } = useFaqs();
  const { sections } = usePageSections("faqs");
  const hero = sectionBySlug(sections, "hero");
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = faqs;
    if (activeCat) list = list.filter((f) => f.category_id === activeCat);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q),
      );
    }
    return list;
  }, [faqs, activeCat, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const f of filtered) {
      const key = f.category_id ?? "other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(f);
    }
    return map;
  }, [filtered]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="relative min-h-screen bg-[var(--navy-deep)] pb-24 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        eyebrow={hero?.subtitle ?? "Tire as suas dúvidas"}
        title={hero?.title ?? "Perguntas Frequentes"}
        description={hero?.content ?? "Respostas claras sobre aquisição, venda, investimento e carreira no imobiliário."}
        imageUrl={hero?.image_url}
      />
      <div className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 lg:px-8">

        {/* Pesquisa */}
        <div className="mx-auto mt-10 max-w-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar perguntas…"
              className="w-full rounded-full border border-white/15 bg-white/5 py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/40 focus:border-[var(--gold)] focus:outline-none"
            />
          </div>
        </div>

        {/* Categorias */}
        <nav className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCat(null)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs uppercase tracking-wider transition-colors",
              !activeCat
                ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--navy-deep)]"
                : "border-white/20 text-white/75 hover:border-[var(--gold)] hover:text-[var(--gold)]",
            )}
          >
            Todas
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCat(c.id)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs uppercase tracking-wider transition-colors",
                activeCat === c.id
                  ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--navy-deep)]"
                  : "border-white/20 text-white/75 hover:border-[var(--gold)] hover:text-[var(--gold)]",
              )}
            >
              {c.name}
            </button>
          ))}
        </nav>

        <div className="mt-10 space-y-10">
          {loading && <p className="text-center text-white/60">A carregar…</p>}
          {!loading && filtered.length === 0 && (
            <p className="text-center text-white/60">
              Sem resultados. Tente outra palavra ou categoria.
            </p>
          )}

          {Array.from(grouped.entries()).map(([catId, items]) => {
            const cat = categories.find((c) => c.id === catId);
            return (
              <section key={catId}>
                {cat && !activeCat && (
                  <h2 className="mb-4 font-display text-xl text-[var(--gold)]">{cat.name}</h2>
                )}
                <div className="space-y-3">
                  {items.map((f) => {
                    const isOpen = openId === f.id;
                    return (
                      <div
                        key={f.id}
                        className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] transition-colors hover:border-[var(--gold)]/30"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenId(isOpen ? null : f.id)}
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                          aria-expanded={isOpen}
                        >
                          <span className="font-display text-base text-white sm:text-lg">
                            {f.question}
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-5 w-5 shrink-0 text-[var(--gold)] transition-transform",
                              isOpen && "rotate-180",
                            )}
                          />
                        </button>
                        {isOpen && (
                          <div className="border-t border-white/10 px-5 py-4 text-sm leading-relaxed text-white/80">
                            {f.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
