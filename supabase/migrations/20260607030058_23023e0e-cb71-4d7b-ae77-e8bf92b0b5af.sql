
ALTER TABLE public.job_postings
  ADD COLUMN IF NOT EXISTS followup_email_subject text NOT NULL DEFAULT 'Following up on your AdChefs trial task',
  ADD COLUMN IF NOT EXISTS followup_email_body text NOT NULL DEFAULT 'Hi {{first_name}},

Just checking in — we sent you the trial task a few days ago and haven''t seen a submission yet. If life got in the way, no worries, but we''d love to see what you can do.

Task: {{notion_task_url}}
Submit here: {{submission_form_url}}?email={{email}}

Let me know if you have any questions.

— AdChefs';

CREATE OR REPLACE FUNCTION public.applications_before_insert()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.software IN ('Premiere Pro','DaVinci Resolve') AND NEW.availability = 'ASAP' THEN
    NEW.qualifies := true;
    IF NEW.stage = 'new' THEN
      NEW.stage := 'qualified';
    END IF;
    IF NEW.trial_email_scheduled_for IS NULL THEN
      NEW.trial_email_scheduled_for := now() + interval '6 hours';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;
