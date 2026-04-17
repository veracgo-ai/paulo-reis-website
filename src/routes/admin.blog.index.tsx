import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { toast } from "sonner";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/blog/")({
  component: BlogPostsAdmin,
});

type Post = {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;
  category_id: string | null;
};
type Cat = { id: string; name: string };

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function BlogPostsAdmin() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase
        .from("blog_posts")
        .select("id,title,slug,is_published,is_featured,published_at,category_id")
        .order("published_at", { ascending: false, nullsFirst: false }),
      supabase.from("blog_categories").select("id,name").order("display_order"),
    ]);
    setPosts((p ?? []) as Post[]);
    setCats((c ?? []) as Cat[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    const title = "Novo post";
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({ title, slug: slugify(title) + "-" + Date.now() })
      .select()
      .single();
    if (error) return toast.error(error.message);
    router.navigate({ to: "/admin/blog/$postId", params: { postId: data.id } });
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminar post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setPosts((p) => p.filter((x) => x.id !== id));
  };

  if (loading) return <Loader2 className="h-6 w-6 animate-spin text-[#C5A065]" />;

  const catName = (id: string | null) => cats.find((c) => c.id === id)?.name || "—";

  return (
    <div>
      <PageHeader
        title="Posts do Blog"
        description="Gere os artigos publicados no blog."
        action={
          <button
            onClick={create}
            className="inline-flex items-center gap-2 rounded-md bg-[#C5A065] px-4 py-2 text-sm font-semibold text-[#0A192F] hover:bg-[#C5A065]/90"
          >
            <Plus className="h-4 w-4" /> Novo post
          </button>
        }
      />
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-[#0A192F]">{p.title}</div>
                  <div className="font-mono text-xs text-slate-400">/{p.slug}</div>
                </td>
                <td className="px-4 py-3 text-slate-600">{catName(p.category_id)}</td>
                <td className="px-4 py-3">
                  {p.is_published ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      Publicado
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
                      Rascunho
                    </span>
                  )}
                  {p.is_featured && (
                    <span className="ml-2 rounded-full bg-[#C5A065]/20 px-2 py-0.5 text-xs font-medium text-[#8a6f3f]">
                      Destaque
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      to="/admin/blog/$postId"
                      params={{ postId: p.id }}
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      <Edit className="inline h-3.5 w-3.5" /> Editar
                    </Link>
                    <button
                      onClick={() => remove(p.id)}
                      className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="inline h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-slate-400">
                  Nenhum post. Cria o primeiro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
