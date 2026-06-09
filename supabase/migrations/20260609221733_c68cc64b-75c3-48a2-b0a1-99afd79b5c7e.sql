CREATE OR REPLACE FUNCTION public.trial_submissions_after_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  matched_id uuid;
BEGIN
  IF NEW.application_id IS NOT NULL THEN
    SELECT id INTO matched_id
    FROM public.applications
    WHERE id = NEW.application_id
    LIMIT 1;
  END IF;

  IF matched_id IS NULL THEN
    SELECT id INTO matched_id
    FROM public.applications
    WHERE lower(email) = lower(NEW.email)
    ORDER BY created_at DESC
    LIMIT 1;
  END IF;

  IF matched_id IS NOT NULL THEN
    UPDATE public.trial_submissions
      SET application_id = matched_id
      WHERE id = NEW.id
        AND application_id IS DISTINCT FROM matched_id;

    UPDATE public.applications
      SET stage = 'trial_submitted', updated_at = now()
      WHERE id = matched_id AND stage IN ('qualified','trial_sent','new');
  END IF;

  RETURN NEW;
END;
$$;