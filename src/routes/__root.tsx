import { Outlet, Link, createRootRoute, HeadContent, Scripts, useLocation } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { Toaster } from "@/components/ui/sonner";
import { FONTS_CSS_URL } from "@/lib/fonts";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--navy-deep)] px-4 text-white">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-[var(--gold)]">404</h1>
        <h2 className="mt-4 font-display text-2xl">Página não encontrada</h2>
        <p className="mt-2 text-sm text-white/70">
          A página que procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="btn-gold inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold uppercase tracking-wider"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Paulo Reis — Consultor Imobiliário | Orion Legacy" },
      {
        name: "description",
        content:
          "O imobiliário nunca foi sobre casas. É sobre pessoas, decisões e momentos que têm impacto real na vida de quem os vive.",
      },
      { name: "author", content: "Paulo Reis" },
      { property: "og:title", content: "Paulo Reis — Orion Legacy" },
      {
        property: "og:description",
        content:
          "Consultoria imobiliária estratégica. Estrutura, direção e legado.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/LHbGtbXKUseeJ59HvwO8scHcEpR2/social-images/social-1776334493735-LOGO.webp",
      },
      {
        name: "twitter:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/LHbGtbXKUseeJ59HvwO8scHcEpR2/social-images/social-1776334493735-LOGO.webp",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: FONTS_CSS_URL },
      { rel: "icon", type: "image/png", href: "/favicon.ico" },
    ],
    scripts: [
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-BFJ1Q4TRNG",
        async: true,
      },
      {
        children:
          "window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-BFJ1Q4TRNG');",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <>
        <Outlet />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
      <Toaster richColors position="top-right" />
    </>
  );
}
