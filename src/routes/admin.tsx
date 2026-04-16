import { createFileRoute, Outlet, Link, useRouter, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  User,
  Star,
  FileText,
  HelpCircle,
  Mail,
  Link2,
  Share2,
  Settings,
  ExternalLink,
  LogOut,
  Loader2,
} from "lucide-react";
import logoUrl from "@/assets/logo-paulo-reis.png";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({
    meta: [
      { title: "Painel Administrativo — Paulo Reis" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/inicio", label: "Início (página)", icon: LayoutDashboard },
  { to: "/admin/sobre", label: "Sobre Mim", icon: User },
  { to: "/admin/estrelas", label: "Constelação Orion", icon: Star },
  { to: "/admin/blog", label: "Blog (posts)", icon: FileText },
  { to: "/admin/blog-categorias", label: "Blog (categorias)", icon: FileText },
  { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { to: "/admin/contactos", label: "Contactos", icon: Mail },
  { to: "/admin/ligacoes-externas", label: "Ligações Externas", icon: Link2 },
  { to: "/admin/redes-sociais", label: "Redes Sociais", icon: Share2 },
  { to: "/admin/configuracoes", label: "Configurações Gerais", icon: Settings },
];

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const location = useLocation();
  const isLoginPage = location.pathname === "/admin/login";

  useEffect(() => {
    if (loading || isLoginPage) return;
    if (!user) {
      router.navigate({ to: "/admin/login" });
    } else if (!isAdmin) {
      // logged in but not admin
      supabase.auth.signOut();
    }
  }, [user, isAdmin, loading, isLoginPage, router]);

  if (isLoginPage) {
    return <Outlet />;
  }

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A192F]">
        <Loader2 className="h-8 w-8 animate-spin text-[#C5A065]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-white/10 bg-[#0A192F] text-white">
        <div className="border-b border-white/10 px-5 py-5">
          <img src={logoUrl} alt="Paulo Reis" className="mb-3 h-10 w-auto" />
          <p className="text-xs uppercase tracking-[0.2em] text-[#C5A065]">Painel</p>
          <p className="text-sm font-semibold">Administrativo</p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-3 mt-3 flex items-center gap-2 rounded-md border border-[#C5A065]/40 px-3 py-2 text-sm text-[#C5A065] transition-colors hover:bg-[#C5A065]/10"
        >
          <ExternalLink className="h-4 w-4" />
          Ver Site
        </a>

        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-[#C5A065] text-[#0A192F] font-semibold"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <p className="mb-2 truncate text-xs text-white/60">{user.email}</p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.navigate({ to: "/admin/login" });
            }}
            className="flex w-full items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" />
            Terminar sessão
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
