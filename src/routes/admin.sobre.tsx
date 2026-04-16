import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichEditor } from "@/components/admin/RichEditor";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

export const Route = createFileRoute("/admin/sobre")({
  component: SobreAdmin,
});

type Section = {
  id: string;
  slug: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
  display_order: number;
};

function SobreAdmin() {
  return <PageEditor pageSlug="sobre" pageTitle="Página Sobre Mim" />;
}

export function PageEditor({ pageSlug, pageTitle }: { pageSlug: string; pageTitle: string }) {
  const [sections, setSections] = useState<Section[]>([]);
  const [pageId, setPageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data: page } = await supabase
      .from("pages")
      .select("id")
      .eq("slug", pageSlug)
      .maybeSingle();
    if (!page) {
      setLoading(false);
      return;
    }
    setPageId(page.id);
    const { data: secs } = await supabase
      .from("page_sections")
      .select("id,slug,title,subtitle,content,image_url,display_order")
      .eq("page_id", page.id)
      .order("display_order");
    setSections((secs ?? []) as Section[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSlug]);

  const update = (id: string, patch: Partial<Section>) =>
    setSections((p) => p.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const save = async (s: Section) => {
    const { error } = await supabase
      .from("page_sections")
      .update({
        title: s.title,
        subtitle: s.subtitle,
        content: s.content,
        image_url: s.image_url,
        display_order: s.display_order,
      })
      .eq("id", s.id);
    if (error) toast.error(error.message);
    else toast.success(`"${s.title || s.slug}" guardado`);
  };

  if (loading) return <Loader2 className="h-6 w-6 animate-spin text-[#C5A065]" />;
  if (!pageId)
    return (
      <div>
        <PageHeader title={pageTitle} />
        <p className="text-sm text-slate-500">Página "{pageSlug}" não existe na base de dados.</p>
      </div>
    );

  return (
    <div>
      <PageHeader title={pageTitle} description="Edita cada secção da página." />
      <div className="space-y-6">
        {sections.map((s) => (
          <div key={s.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#C5A065]">{s.slug}</p>
                <h3 className="font-serif text-lg text-[#0A192F]">{s.title || "Sem título"}</h3>
              </div>
              <button
                onClick={() => save(s)}
                className="inline-flex items-center gap-2 rounded-md bg-[#C5A065] px-3 py-2 text-xs font-semibold text-[#0A192F] hover:bg-[#C5A065]/90"
              >
                <Save className="h-4 w-4" /> Guardar
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={s.title || ""}
                  onChange={(e) => update(s.id, { title: e.target.value })}
                  placeholder="Título"
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  value={s.subtitle || ""}
                  onChange={(e) => update(s.id, { subtitle: e.target.value })}
                  placeholder="Subtítulo"
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <RichEditor
                value={s.content || ""}
                onChange={(html) => update(s.id, { content: html })}
              />
              <ImageUpload
                value={s.image_url}
                onChange={(url) => update(s.id, { image_url: url })}
                folder={`pages/${pageSlug}`}
                label="Imagem da secção"
              />
            </div>
          </div>
        ))}
        {sections.length === 0 && (
          <p className="text-sm text-slate-500">
            Esta página ainda não tem secções configuradas na base de dados.
          </p>
        )}
      </div>
    </div>
  );
}
