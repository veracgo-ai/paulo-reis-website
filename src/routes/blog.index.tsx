import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useBlogCategories, useBlogPosts } from "@/hooks/use-blog";

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

  const featured = !cat ? posts.find((p) => p.is_featured) : undefined;
  const rest = featured ? posts.filter((p) => p.id !== featured.id) : posts;

  return (
    <div className="relative min-h-screen bg-[var(--navy-deep)] pb-24 pt-32 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
            Insights & Estratégia
          </span>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Blog</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Análises, ferramentas e perspetivas sobre o mercado imobiliário, investimento e
            construção de carreira.
          </p>
        </header>

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

        {loading && <p className="text-center text-white/60">A carregar artigos…</p>}

        {!loading && posts.length === 0 && (
          <p className="text-center text-white/60">Sem artigos nesta categoria.</p>
        )}

        {/* Featured */}
        {featured && (
          <Link
            to="/blog/$slug"
            params={{ slug: featured.slug }}
            className="group mb-12 block rounded-lg border border-[var(--gold)]/30 bg-white/5 p-8 transition-all hover:border-[var(--gold)] hover:shadow-[var(--shadow-gold)]"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
              Em destaque
            </span>
            <h2 className="mt-3 font-display text-3xl text-white transition-colors group-hover:text-[var(--gold)] sm:text-4xl">
              {featured.title}
            </h2>
            {featured.excerpt && (
              <p className="mt-4 text-white/75 sm:text-lg">{featured.excerpt}</p>
            )}
            <p className="mt-6 text-xs uppercase tracking-wider text-white/50">
              {formatDate(featured.published_at)} · Ler artigo →
            </p>
          </Link>
        )}

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <Link
              key={p.id}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.03] p-6 transition-all hover:-translate-y-1 hover:border-[var(--gold)]/40 hover:bg-white/5"
            >
              <h3 className="font-display text-xl text-white transition-colors group-hover:text-[var(--gold)]">
                {p.title}
              </h3>
              {p.excerpt && (
                <p className="mt-3 line-clamp-3 flex-1 text-sm text-white/70">{p.excerpt}</p>
              )}
              <p className="mt-4 text-xs uppercase tracking-wider text-white/50">
                {formatDate(p.published_at)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
