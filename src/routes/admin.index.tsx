import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, HelpCircle, Settings, Share2, Link2 } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({
    contacts: 0,
    unread: 0,
    faqs: 0,
    links: 0,
  });

  useEffect(() => {
    Promise.all([
      supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
      supabase
        .from("contact_submissions")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false),
      supabase.from("faqs").select("*", { count: "exact", head: true }),
      supabase.from("external_links").select("*", { count: "exact", head: true }),
    ]).then(([c, u, f, l]) => {
      setStats({
        contacts: c.count ?? 0,
        unread: u.count ?? 0,
        faqs: f.count ?? 0,
        links: l.count ?? 0,
      });
    });
  }, []);

  const cards = [
    {
      to: "/admin/contactos",
      label: "Contactos",
      value: `${stats.contacts} (${stats.unread} novos)`,
      icon: Mail,
    },
    { to: "/admin/faqs", label: "FAQs ativas", value: stats.faqs, icon: HelpCircle },
    {
      to: "/admin/ligacoes-externas",
      label: "Ligações Externas",
      value: stats.links,
      icon: Link2,
    },
    { to: "/admin/configuracoes", label: "Configurações", value: "Editar", icon: Settings },
    { to: "/admin/redes-sociais", label: "Redes Sociais", value: "Editar", icon: Share2 },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-[#0A192F]">Bem-vindo</h1>
        <p className="mt-2 text-sm text-slate-600">
          Edite o conteúdo do site sem mexer em código. Todas as alterações são guardadas e
          publicadas automaticamente.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.to}
              to={c.to}
              className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#C5A065] hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <Icon className="h-5 w-5 text-[#C5A065]" />
                <span className="text-xs uppercase tracking-wider text-slate-400">Gerir</span>
              </div>
              <p className="text-2xl font-semibold text-[#0A192F]">{c.value}</p>
              <p className="mt-1 text-sm text-slate-500">{c.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 rounded-lg border border-amber-200 bg-amber-50 p-5">
        <h3 className="font-semibold text-amber-900">Em desenvolvimento (Fase B)</h3>
        <ul className="mt-2 list-disc pl-5 text-sm text-amber-800">
          <li>Editor de Posts do Blog (com WYSIWYG TipTap)</li>
          <li>Edição da página Sobre Mim</li>
          <li>Edição das 10 páginas das Estrelas</li>
          <li>Upload de imagens (Supabase Storage)</li>
        </ul>
      </div>
    </div>
  );
}
