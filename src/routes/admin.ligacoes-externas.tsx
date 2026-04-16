import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";

export const Route = createFileRoute("/admin/ligacoes-externas")({
  component: AdminExternal,
});

interface Link {
  id?: string;
  title: string;
  description: string | null;
  url: string;
  slug: string;
  icon_name: string | null;
  display_order: number;
  is_active: boolean;
  _isNew?: boolean;
  _dirty?: boolean;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function AdminExternal() {
  const [rows, setRows] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("external_links")
      .select("*")
      .order("display_order");
    setRows((data as Link[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function update(idx: number, patch: Partial<Link>) {
    setRows((rs) => rs.map((r, i) => (i === idx ? { ...r, ...patch, _dirty: true } : r)));
  }

  function add() {
    setRows((rs) => [
      ...rs,
      {
        title: "",
        description: "",
        url: "",
        slug: "",
        icon_name: "ExternalLink",
        display_order: rs.length,
        is_active: true,
        _isNew: true,
        _dirty: true,
      },
    ]);
  }

  async function remove(idx: number) {
    const r = rows[idx];
    if (r.id) {
      const { error } = await supabase.from("external_links").delete().eq("id", r.id);
      if (error) {
        toast.error("Erro ao eliminar.");
        return;
      }
    }
    setRows((rs) => rs.filter((_, i) => i !== idx));
    toast.success("Removido.");
  }

  async function saveAll() {
    setSaving(true);
    try {
      for (const r of rows.filter((x) => x._dirty)) {
        const payload = {
          title: r.title,
          description: r.description,
          url: r.url,
          slug: r.slug || slugify(r.title),
          icon_name: r.icon_name,
          display_order: r.display_order,
          is_active: r.is_active,
        };
        if (r._isNew) {
          const { error } = await supabase.from("external_links").insert(payload);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("external_links")
            .update(payload)
            .eq("id", r.id!);
          if (error) throw error;
        }
      }
      toast.success("Ligações publicadas.");
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
        title="Ligações Externas"
        description="Gerir ligações apresentadas na página /ligacoes-externas."
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
        {rows.map((r, idx) => (
          <div
            key={r.id ?? `new-${idx}`}
            className="grid gap-2 rounded-md border border-slate-200 bg-white p-4 sm:grid-cols-2"
          >
            <input
              value={r.title}
              onChange={(e) => update(idx, { title: e.target.value })}
              placeholder="Título"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium sm:col-span-2"
            />
            <input
              value={r.url}
              onChange={(e) => update(idx, { url: e.target.value })}
              placeholder="https://..."
              type="url"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              value={r.icon_name ?? ""}
              onChange={(e) => update(idx, { icon_name: e.target.value })}
              placeholder="Ícone (ex: ExternalLink, Calculator)"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <textarea
              value={r.description ?? ""}
              onChange={(e) => update(idx, { description: e.target.value })}
              placeholder="Descrição curta"
              rows={2}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
            />
            <div className="flex items-center gap-3 sm:col-span-2">
              <input
                type="number"
                value={r.display_order}
                onChange={(e) =>
                  update(idx, { display_order: parseInt(e.target.value) || 0 })
                }
                className="w-20 rounded-md border border-slate-300 px-3 py-2 text-sm"
                title="Ordem"
              />
              <label className="flex items-center gap-1.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={r.is_active}
                  onChange={(e) => update(idx, { is_active: e.target.checked })}
                />
                Ativa
              </label>
              <button
                onClick={() => remove(idx)}
                className="ml-auto rounded-md p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="rounded-md border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            Nenhuma ligação.
          </p>
        )}
      </div>
    </div>
  );
}
