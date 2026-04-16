import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type BlogCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  display_order: number;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  category_id: string | null;
  is_featured: boolean;
  published_at: string | null;
  display_order: number;
};

export function useBlogCategories() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from("blog_categories")
      .select("id,slug,name,description,display_order")
      .order("display_order")
      .then(({ data }) => {
        setCategories((data ?? []) as BlogCategory[]);
        setLoading(false);
      });
  }, []);
  return { categories, loading };
}

export function useBlogPosts(categorySlug?: string) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let categoryId: string | null = null;
      if (categorySlug) {
        const { data } = await supabase
          .from("blog_categories")
          .select("id")
          .eq("slug", categorySlug)
          .maybeSingle();
        categoryId = data?.id ?? null;
        if (!categoryId) {
          setPosts([]);
          setLoading(false);
          return;
        }
      }
      let q = supabase
        .from("blog_posts")
        .select(
          "id,slug,title,excerpt,content,cover_image_url,category_id,is_featured,published_at,display_order",
        )
        .order("published_at", { ascending: false });
      if (categoryId) q = q.eq("category_id", categoryId);
      const { data } = await q;
      setPosts((data ?? []) as BlogPost[]);
      setLoading(false);
    })();
  }, [categorySlug]);

  return { posts, loading };
}

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [category, setCategory] = useState<BlogCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: p } = await supabase
        .from("blog_posts")
        .select(
          "id,slug,title,excerpt,content,cover_image_url,category_id,is_featured,published_at,display_order",
        )
        .eq("slug", slug)
        .maybeSingle();
      setPost((p as BlogPost | null) ?? null);
      if (p?.category_id) {
        const { data: c } = await supabase
          .from("blog_categories")
          .select("id,slug,name,description,display_order")
          .eq("id", p.category_id)
          .maybeSingle();
        setCategory((c as BlogCategory | null) ?? null);
      } else {
        setCategory(null);
      }
      setLoading(false);
    })();
  }, [slug]);

  return { post, category, loading };
}
