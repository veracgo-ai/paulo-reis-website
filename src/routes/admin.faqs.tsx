import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";

export const Route = createFileRoute("/admin/faqs")({
  component: AdminFaqs,
});

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Faq {
  id?: string;
  question: string;
  answer: string;
  category_id: string | null;
  display_order: number;
  is_active: boolean;
  _isNew?: boolean;
  _dirty?: boolean;
}

function AdminFaqs() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const [c, f] = await Promise.all([
      supabase.from("faq_categories").select("id, name, slug").order("display_order"),
      supabase.from("faqs").select("*").order("display_order"),
    ]);
    setCategories((c.data as Category[]) ?? []);
    setFaqs((f.data as Faq[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function update(idx: number, patch: Partial<Faq>) {
    setFaqs((xs) => xs.map((x, i) => (i === idx ? { ...x, ...patch, _dirty: true } : x)));
  }

  function add() {
    setFaqs((xs) => [
      ...xs,
      {
        question: "",
        answer: "",
        category_id: categories[0]?.id ?? null,
        display_order: xs.length,
        is_active: true,
        _isNew: true,
        _dirty: true,
      },
    ]);
  }

  async function remove(idx: number) {
    const f = faqs[idx];
    if (f.id) {
      const { error } = await supabase.from("faqs").delete().eq("id", f.id);
      if (error) {
        toast.error("Erro ao eliminar.");
        return;
      }
    }
    setFaqs((xs) => xs.filter((_, i) => i !== idx));
    toast.success("Removida.");
  }

  async function saveAll() {
    setSaving(true);
    try {
      for (const f of faqs.filter((x) => x._dirty)) {
        const payload = {
          question: f.question,
          answer: f.answer,
          category_id: f.category_id,
          display_order: f.display_order,
          is_active: f.is_active,
        };
        if (f._isNew) {
          const { error } = await supabase.from("faqs").insert(payload);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("faqs").update(payload).eq("id", f.id!);
          if (error) throw error;
        }
      }
      toast.success("FAQs publicadas.");
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
        title="FAQs"
        description="Gerir perguntas frequentes do site, organizadas por categoria."
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

      <div className="space-y-4">
        {faqs.map((f, idx) => (
          <div
            key={f.id ?? `new-${idx}`}
            className="rounded-md border border-slate-200 bg-white p-4"
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <select
                value={f.category_id ?? ""}
                onChange={(e) => update(idx, { category_id: e.target.value || null })}
                className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
              >
                <option value="">— sem categoria —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={f.display_order}
                onChange={(e) => update(idx, { display_order: parseInt(e.target.value) || 0 })}
                className="w-20 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                title="Ordem"
              />
              <label className="flex items-center gap-1.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={f.is_active}
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
            <input
              value={f.question}
              onChange={(e) => update(idx, { question: e.target.value })}
              placeholder="Pergunta"
              className="mb-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-medium"
            />
            <textarea
              value={f.answer}
              onChange={(e) => update(idx, { answer: e.target.value })}
              placeholder="Resposta"
              rows={3}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        ))}
        {faqs.length === 0 && (
          <p className="rounded-md border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            Nenhuma FAQ.
          </p>
        )}
      </div>
    </div>
  );
}
