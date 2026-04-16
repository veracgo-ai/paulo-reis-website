import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettingMap = Record<string, string>;
export type SocialLink = { platform: string; url: string };
export type Star = {
  id: string;
  slug: string;
  star_name: string;
  service_name: string;
  tagline: string | null;
  short_description: string | null;
  full_storytelling: string | null;
  focus_strategy: string | null;
  cta_label: string | null;
  cta_url: string | null;
  display_order: number;
  is_featured_home: boolean;
  hero_image_url: string | null;
};
export type PageSection = {
  id: string;
  slug: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  cta_label: string | null;
  cta_url: string | null;
  image_url: string | null;
  display_order: number;
};

export function useSiteSettings() {
  const [data, setData] = useState<SiteSettingMap>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from("site_settings")
      .select("key,value")
      .then(({ data }) => {
        const map: SiteSettingMap = {};
        (data ?? []).forEach((r) => {
          if (r.key && r.value != null) map[r.key] = r.value;
        });
        setData(map);
        setLoading(false);
      });
  }, []);
  return { settings: data, loading };
}

export function useSocialLinks() {
  const [data, setData] = useState<SocialLink[]>([]);
  useEffect(() => {
    supabase
      .from("social_links")
      .select("platform,url,display_order")
      .order("display_order")
      .then(({ data }) => setData((data ?? []) as SocialLink[]));
  }, []);
  return data;
}

export function useStars(opts?: { featuredOnly?: boolean }) {
  const [data, setData] = useState<Star[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let q = supabase.from("stars").select("*").order("display_order");
    if (opts?.featuredOnly) q = q.eq("is_featured_home", true);
    q.then(({ data }) => {
      setData((data ?? []) as Star[]);
      setLoading(false);
    });
  }, [opts?.featuredOnly]);
  return { stars: data, loading };
}

export function usePageSections(pageSlug: string) {
  const [data, setData] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const { data: page } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", pageSlug)
        .maybeSingle();
      if (!page) {
        setLoading(false);
        return;
      }
      const { data: sections } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page_id", page.id)
        .order("display_order");
      setData((sections ?? []) as PageSection[]);
      setLoading(false);
    })();
  }, [pageSlug]);
  return { sections: data, loading };
}

export function sectionBySlug(sections: PageSection[], slug: string) {
  return sections.find((s) => s.slug === slug);
}
