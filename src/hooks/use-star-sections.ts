import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type StarSection = {
  id: string;
  star_id: string;
  slug: string;
  title: string;
  content: string | null;
  section_type: string | null;
  display_order: number;
};

export function useStarSections(starId: string | undefined) {
  const [data, setData] = useState<StarSection[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!starId) {
      setLoading(false);
      return;
    }
    supabase
      .from("star_sections")
      .select("*")
      .eq("star_id", starId)
      .order("display_order")
      .then(({ data }) => {
        setData((data ?? []) as StarSection[]);
        setLoading(false);
      });
  }, [starId]);
  return { sections: data, loading };
}
