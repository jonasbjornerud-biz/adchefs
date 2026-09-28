CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  last_error text,
  delivered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view contact submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
GRANT SELECT ON public.contact_submissions TO authenticated;
CREATE INDEX contact_submissions_pending_idx ON public.contact_submissions (status) WHERE status = 'pending';