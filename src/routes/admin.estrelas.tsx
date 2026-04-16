import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { Loader2, Edit, Star as StarIcon } from "lucide-react";

export const Route = createFileRoute("/admin/estrelas")({
  component: StarsList,
});

type Star = {
  id: string;
  star_name: string;
  service_name: string;
  slug: string;
  display_order: number;
  is_featured_home: boolean;
};

function StarsList() {
  const [stars, setStars] = useState<Star[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("stars")
      .select("id,star_name,service_name,slug,display_order,is_featured_home")
      .order("display_order")
      .then(({ data }) => {
        setStars((data ?? []) as Star[]);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader2 className="h-6 w-6 animate-spin text-[#C5A065]" />;

  return (
    <div>
      <PageHeader
        title="Constelação Órion"
        description="As 10 estrelas. Clica para editar cada página."
      />
      <div className="grid gap-3 md:grid-cols-2">
        {stars.map((s) => (
          <Link
            key={s.id}
            to="/admin/estrelas/$starId"
            params={{ starId: s.id }}
            className="group flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-[#C5A065]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A192F] text-[#C5A065]">
                <StarIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-serif text-base text-[#0A192F]">{s.star_name}</p>
                <p className="text-xs text-slate-500">{s.service_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {s.is_featured_home && (
                <span className="rounded-full bg-[#C5A065]/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#8a6f3f]">
                  Destaque
                </span>
              )}
              <Edit className="h-4 w-4 text-slate-400 group-hover:text-[#C5A065]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
