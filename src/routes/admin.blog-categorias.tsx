import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save } from "lucide-react";

export const Route = createFileRoute("/admin/blog-categorias")({
  component: BlogCategoriesAdmin,
});

type Cat = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function BlogCategoriesAdmin() {
  const [items, setItems] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("blog_categories")
      .select("id,name,slug,description,display_order")
      .order("display_order");
    setItems((data ?? []) as Cat[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = (id: string, patch: Partial<Cat>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const save = async (item: Cat) => {
    const { error } = await supabase
      .from("blog_categories")
      .update({
        name: item.name,
        slug: item.slug || slugify(item.name),
        description: item.description,
        display_order: item.display_order,
      })
      .eq("id", item.id);
    if (error) toast.error(error.message);
    else toast.success("Categoria guardada");
  };

  const create = async () => {
    const name = "Nova categoria";
    const { data, error } = await supabase
      .from("blog_categories")
      .insert({ name, slug: slugify(name) + "-" + Date.now(), display_order: items.length })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setItems((p) => [...p, data as Cat]);
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminar categoria?")) return;
    const { error } = await supabase.from("blog_categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setItems((p) => p.filter((i) => i.id !== id));
  };

  if (loading) return <Loader2 className="h-6 w-6 animate-spin text-[#C5A065]" />;

  return (
    <div>
      <PageHeader
        title="Categorias do Blog"
        description="Organiza os posts em categorias."
        action={
          <button
            onClick={create}
            className="inline-flex items-center gap-2 rounded-md bg-[#C5A065] px-4 py-2 text-sm font-semibold text-[#0A192F] hover:bg-[#C5A065]/90"
          >
            <Plus className="h-4 w-4" /> Nova categoria
          </button>
        }
      />
      <div className="space-y-3">
        {items.map((c) => (
          <div key={c.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_80px_auto]">
              <input
                value={c.name}
                onChange={(e) => update(c.id, { name: e.target.value })}
                placeholder="Nome"
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                value={c.slug}
                onChange={(e) => update(c.id, { slug: e.target.value })}
                placeholder="slug"
                className="rounded-md border border-slate-300 px-3 py-2 font-mono text-sm"
              />
              <input
                type="number"
                value={c.display_order}
                onChange={(e) => update(c.id, { display_order: Number(e.target.value) })}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => save(c)}
                  className="rounded-md bg-[#0A192F] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0A192F]/90"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(c.id)}
                  className="rounded-md border border-red-300 px-3 py-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <textarea
              value={c.description || ""}
              onChange={(e) => update(c.id, { description: e.target.value })}
              placeholder="Descrição (opcional)"
              rows={2}
              className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-slate-500">Sem categorias. Cria a primeira.</p>
        )}
      </div>
    </div>
  );
}
