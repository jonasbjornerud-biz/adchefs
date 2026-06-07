CREATE OR REPLACE FUNCTION public.applications_before_insert()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.software IN ('Premiere Pro','DaVinci Resolve') THEN
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