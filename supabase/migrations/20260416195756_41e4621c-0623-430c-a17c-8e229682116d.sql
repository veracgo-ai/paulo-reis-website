
CREATE POLICY "Anyone can submit contact" ON public.contact_submissions
  FOR INSERT TO public WITH CHECK (true);
