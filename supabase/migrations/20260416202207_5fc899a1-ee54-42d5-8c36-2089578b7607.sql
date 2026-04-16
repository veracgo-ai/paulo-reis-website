
-- Helper: all admin write policies
DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY[
    'site_settings','social_links','faqs','faq_categories','external_links',
    'blog_posts','blog_categories','pages','page_sections','stars','star_sections'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Admins write %I" ON public.%I', t, t);
    EXECUTE format(
      'CREATE POLICY "Admins write %I" ON public.%I FOR ALL TO authenticated USING (public.has_role(auth.uid(), ''admin'')) WITH CHECK (public.has_role(auth.uid(), ''admin''))',
      t, t
    );
  END LOOP;
END $$;

-- Contact submissions: admins can read + update (mark as read)
DROP POLICY IF EXISTS "Admins read contact_submissions" ON public.contact_submissions;
CREATE POLICY "Admins read contact_submissions" ON public.contact_submissions
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update contact_submissions" ON public.contact_submissions;
CREATE POLICY "Admins update contact_submissions" ON public.contact_submissions
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete contact_submissions" ON public.contact_submissions;
CREATE POLICY "Admins delete contact_submissions" ON public.contact_submissions
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
