import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo-paulo-reis.png";
import effectIdea from "@/assets/effect-idea-logo.png";
import { useSiteSettings, useSocialLinks } from "@/hooks/use-site-data";

// TikTok inline SVG (lucide doesn't ship it)
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.94a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.84-.31z" />
  </svg>
);

const ICONS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: TikTokIcon,
};

export function Footer() {
  const { settings } = useSiteSettings();
  const socials = useSocialLinks();

  const phone = settings.contact_phone ?? "+351933842514";
  const phoneDisplay = settings.contact_phone_display ?? "+351 933 842 514";
  const email = settings.contact_email ?? "geral@paulo-reis.pt";
  const address = settings.contact_address ?? "Rua Serpa Pinto 69, 8500-706 Portimão";
  const mapsUrl = settings.contact_maps_url ?? "https://maps.app.goo.gl/NuAneixaPK8ENq678";

  return (
    <footer className="relative bg-[var(--navy)] text-white/85">
      {/* Gold divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logo} alt="Paulo Reis" className="h-14 w-auto" />
            <p className="text-sm leading-relaxed text-white/70">
              {settings.site_tagline ??
                "Estrutura, direção e legado. Consultoria imobiliária estratégica no Algarve."}
            </p>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="mb-4 font-display text-base font-semibold text-[var(--gold)]">
              Navegação
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-[var(--gold)]">Início</Link></li>
              <li><Link to="/sobre" className="hover:text-[var(--gold)]">Sobre mim</Link></li>
              <li><Link to="/constelacao-orion" className="hover:text-[var(--gold)]">Constelação Órion</Link></li>
              <li><Link to="/blog" className="hover:text-[var(--gold)]">Blog</Link></li>
              <li><Link to="/faqs" className="hover:text-[var(--gold)]">FAQs</Link></li>
              <li><Link to="/contactos" className="hover:text-[var(--gold)]">Contactos</Link></li>
              <li><Link to="/ligacoes-externas" className="hover:text-[var(--gold)]">Ligações Externas</Link></li>
            </ul>
          </div>

          {/* Contactos */}
          <div>
            <h3 className="mb-4 font-display text-base font-semibold text-[var(--gold)]">
              Contactos
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--gold)]" />
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--gold)]">
                  {address}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-[var(--gold)]" />
                <a href={`tel:${phone}`} className="hover:text-[var(--gold)]">{phoneDisplay}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-[var(--gold)]" />
                <a href={`mailto:${email}`} className="hover:text-[var(--gold)]">{email}</a>
              </li>
            </ul>
          </div>

          {/* Redes sociais */}
          <div>
            <h3 className="mb-4 font-display text-base font-semibold text-[var(--gold)]">
              Siga-me
            </h3>
            <div className="flex flex-wrap gap-3">
              {socials.map((s) => {
                const Icon = ICONS[s.platform];
                if (!Icon) return null;
                return (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--gold)]/30 text-white/80 transition-all hover:scale-110 hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 hover:text-[var(--gold)]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-12 flex flex-col items-center gap-6 border-t border-white/10 pt-8 text-center text-xs text-white/60 md:flex-row md:justify-between md:text-left">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span>© {new Date().getFullYear()} Paulo Reis · Orion Legacy</span>
            <Link to="/politica-privacidade" className="hover:text-[var(--gold)]">Política de Privacidade</Link>
            <Link to="/termos-uso" className="hover:text-[var(--gold)]">Termos de Uso</Link>
          </div>
          <a
            href="https://site.effectidea.com/#portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/60 hover:text-white"
          >
            Feito com <span className="text-red-500">❤</span> por
            <img src={effectIdea} alt="Effect Idea" className="h-5 w-auto rounded bg-white/95 px-1.5 py-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
