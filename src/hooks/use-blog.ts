import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

let categoriesCache: BlogCategory[] | null = null;
const postsCache = new Map<string, BlogPost[]>();
const postCache = new Map<string, { post: BlogPost | null; category: BlogCategory | null }>();

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
  const [categories, setCategories] = useState<BlogCategory[]>(() => categoriesCache ?? []);
  const [loading, setLoading] = useState(() => categoriesCache === null);

  useEffect(() => {
    let active = true;

    supabase
      .from("blog_categories")
      .select("id,slug,name,description,display_order")
      .order("display_order")
      .then(({ data }) => {
        if (!active) return;
        categoriesCache = (data ?? []) as BlogCategory[];
        setCategories(categoriesCache);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { categories, loading };
}

export function useBlogPosts(categorySlug?: string) {
  const cacheKey = categorySlug ?? "__all__";
  const [posts, setPosts] = useState<BlogPost[]>(() => postsCache.get(cacheKey) ?? []);
  const [loading, setLoading] = useState(() => !postsCache.has(cacheKey));

  useEffect(() => {
    let active = true;

    (async () => {
      if (!postsCache.has(cacheKey)) setLoading(true);

      let categoryId: string | null = null;
      if (categorySlug) {
        const { data } = await supabase
          .from("blog_categories")
          .select("id")
          .eq("slug", categorySlug)
          .maybeSingle();

        if (!active) return;

        categoryId = data?.id ?? null;
        if (!categoryId) {
          postsCache.set(cacheKey, []);
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

      if (!active) return;

      const nextPosts = (data ?? []) as BlogPost[];
      postsCache.set(cacheKey, nextPosts);
      setPosts(nextPosts);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [cacheKey, categorySlug]);

  return { posts, loading };
}

export function useBlogPost(slug: string) {
  const cachedEntry = postCache.get(slug);
  const [post, setPost] = useState<BlogPost | null>(() => cachedEntry?.post ?? null);
  const [category, setCategory] = useState<BlogCategory | null>(() => cachedEntry?.category ?? null);
  const [loading, setLoading] = useState(() => !cachedEntry);

  useEffect(() => {
    let active = true;

    (async () => {
      if (!postCache.has(slug)) setLoading(true);

      const { data: p } = await supabase
        .from("blog_posts")
        .select(
          "id,slug,title,excerpt,content,cover_image_url,category_id,is_featured,published_at,display_order",
        )
        .eq("slug", slug)
        .maybeSingle();

      if (!active) return;

      const nextPost = (p as BlogPost | null) ?? null;
      setPost(nextPost);

      let nextCategory: BlogCategory | null = null;
      if (p?.category_id) {
        const { data: c } = await supabase
          .from("blog_categories")
          .select("id,slug,name,description,display_order")
          .eq("id", p.category_id)
          .maybeSingle();

        if (!active) return;

        nextCategory = (c as BlogCategory | null) ?? null;
      }

      setCategory(nextCategory);
      postCache.set(slug, { post: nextPost, category: nextCategory });
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [slug]);

  return { post, category, loading };
}
