import { useReveal } from "@/hooks/use-reveal";
import fotoModelo from "@/assets/foto-modelo.webp";

interface Props {
  title?: string | null;
  subtitle?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  reverse?: boolean;
}

/** Renders Markdown-lite content (bold + bullet lists + paragraphs). */
function renderContent(content: string) {
  const blocks = content.split(/\n\n+/);
  return blocks.map((block, i) => {
    const lines = block.split("\n").filter(Boolean);
    const isList = lines.every((l) => l.trim().startsWith("- "));
    if (isList) {
      return (
        <ul key={i} className="ml-6 list-disc space-y-2">
          {lines.map((l, j) => (
            <li key={j}>{formatInline(l.replace(/^-\s*/, ""))}</li>
          ))}
        </ul>
      );
    }
    if (lines.length === 1 && lines[0].startsWith("**") && lines[0].endsWith("**")) {
      return (
        <h3 key={i} className="font-display text-2xl text-[var(--navy)]">
          {lines[0].replace(/\*\*/g, "")}
        </h3>
      );
    }
    return (
      <p key={i} className="leading-relaxed">
        {lines.map((l, j) => (
          <span key={j}>
            {formatInline(l)}
            {j < lines.length - 1 && <br />}
          </span>
        ))}
      </p>
    );
  });
}
function formatInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-[var(--navy)]">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

export function ApresentacaoSection({ title, subtitle, content, imageUrl, reverse }: Props) {
  const ref = useReveal();
  const src = imageUrl || fotoModelo;
  return (
    <section ref={ref} className="reveal relative overflow-hidden bg-white px-4 py-20 sm:py-28">
      <div
        className={`mx-auto grid max-w-7xl gap-12 lg:items-start ${
          reverse ? "lg:grid-cols-[1.4fr_1fr]" : "lg:grid-cols-[1fr_1.4fr]"
        }`}
      >
        {/* Image side */}
        <div className={`relative ${reverse ? "lg:order-2" : ""}`}>
          <div className="absolute -inset-4 -z-10 rounded-md bg-gradient-to-br from-[var(--gold)]/20 to-transparent blur-2xl" />
          <div className="relative overflow-hidden rounded-md shadow-[0_20px_60px_-15px_rgba(10,25,47,0.35)]">
            <img
              src={src}
              alt={title ?? "Paulo Reis"}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--navy)]/40 to-transparent" />
          </div>
          <div className="absolute -bottom-3 -right-3 h-24 w-24 border-b-4 border-r-4 border-[var(--gold)]" />
        </div>

        {/* Text side */}
        <div className={`space-y-6 text-[var(--neutral-dark)] ${reverse ? "lg:order-1" : ""}`}>
          {subtitle && (
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">
              {subtitle}
            </span>
          )}
          {title && (
            <h2 className="font-display text-4xl leading-tight text-[var(--navy)] sm:text-5xl">
              {title}
            </h2>
          )}
          {content && <div className="space-y-5 text-base sm:text-lg">{renderContent(content)}</div>}
        </div>
      </div>
    </section>
  );
}
