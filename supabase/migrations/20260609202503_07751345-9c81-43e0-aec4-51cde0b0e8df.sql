
-- 1. Move sensitive client credentials to a separate admin-only table
CREATE TABLE IF NOT EXISTS public.client_secrets (
  client_id uuid PRIMARY KEY REFERENCES public.clients(id) ON DELETE CASCADE,
  current_password text,
  meta_access_token text,
  meta_ad_account_id text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Backfill from clients
INSERT INTO public.client_secrets (client_id, current_password, meta_access_token, meta_ad_account_id)
SELECT id, current_password, meta_access_token, meta_ad_account_id
FROM public.clients
WHERE current_password IS NOT NULL OR meta_access_token IS NOT NULL OR meta_ad_account_id IS NOT NULL
ON CONFLICT (client_id) DO NOTHING;

-- Grants: only service role and admins (via RPC) access; nothing for anon/authenticated direct
GRANT ALL ON public.client_secrets TO service_role;
ALTER TABLE public.client_secrets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage client secrets" ON public.client_secrets
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_secrets TO authenticated;

-- Drop sensitive columns from clients
ALTER TABLE public.clients
  DROP COLUMN IF EXISTS current_password,
  DROP COLUMN IF EXISTS meta_access_token,
  DROP COLUMN IF EXISTS meta_ad_account_id;

-- 2. Restrict meta_ads_cache: remove permissive policy. Service role bypasses RLS.
DROP POLICY IF EXISTS "Allow service role full access" ON public.meta_ads_cache;
CREATE POLICY "Admins read meta ads cache" ON public.meta_ads_cache
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));
REVOKE SELECT ON public.meta_ads_cache FROM anon;

-- 3. job_postings: create public-safe view; restrict table SELECT to admins only
DROP POLICY IF EXISTS "Public can view active postings" ON public.job_postings;
CREATE POLICY "Admins can view all postings" ON public.job_postings
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE OR REPLACE VIEW public.job_postings_public
WITH (security_invoker = true)
AS
SELECT id, slug, title, description, junior_pay, senior_pay, brand, submit_slug, is_active
FROM public.job_postings
WHERE is_active = true;

-- View can't have RLS; expose via grants. We need anon/authenticated to read it.
-- But the underlying table blocks them. Use security definer function instead.
DROP VIEW IF EXISTS public.job_postings_public;

CREATE OR REPLACE FUNCTION public.list_active_job_postings()
RETURNS TABLE (
  id uuid, slug text, title text, description text,
  junior_pay text, senior_pay text, brand text, submit_slug text
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id, slug, title, description, junior_pay, senior_pay, brand, submit_slug
  FROM public.job_postings
  WHERE is_active = true;
$$;

CREATE OR REPLACE FUNCTION public.get_active_job_posting(_slug text)
RETURNS TABLE (
  id uuid, slug text, title text, description text,
  junior_pay text, senior_pay text, brand text, submit_slug text
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id, slug, title, description, junior_pay, senior_pay, brand, submit_slug
  FROM public.job_postings
  WHERE is_active = true AND slug = _slug
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_active_job_posting_by_submit_slug(_submit_slug text)
RETURNS TABLE (title text, brand text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT title, brand
  FROM public.job_postings
  WHERE is_active = true AND submit_slug = _submit_slug
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.list_active_job_postings() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_active_job_posting(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_active_job_posting_by_submit_slug(text) TO anon, authenticated;

-- 4. Lock down SECURITY DEFINER email queue helpers + set search_path
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;

REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;
