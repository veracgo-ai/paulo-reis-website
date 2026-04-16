import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichEditor } from "@/components/admin/RichEditor";
import { toast } from "sonner";
import { Loader2, Save, ArrowLeft, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/estrelas/$starId")({
  component: StarEdit,
});

type Star = {
  id: string;
  star_name: string;
  service_name: string;
  slug: string;
  tagline: string | null;
  short_description: string | null;
  full_storytelling: string | null;
  focus_strategy: string | null;
  cta_label: string | null;
  cta_url: string | null;
  hero_image_url: string | null;
  is_featured_home: boolean;
  display_order: number;
};

type Section = {
  id: string;
  star_id: string;
  slug: string;
  title: string;
  content: string | null;
  display_order: number;
};

function StarEdit() {
  const { starId } = Route.useParams();
  const router = useRouter();
  const [star, setStar] = useState<Star | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    const [sRes, secsRes] = await Promise.all([
      supabase.from("stars").select("*").eq("id", starId).maybeSingle(),
      supabase
        .from("star_sections")
        .select("id,star_id,slug,title,content,display_order")
        .eq("star_id", starId)
        .order("display_order"),
    ]);
    if (sRes.error) setLoadError(sRes.error.message);
    else if (!sRes.data) setLoadError("Estrela não encontrada.");
    else setStar(sRes.data as Star);
    setSections((secsRes.data ?? []) as Section[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [starId]);

  if (loading)
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin text-[#C5A065]" /> A carregar…
      </div>
    );
  if (loadError || !star)
    return (
      <div>
        <Link to="/admin/estrelas" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#C5A065]">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {loadError || "Estrela não encontrada."}
        </div>
      </div>
    );

  const set = (patch: Partial<Star>) => setStar({ ...star, ...patch });

  const saveStar = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("stars")
      .update({
        star_name: star.star_name,
        service_name: star.service_name,
        tagline: star.tagline,
        short_description: star.short_description,
        full_storytelling: star.full_storytelling,
        focus_strategy: star.focus_strategy,
        cta_label: star.cta_label,
        cta_url: star.cta_url,
        hero_image_url: star.hero_image_url,
        is_featured_home: star.is_featured_home,
      })
      .eq("id", star.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Estrela guardada");
  };

  const updateSec = (id: string, patch: Partial<Section>) =>
    setSections((p) => p.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const saveSec = async (s: Section) => {
    const { error } = await supabase
      .from("star_sections")
      .update({ title: s.title, content: s.content, display_order: s.display_order })
      .eq("id", s.id);
    if (error) toast.error(error.message);
    else toast.success(`"${s.title}" guardado`);
  };

  const addSec = async () => {
    const slug = "secao-" + Date.now();
    const { data, error } = await supabase
      .from("star_sections")
      .insert({
        star_id: star.id,
        slug,
        title: "Nova secção",
        display_order: sections.length,
      })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setSections((p) => [...p, data as Section]);
  };

  const removeSec = async (id: string) => {
    if (!confirm("Eliminar secção?")) return;
    await supabase.from("star_sections").delete().eq("id", id);
    setSections((p) => p.filter((s) => s.id !== id));
  };

  return (
    <div>
      <Link
        to="/admin/estrelas"
        className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#C5A065]"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar às estrelas
      </Link>
      <PageHeader
        title={star.star_name}
        description={star.service_name}
        action={
          <button
            onClick={saveStar}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-[#C5A065] px-4 py-2 text-sm font-semibold text-[#0A192F] hover:bg-[#C5A065]/90"
          >
            <Save className="h-4 w-4" /> Guardar estrela
          </button>
        }
      />

      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-serif text-lg text-[#0A192F]">Dados gerais</h3>
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Nome da estrela</label>
                <input
                  value={star.star_name}
                  onChange={(e) => set({ star_name: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Nome do serviço</label>
                <input
                  value={star.service_name}
                  onChange={(e) => set({ service_name: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Tagline</label>
              <input
                value={star.tagline || ""}
                onChange={(e) => set({ tagline: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Descrição curta</label>
              <textarea
                value={star.short_description || ""}
                onChange={(e) => set({ short_description: e.target.value })}
                rows={3}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Storytelling completo</label>
              <RichEditor
                value={star.full_storytelling || ""}
                onChange={(html) => set({ full_storytelling: html })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Foco / Estratégia</label>
              <RichEditor
                value={star.focus_strategy || ""}
                onChange={(html) => set({ focus_strategy: html })}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Texto do botão CTA</label>
                <input
                  value={star.cta_label || ""}
                  onChange={(e) => set({ cta_label: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">URL do CTA</label>
                <input
                  value={star.cta_url || ""}
                  onChange={(e) => set({ cta_url: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <ImageUpload
              value={star.hero_image_url}
              onChange={(url) => set({ hero_image_url: url })}
              folder={`stars/${star.slug}`}
              label="Imagem hero"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={star.is_featured_home}
                onChange={(e) => set({ is_featured_home: e.target.checked })}
              />
              Destacar na página inicial
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-lg text-[#0A192F]">Sub-secções da página</h3>
            <button
              onClick={addSec}
              className="inline-flex items-center gap-2 rounded-md border border-[#C5A065] px-3 py-1.5 text-xs font-semibold text-[#C5A065] hover:bg-[#C5A065]/10"
            >
              <Plus className="h-4 w-4" /> Adicionar
            </button>
          </div>
          <div className="space-y-4">
            {sections.map((s) => (
              <div key={s.id} className="rounded-md border border-slate-200 p-4">
                <div className="mb-3 flex gap-2">
                  <input
                    value={s.title}
                    onChange={(e) => updateSec(s.id, { title: e.target.value })}
                    className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    value={s.display_order}
                    onChange={(e) =>
                      updateSec(s.id, { display_order: Number(e.target.value) })
                    }
                    className="w-20 rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                  <button
                    onClick={() => saveSec(s)}
                    className="rounded-md bg-[#0A192F] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0A192F]/90"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeSec(s.id)}
                    className="rounded-md border border-red-300 px-3 py-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <RichEditor
                  value={s.content || ""}
                  onChange={(html) => updateSec(s.id, { content: html })}
                />
              </div>
            ))}
            {sections.length === 0 && (
              <p className="text-sm text-slate-500">Sem sub-secções.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
