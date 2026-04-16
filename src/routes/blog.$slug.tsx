import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useBlogPost } from "@/hooks/use-blog";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Blog Paulo Reis` },
      { property: "og:type", content: "article" },
    ],
  }),
  component: BlogPostPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-[var(--navy-deep)] px-4 pt-40 text-center text-white">
      <h1 className="font-display text-4xl text-[var(--gold)]">Artigo não encontrado</h1>
      <Link to="/blog" className="mt-6 inline-block text-sm text-white/70 underline">
        Voltar ao blog
      </Link>
    </div>
  ),
});

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function renderMarkdown(text: string) {
  // Lightweight: split by blank lines, render headings & lists & paragraphs
  const blocks = text.split(/\n\n+/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={i} className="mt-8 font-display text-xl text-[var(--gold)]">
          {trimmed.replace(/^###\s+/, "")}
        </h3>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-10 font-display text-2xl text-white">
          {trimmed.replace(/^##\s+/, "")}
        </h2>
      );
    }
    if (/^(\d+\.|-)\s/m.test(trimmed)) {
      const items = trimmed
        .split("\n")
        .map((l) => l.replace(/^(\d+\.|-)\s+/, "").trim())
        .filter(Boolean);
      const ordered = /^\d+\./.test(trimmed.split("\n")[0] || "");
      const Tag = ordered ? "ol" : "ul";
      return (
        <Tag
          key={i}
          className={`mt-4 space-y-2 ${ordered ? "list-decimal" : "list-disc"} pl-6 text-white/85`}
        >
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it)}</li>
          ))}
        </Tag>
      );
    }
    return (
      <p key={i} className="mt-4 leading-relaxed text-white/85">
        {renderInline(trimmed)}
      </p>
    );
  });
}

function renderInline(text: string) {
  // Bold **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-[var(--gold)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { post, category, loading } = useBlogPost(slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--navy-deep)] pt-40 text-center text-white/60">
        A carregar…
      </div>
    );
  }
  if (!post) {
    throw notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: "Paulo Reis" },
    datePublished: post.published_at,
    image: post.cover_image_url || undefined,
  };

  return (
    <article className="relative min-h-screen bg-[var(--navy-deep)] pb-24 pt-32 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-[var(--gold)]"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao blog
        </Link>

        <header className="mt-8 border-b border-white/10 pb-8">
          {category && (
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
              {category.name}
            </span>
          )}
          <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{post.title}</h1>
          {post.excerpt && (
            <p className="mt-4 text-lg leading-relaxed text-white/75">{post.excerpt}</p>
          )}
          <p className="mt-4 text-xs uppercase tracking-wider text-white/50">
            {formatDate(post.published_at)} · Paulo Reis
          </p>
        </header>

        <div
          className="prose prose-invert mt-8 max-w-none prose-headings:font-display prose-headings:text-[var(--gold)] prose-a:text-[var(--gold)] prose-strong:text-[var(--gold)] prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />

        <div className="mt-16 rounded-lg border border-[var(--gold)]/30 bg-white/5 p-8 text-center">
          <h3 className="font-display text-2xl text-[var(--gold)]">
            Quer falar sobre o seu próximo passo?
          </h3>
          <p className="mt-3 text-white/75">
            Estratégia personalizada para investidores, compradores e vendedores.
          </p>
          <Link
            to="/contactos"
            className="btn-gold mt-6 inline-flex rounded-md px-6 py-3 text-sm font-semibold uppercase tracking-wider"
          >
            Marcar conversa
          </Link>
        </div>
      </div>
    </article>
  );
}
