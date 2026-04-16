import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/logo-paulo-reis.png";
import { useStars } from "@/hooks/use-site-data";
import { cn } from "@/lib/utils";

const NAV: Array<{ to: string; label: string }> = [
  { to: "/", label: "Início" },
  { to: "/sobre", label: "Sobre mim" },
];

const POST_CONST: Array<{ to: string; label: string }> = [
  { to: "/blog", label: "Blog" },
  { to: "/faqs", label: "FAQs" },
  { to: "/contactos", label: "Contactos" },
  { to: "/ligacoes-externas", label: "Ligações" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const { stars } = useStars();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
        scrolled ? "glass-navy shadow-lg" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3" aria-label="Paulo Reis — Início">
          <img src={logo} alt="Paulo Reis" className="h-10 w-auto sm:h-12" />
          <span className="hidden font-display text-lg font-semibold text-white sm:block">
            Paulo Reis
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded px-4 py-2 text-sm font-medium uppercase tracking-wide text-white/85 transition-colors hover:text-[var(--gold)]"
              activeProps={{ className: "text-[var(--gold)]" }}
            >
              {item.label}
            </Link>
          ))}

          {/* Mega-menu Constelação */}
          <div
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1 rounded px-4 py-2 text-sm font-medium uppercase tracking-wide text-white/85 transition-colors hover:text-[var(--gold)]"
              aria-haspopup="true"
              aria-expanded={megaOpen}
            >
              Constelação Órion
              <ChevronDown className={cn("h-4 w-4 transition-transform", megaOpen && "rotate-180")} />
            </button>

            {megaOpen && (
              <div className="absolute right-0 top-full z-50 mt-0 pt-2">
                <div className="w-[640px] rounded-lg glass-navy border border-[var(--gold)]/20 p-4 shadow-2xl animate-fade-in">
                  <Link
                    to="/constelacao-orion"
                    className="mb-3 block rounded px-3 py-2 font-display text-base text-[var(--gold)] hover:bg-white/5"
                  >
                    Visão geral da Constelação →
                  </Link>
                  <div className="grid grid-cols-2 gap-1">
                    {stars.map((s) => (
                      <Link
                        key={s.id}
                        to="/constelacao-orion/$slug"
                        params={{ slug: s.slug }}
                        className="group rounded px-3 py-2 text-left transition-colors hover:bg-[var(--gold)]/10"
                      >
                        <div className="font-display text-sm font-semibold text-[var(--gold)] group-hover:text-[var(--gold-glow)]">
                          {s.star_name}
                        </div>
                        <div className="text-xs text-white/70">{s.service_name}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {POST_CONST.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded px-4 py-2 text-sm font-medium uppercase tracking-wide text-white/85 transition-colors hover:text-[var(--gold)]"
              activeProps={{ className: "text-[var(--gold)]" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile button */}
        <button
          type="button"
          className="rounded p-2 text-white lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="glass-navy border-t border-white/10 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="rounded px-3 py-2 text-sm uppercase tracking-wide text-white/90 hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded px-3 py-2 text-sm uppercase tracking-wide text-white/90 hover:bg-white/10">
                Constelação Órion
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-[var(--gold)]/20 pl-3">
                <Link
                  to="/constelacao-orion"
                  onClick={() => setMobileOpen(false)}
                  className="rounded px-3 py-2 text-xs font-semibold uppercase text-[var(--gold)]"
                >
                  Visão geral
                </Link>
                {stars.map((s) => (
                  <Link
                    key={s.id}
                    to="/constelacao-orion/$slug"
                    params={{ slug: s.slug }}
                    onClick={() => setMobileOpen(false)}
                    className="rounded px-3 py-2 text-xs text-white/80 hover:bg-white/10"
                  >
                    <span className="font-semibold text-[var(--gold)]">{s.star_name}</span> ·{" "}
                    {s.service_name}
                  </Link>
                ))}
              </div>
            </details>
            {POST_CONST.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="rounded px-3 py-2 text-sm uppercase tracking-wide text-white/90 hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
