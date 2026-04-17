import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useBlogCategories, useBlogPosts } from "@/hooks/use-blog";
import { PageHero } from "@/components/PageHero";
import { usePageSections, sectionBySlug } from "@/hooks/use-site-data";

type BlogSearch = { cat?: string };

export const Route = createFileRoute("/blog/")({
  validateSearch: (search: Record<string, unknown>): BlogSearch => ({
    cat: typeof search.cat === "string" ? search.cat : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Blog — Paulo Reis" },
      {
        name: "description",
        content:
          "Artigos e análises sobre imobiliário, investimento, mercado e carreira. Visão estratégica por Paulo Reis.",
      },
      { property: "og:title", content: "Blog — Paulo Reis" },
      {
        property: "og:description",
        content: "Artigos e análises sobre imobiliário, investimento e carreira.",
      },
    ],
  }),
  component: BlogIndex,
});

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function BlogIndex() {
  const { cat } = useSearch({ from: "/blog/" });
  const { categories } = useBlogCategories();
  const { posts, loading } = useBlogPosts(cat);
  const { sections } = usePageSections("blog");
  const hero = sectionBySlug(sections, "hero");

  const featuredList = !cat ? posts.filter((p) => p.is_featured).slice(0, 2) : [];
  const featuredIds = new Set(featuredList.map((p) => p.id));
  const rest = posts.filter((p) => !featuredIds.has(p.id));

  return (
    <div className="relative min-h-screen bg-[var(--navy-deep)] pb-24 text-white">
      <PageHero
        eyebrow={hero?.subtitle ?? "Insights & Estratégia"}
        title={hero?.title ?? "Blog"}
        description={hero?.content ?? "Análises, ferramentas e perspetivas sobre o mercado imobiliário, investimento e construção de carreira."}
        imageUrl={hero?.image_url}
      />
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-8">

        {loading && <p className="text-center text-white/60">A carregar artigos…</p>}

        {/* Featured (acima dos filtros) */}
        {featuredList.length > 0 && (
          <div className="mb-16 space-y-10">
            {featuredList.map((f, idx) => (
              <Link
                key={f.id}
                to="/blog/$slug"
                params={{ slug: f.slug }}
                className="group grid gap-6 overflow-hidden rounded-lg border border-[var(--gold)]/30 bg-white/5 transition-all hover:border-[var(--gold)] hover:shadow-[var(--shadow-gold)] md:grid-cols-2"
              >
                <div
                  className={`relative aspect-[4/3] w-full overflow-hidden bg-white/5 md:aspect-auto md:min-h-[320px] ${
                    idx % 2 === 1 ? "md:order-2" : ""
                  }`}
                >
                  {f.cover_image_url ? (
                    <img
                      src={f.cover_image_url}
                      alt={f.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/20 to-transparent" />
                  )}
                </div>
                <div className="flex flex-col justify-center p-8">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
                    Em destaque
                  </span>
                  <h2 className="mt-3 font-display text-3xl text-white transition-colors group-hover:text-[var(--gold)] sm:text-4xl">
                    {f.title}
                  </h2>
                  {f.excerpt && (
                    <p className="mt-4 text-white/75">{f.excerpt}</p>
                  )}
                  <p className="mt-6 text-xs uppercase tracking-wider text-white/50">
                    {formatDate(f.published_at)} · Ler artigo →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Categorias */}
        <nav
          aria-label="Filtrar por categoria"
          className="mb-12 flex flex-wrap items-center justify-center gap-2"
        >
          <Link
            to="/blog"
            search={{ cat: undefined }}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              !cat
                ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--navy-deep)]"
                : "border-white/20 text-white/80 hover:border-[var(--gold)] hover:text-[var(--gold)]"
            }`}
          >
            Todos
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/blog"
              search={{ cat: c.slug }}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                cat === c.slug
                  ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--navy-deep)]"
                  : "border-white/20 text-white/80 hover:border-[var(--gold)] hover:text-[var(--gold)]"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </nav>

        {!loading && posts.length === 0 && (
          <p className="text-center text-white/60">Sem artigos nesta categoria.</p>
        )}

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <Link
              key={p.id}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] transition-all hover:-translate-y-1 hover:border-[var(--gold)]/40 hover:bg-white/5"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-white/5">
                {p.cover_image_url ? (
                  <img
                    src={p.cover_image_url}
                    alt={p.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/15 to-transparent" />
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl text-white transition-colors group-hover:text-[var(--gold)]">
                  {p.title}
                </h3>
                {p.excerpt && (
                  <p className="mt-3 line-clamp-3 flex-1 text-sm text-white/70">{p.excerpt}</p>
                )}
                <p className="mt-4 text-xs uppercase tracking-wider text-white/50">
                  {formatDate(p.published_at)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
