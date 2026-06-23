DROP FUNCTION IF EXISTS public.get_active_job_posting(text);
CREATE OR REPLACE FUNCTION public.get_active_job_posting(_slug text)
RETURNS TABLE (
  id uuid, slug text, title text, description text,
  junior_pay text, senior_pay text, brand text, submit_slug text,
  created_at timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id, slug, title, description, junior_pay, senior_pay, brand, submit_slug, created_at
  FROM public.job_postings
  WHERE is_active = true AND slug = _slug
  LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.get_active_job_posting(text) TO anon, authenticated;