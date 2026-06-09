REVOKE EXECUTE ON FUNCTION public.trial_submissions_after_insert() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.trial_submissions_after_insert() TO service_role;