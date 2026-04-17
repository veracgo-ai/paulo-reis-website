import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import heroPhoto from "@/assets/hero-paulo-reis.webp";
import constelacaoBg from "@/assets/constelacao-bg.webp";
import { StarField } from "./StarField";
import { useSiteSettings } from "@/hooks/use-site-data";

const TAGLINES = [
  "Estrutura. Direção. Legado.",
  "Decisões estruturadas, não casas vendidas.",
  "Onde cada movimento tem intenção.",
];

export function Hero() {
  const { settings } = useSiteSettings();
  const [tagIndex, setTagIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const bgRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  // Parallax via rAF + direct transform — no re-renders
  useEffect(() => {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      if (bgRef.current) bgRef.current.style.transform = `translate3d(0,${y * 0.25}px,0)`;
      if (photoRef.current) photoRef.current.style.transform = `translate3d(0,${y * -0.08}px,0)`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Typing effect
  useEffect(() => {
    const full = TAGLINES[tagIndex];
    let i = 0;
    setTyped("");
    const typeId = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(typeId);
        setTimeout(() => setTagIndex((p) => (p + 1) % TAGLINES.length), 2800);
      }
    }, 55);
    return () => clearInterval(typeId);
  }, [tagIndex]);

  const agendaUrl = settings.agenda_url ?? "https://bit.ly/agendaAON";

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[var(--navy-deep)]">
      {/* Constellation background with parallax */}
      <div
        ref={bgRef}
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${constelacaoBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          willChange: "transform",
        }}
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--navy-deep)]/85 via-[var(--navy)]/70 to-[var(--navy-deep)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,25,47,0.8)_85%)]" />

      {/* Animated stars (reduced count for perf) */}
      <StarField count={40} />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col-reverse items-center gap-8 px-4 pb-12 pt-32 sm:px-6 lg:flex-row lg:gap-12 lg:px-8 lg:pt-40">
        {/* Left: text */}
        <div className="flex-1 text-center lg:text-left animate-fade-in-up">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-[var(--gold)] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
            Orion Legacy
          </div>

          <h1 className="font-display text-5xl leading-[1.05] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
            Paulo Reis
          </h1>

          <p className="mt-4 min-h-[1.75rem] font-display text-xl text-[var(--gold)] sm:text-2xl">
            {typed}
            <span className="ml-0.5 inline-block h-5 w-[2px] bg-[var(--gold)] animate-pulse align-middle" />
          </p>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg lg:mx-0">
            O imobiliário nunca foi sobre casas. É sobre pessoas. Sobre decisões.
            Sobre momentos que têm impacto real na vida de quem os vive.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
            <a
              href={agendaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold inline-flex items-center justify-center rounded-md px-7 py-3.5 text-sm font-semibold uppercase tracking-wider"
            >
              Marcar conversa
            </a>
            <Link
              to="/constelacao-orion"
              className="inline-flex items-center justify-center rounded-md border border-white/30 px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 hover:text-[var(--gold)]"
            >
              Conhecer Órion
            </Link>
          </div>
        </div>

        {/* Right: photo with parallax — pushed down to hide bottom crop behind the fade */}
        <div
          ref={photoRef}
          className="relative flex-1 self-end -mb-24 lg:-mb-32"
          style={{ willChange: "transform" }}
        >
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            {/* Glow ring */}
            <div className="absolute inset-0 -z-10 mx-auto h-full w-full rounded-full bg-[var(--gold)]/15 blur-3xl" />
            <img
              src={heroPhoto}
              alt="Paulo Reis, consultor imobiliário"
              className="relative mx-auto h-auto w-full max-h-[680px] object-contain animate-float drop-shadow-2xl"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>

      {/* Bottom fade — taller so it covers the photo's lower edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-b from-transparent via-background/70 to-background" />
    </section>
  );
}
