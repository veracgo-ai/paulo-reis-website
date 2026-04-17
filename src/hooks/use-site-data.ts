import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

let siteSettingsCache: SiteSettingMap | null = null;
let socialLinksCache: SocialLink[] | null = null;
const starsCache = new Map<string, Star[]>();
const pageSectionsCache = new Map<string, PageSection[]>();
const pageIdCache = new Map<string, string>();

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
  const [data, setData] = useState<SiteSettingMap>(() => siteSettingsCache ?? {});
  const [loading, setLoading] = useState(() => siteSettingsCache === null);

  useEffect(() => {
    let active = true;

    supabase
      .from("site_settings")
      .select("key,value")
      .then(({ data }) => {
        if (!active) return;
        const map: SiteSettingMap = {};
        (data ?? []).forEach((r) => {
          if (r.key && r.value != null) map[r.key] = r.value;
        });
        siteSettingsCache = map;
        setData(map);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { settings: data, loading };
}

export function useSocialLinks() {
  const [data, setData] = useState<SocialLink[]>(() => socialLinksCache ?? []);

  useEffect(() => {
    let active = true;

    supabase
      .from("social_links")
      .select("platform,url,display_order")
      .order("display_order")
      .then(({ data }) => {
        if (!active) return;
        socialLinksCache = (data ?? []) as SocialLink[];
        setData(socialLinksCache);
      });

    return () => {
      active = false;
    };
  }, []);

  return data;
}

export function useStars(opts?: { featuredOnly?: boolean }) {
  const cacheKey = opts?.featuredOnly ? "featured" : "all";
  const [data, setData] = useState<Star[]>(() => starsCache.get(cacheKey) ?? []);
  const [loading, setLoading] = useState(() => !starsCache.has(cacheKey));

  useEffect(() => {
    let active = true;

    let q = supabase.from("stars").select("*").order("display_order");
    if (opts?.featuredOnly) q = q.eq("is_featured_home", true);
    q.then(({ data }) => {
      if (!active) return;
      const nextStars = (data ?? []) as Star[];
      starsCache.set(cacheKey, nextStars);
      setData(nextStars);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [cacheKey, opts?.featuredOnly]);

  return { stars: data, loading };
}

export function usePageSections(pageSlug: string) {
  const [data, setData] = useState<PageSection[]>(() => pageSectionsCache.get(pageSlug) ?? []);
  const [loading, setLoading] = useState(() => !pageSectionsCache.has(pageSlug));

  useEffect(() => {
    let active = true;

    (async () => {
      let pageId = pageIdCache.get(pageSlug) ?? null;

      if (!pageId) {
        const { data: page } = await supabase
          .from("pages")
          .select("id")
          .eq("slug", pageSlug)
          .maybeSingle();

        if (!active) return;

        pageId = page?.id ?? null;
        if (pageId) pageIdCache.set(pageSlug, pageId);
      }

      if (!pageId) {
        setLoading(false);
        return;
      }

      const { data: sections } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page_id", pageId)
        .order("display_order");

      if (!active) return;

      const nextSections = (sections ?? []) as PageSection[];
      pageSectionsCache.set(pageSlug, nextSections);
      setData(nextSections);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [pageSlug]);

  return { sections: data, loading };
}

export function sectionBySlug(sections: PageSection[], slug: string) {
  return sections.find((s) => s.slug === slug);
}
