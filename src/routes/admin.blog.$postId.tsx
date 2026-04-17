import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichEditor } from "@/components/admin/RichEditor";
import { toast } from "sonner";
import { Loader2, Save, ArrowLeft, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/blog/$postId")({
  component: BlogPostEdit,
});

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  category_id: string | null;
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function BlogPostEdit() {
  const { postId } = Route.useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [cats, setCats] = useState<{ id: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setLoadError(null);
      const [pRes, cRes] = await Promise.all([
        supabase.from("blog_posts").select("*").eq("id", postId).maybeSingle(),
        supabase.from("blog_categories").select("id,name").order("display_order"),
      ]);
      if (pRes.error) {
        setLoadError(pRes.error.message);
      } else if (!pRes.data) {
        setLoadError("Post não encontrado.");
      } else {
        setPost(pRes.data as Post);
      }
      setCats((cRes.data ?? []) as { id: string; name: string }[]);
      setLoading(false);
      setDirty(false);
    })();
  }, [postId]);

  // Aviso ao sair sem guardar
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  if (loading)
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin text-[#C5A065]" /> A carregar post…
      </div>
    );

  if (loadError || !post)
    return (
      <div>
        <Link to="/admin/blog" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#C5A065]">
          <ArrowLeft className="h-4 w-4" /> Voltar à lista
        </Link>
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {loadError || "Post não encontrado."}
        </div>
      </div>
    );

  const set = (patch: Partial<Post>) => setPost({ ...post, ...patch });

  const save = async (publish?: boolean) => {
    setSaving(true);
    const updates: Partial<Post> = {
      title: post.title,
      slug: post.slug || slugify(post.title),
      excerpt: post.excerpt,
      content: post.content,
      cover_image_url: post.cover_image_url,
      category_id: post.category_id,
      is_featured: post.is_featured,
    };
    if (publish !== undefined) {
      updates.is_published = publish;
      if (publish && !post.published_at) updates.published_at = new Date().toISOString();
    }
    const { error } = await supabase.from("blog_posts").update(updates).eq("id", post.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(publish === true ? "Post publicado" : publish === false ? "Despublicado" : "Guardado");
    if (publish !== undefined) set({ is_published: publish });
  };

  const remove = async () => {
    if (!confirm("Eliminar este post?")) return;
    await supabase.from("blog_posts").delete().eq("id", post.id);
    router.navigate({ to: "/admin/blog" });
  };

  return (
    <div>
      <Link
        to="/admin/blog"
        className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#C5A065]"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar à lista
      </Link>
      <PageHeader
        title={post.title || "Sem título"}
        description={post.is_published ? "Publicado" : "Rascunho"}
        action={
          <>
            <button
              onClick={() => save()}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Save className="h-4 w-4" /> Guardar rascunho
            </button>
            {post.is_published ? (
              <button
                onClick={() => save(false)}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-md bg-slate-600 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Despublicar
              </button>
            ) : (
              <button
                onClick={() => save(true)}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-md bg-[#C5A065] px-4 py-2 text-sm font-semibold text-[#0A192F] hover:bg-[#C5A065]/90"
              >
                Publicar
              </button>
            )}
            <button
              onClick={remove}
              className="inline-flex items-center gap-2 rounded-md border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        }
      />

      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-serif text-lg text-[#0A192F]">Dados principais</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#0A192F]">Título</label>
              <input
                value={post.title}
                onChange={(e) => set({ title: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#0A192F]">
                  Slug (URL: /blog/{post.slug})
                </label>
                <input
                  value={post.slug}
                  onChange={(e) => set({ slug: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => set({ slug: slugify(post.title) })}
                  className="mt-1 text-xs text-[#C5A065] hover:underline"
                >
                  Gerar a partir do título
                </button>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#0A192F]">Categoria</label>
                <select
                  value={post.category_id || ""}
                  onChange={(e) => set({ category_id: e.target.value || null })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                >
                  <option value="">— Sem categoria —</option>
                  {cats.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#0A192F]">
                Resumo (excerpt)
              </label>
              <textarea
                value={post.excerpt || ""}
                onChange={(e) => set({ excerpt: e.target.value })}
                rows={3}
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </div>
            <ImageUpload
              value={post.cover_image_url}
              onChange={(url) => set({ cover_image_url: url })}
              folder="blog-covers"
              label="Imagem de capa"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={post.is_featured}
                onChange={(e) => set({ is_featured: e.target.checked })}
              />
              Marcar como destaque
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-serif text-lg text-[#0A192F]">Conteúdo</h3>
          <RichEditor
            value={post.content || ""}
            onChange={(html) => set({ content: html })}
            placeholder="Escreve o artigo..."
          />
        </div>
      </div>
    </div>
  );
}
