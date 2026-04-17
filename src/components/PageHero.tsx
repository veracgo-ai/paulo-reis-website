import { ReactNode } from "react";

interface Props {
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  children?: ReactNode;
}

/** Shared hero for internal pages — supports background image with dark gradient overlay. */
export function PageHero({ eyebrow, title, description, imageUrl, children }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--navy-deep)] px-4 pb-20 pt-40 text-white sm:pb-28 sm:pt-48">
      {imageUrl && (
        <div
          className="absolute inset-0 -z-20 opacity-40"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--navy-deep)]/85 via-[var(--navy-deep)]/75 to-[var(--navy-deep)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.738_0.094_75.2/0.18),transparent_60%)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        {eyebrow && (
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
            {eyebrow}
          </span>
        )}
        <h1 className="font-display text-5xl leading-tight sm:text-6xl lg:text-7xl">{title}</h1>
        {description && (
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
