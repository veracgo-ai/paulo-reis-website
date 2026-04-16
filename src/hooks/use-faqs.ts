import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type FaqCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  display_order: number;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category_id: string | null;
  display_order: number;
};

export function useFaqs() {
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: cats }, { data: items }] = await Promise.all([
        supabase
          .from("faq_categories")
          .select("id,slug,name,description,display_order")
          .order("display_order"),
        supabase
          .from("faqs")
          .select("id,question,answer,category_id,display_order")
          .order("display_order"),
      ]);
      setCategories((cats ?? []) as FaqCategory[]);
      setFaqs((items ?? []) as Faq[]);
      setLoading(false);
    })();
  }, []);

  return { categories, faqs, loading };
}
