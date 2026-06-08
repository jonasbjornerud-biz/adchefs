
CREATE OR REPLACE FUNCTION public.trial_submissions_after_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  matched_id uuid;
BEGIN
  SELECT id INTO matched_id
  FROM public.applications
  WHERE lower(email) = lower(NEW.email)
  ORDER BY created_at DESC
  LIMIT 1;

  IF matched_id IS NOT NULL THEN
    UPDATE public.trial_submissions
      SET application_id = matched_id
      WHERE id = NEW.id;
    UPDATE public.applications
      SET stage = 'trial_submitted', updated_at = now()
      WHERE id = matched_id AND stage IN ('qualified','trial_sent','new');
  END IF;
  RETURN NEW;
END;
$$;

-- Backfill existing unlinked submissions
UPDATE public.trial_submissions s
SET application_id = a.id
FROM public.applications a
WHERE s.application_id IS NULL
  AND lower(a.email) = lower(s.email);

UPDATE public.applications a
SET stage = 'trial_submitted', updated_at = now()
FROM public.trial_submissions s
WHERE s.application_id = a.id
  AND a.stage IN ('qualified','trial_sent','new');
