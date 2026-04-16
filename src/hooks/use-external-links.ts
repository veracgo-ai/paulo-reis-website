import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ExternalLink = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  url: string;
  icon_name: string | null;
  display_order: number;
};

export function useExternalLinks() {
  const [links, setLinks] = useState<ExternalLink[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from("external_links")
      .select("id,slug,title,description,url,icon_name,display_order")
      .order("display_order")
      .then(({ data }) => {
        setLinks((data ?? []) as ExternalLink[]);
        setLoading(false);
      });
  }, []);
  return { links, loading };
}
