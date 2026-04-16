import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";

export const Route = createFileRoute("/admin/redes-sociais")({
  component: AdminSocial,
});

interface Row {
  id?: string;
  platform: string;
  url: string;
  display_order: number;
  is_active: boolean;
  _isNew?: boolean;
  _dirty?: boolean;
}

const PLATFORMS = ["facebook", "instagram", "linkedin", "tiktok", "youtube", "twitter"];

function AdminSocial() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("social_links")
      .select("*")
      .order("display_order", { ascending: true });
    setRows(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function update(idx: number, patch: Partial<Row>) {
    setRows((rs) => rs.map((r, i) => (i === idx ? { ...r, ...patch, _dirty: true } : r)));
  }

  async function remove(idx: number) {
    const r = rows[idx];
    if (r.id) {
      const { error } = await supabase.from("social_links").delete().eq("id", r.id);
      if (error) {
        toast.error("Erro ao eliminar.");
        return;
      }
    }
    setRows((rs) => rs.filter((_, i) => i !== idx));
    toast.success("Removido.");
  }

  function add() {
    setRows((rs) => [
      ...rs,
      {
        platform: "instagram",
        url: "",
        display_order: rs.length,
        is_active: true,
        _isNew: true,
        _dirty: true,
      },
    ]);
  }

  async function saveAll() {
    setSaving(true);
    try {
      for (const r of rows.filter((x) => x._dirty)) {
        if (r._isNew) {
          const { error } = await supabase.from("social_links").insert({
            platform: r.platform,
            url: r.url,
            display_order: r.display_order,
            is_active: r.is_active,
          });
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("social_links")
            .update({
              platform: r.platform,
              url: r.url,
              display_order: r.display_order,
              is_active: r.is_active,
            })
            .eq("id", r.id!);
          if (error) throw error;
        }
      }
      toast.success("Redes sociais publicadas.");
      await load();
    } catch (e) {
      console.error(e);
      toast.error("Erro ao guardar.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#C5A065]" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Redes Sociais"
        description="Adicione, edite ou desative as redes sociais que aparecem no rodapé do site."
        action={
          <>
            <button
              onClick={add}
              className="flex items-center gap-2 rounded-md border border-[#C5A065] px-4 py-2 text-sm font-semibold text-[#C5A065] transition-colors hover:bg-[#C5A065]/10"
            >
              <Plus className="h-4 w-4" /> Adicionar
            </button>
            <button
              onClick={saveAll}
              disabled={saving}
              className="flex items-center gap-2 rounded-md bg-[#C5A065] px-5 py-2 text-sm font-semibold uppercase tracking-wider text-[#0A192F] transition-colors hover:bg-[#C5A065]/90 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Publicar
            </button>
          </>
        }
      />

      <div className="space-y-3">
        {rows.length === 0 && (
          <p className="rounded-md border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            Nenhuma rede social. Clique em "Adicionar".
          </p>
        )}
        {rows.map((r, idx) => (
          <div
            key={r.id ?? `new-${idx}`}
            className="flex flex-wrap items-center gap-3 rounded-md border border-slate-200 bg-white p-4"
          >
            <select
              value={r.platform}
              onChange={(e) => update(idx, { platform: e.target.value })}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm capitalize"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <input
              type="url"
              value={r.url}
              onChange={(e) => update(idx, { url: e.target.value })}
              placeholder="https://..."
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              type="number"
              value={r.display_order}
              onChange={(e) => update(idx, { display_order: parseInt(e.target.value) || 0 })}
              className="w-20 rounded-md border border-slate-300 px-3 py-2 text-sm"
              title="Ordem"
            />
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={r.is_active}
                onChange={(e) => update(idx, { is_active: e.target.checked })}
              />
              Ativa
            </label>
            <button
              onClick={() => remove(idx)}
              className="rounded-md p-2 text-red-600 hover:bg-red-50"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
