ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS age integer,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS referral_source text,
  ADD COLUMN IF NOT EXISTS capacity_hours integer,
  ADD COLUMN IF NOT EXISTS weekly_video_capacity integer,
  ADD COLUMN IF NOT EXISTS gpu text,
  ADD COLUMN IF NOT EXISTS cpu text,
  ADD COLUMN IF NOT EXISTS ram text,
  ADD COLUMN IF NOT EXISTS internet_mbps integer,
  ADD COLUMN IF NOT EXISTS ai_tools_usage text,
  ADD COLUMN IF NOT EXISTS ad_quality_answer text,
  ADD COLUMN IF NOT EXISTS about_self text,
  ADD COLUMN IF NOT EXISTS start_date date,
  ADD COLUMN IF NOT EXISTS best_ad_url text,
  ADD COLUMN IF NOT EXISTS best_ad_breakdown text;

CREATE OR REPLACE FUNCTION public.validate_application_input()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF length(btrim(NEW.first_name)) NOT BETWEEN 1 AND 80
     OR length(btrim(NEW.last_name)) NOT BETWEEN 1 AND 80
     OR length(btrim(NEW.email)) NOT BETWEEN 3 AND 255
     OR NEW.email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
     OR length(btrim(NEW.software)) NOT BETWEEN 1 AND 80
     OR length(btrim(NEW.availability)) NOT BETWEEN 1 AND 80 THEN
    RAISE EXCEPTION 'Invalid core application fields';
  END IF;

  IF NEW.country IS NULL OR length(btrim(NEW.country)) NOT BETWEEN 2 AND 100
     OR NEW.age IS NULL OR NEW.age NOT BETWEEN 18 AND 100
     OR NEW.city IS NULL OR length(btrim(NEW.city)) NOT BETWEEN 1 AND 100
     OR NEW.referral_source IS NULL OR NEW.referral_source NOT IN ('LinkedIn', 'OnlineJobs', 'YTJobs', 'Indeed', 'Other')
     OR NEW.capacity_hours IS NULL OR NEW.capacity_hours NOT BETWEEN 5 AND 60
     OR NEW.weekly_video_capacity IS NULL OR NEW.weekly_video_capacity NOT BETWEEN 1 AND 15
     OR NEW.years_experience IS NULL OR NEW.years_experience !~ '^(10|[0-9])$'
     OR NEW.gpu IS NULL OR length(btrim(NEW.gpu)) NOT BETWEEN 1 AND 120
     OR NEW.cpu IS NULL OR length(btrim(NEW.cpu)) NOT BETWEEN 1 AND 120
     OR NEW.ram IS NULL OR length(btrim(NEW.ram)) NOT BETWEEN 1 AND 80
     OR NEW.internet_mbps IS NULL OR NEW.internet_mbps NOT BETWEEN 1 AND 100000
     OR NEW.ai_tools_usage IS NULL OR length(btrim(NEW.ai_tools_usage)) NOT BETWEEN 1 AND 2000
     OR NEW.ad_quality_answer IS NULL OR length(btrim(NEW.ad_quality_answer)) NOT BETWEEN 1 AND 2000
     OR NEW.portfolio_url IS NULL OR NEW.portfolio_url !~* '^https?://[^\s]+$'
     OR NEW.about_self IS NULL OR length(btrim(NEW.about_self)) NOT BETWEEN 1 AND 2000
     OR NEW.start_date IS NULL
     OR NEW.best_ad_url IS NULL OR NEW.best_ad_url !~* '^https?://[^\s]+$'
     OR NEW.best_ad_breakdown IS NULL OR length(btrim(NEW.best_ad_breakdown)) NOT BETWEEN 1 AND 2000 THEN
    RAISE EXCEPTION 'Invalid or incomplete application';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_application_input ON public.applications;
CREATE TRIGGER validate_application_input
  BEFORE INSERT ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.validate_application_input();