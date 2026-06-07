
-- ============ JOB POSTINGS ============
CREATE TABLE public.job_postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  junior_pay text,
  senior_pay text,
  notion_task_url text NOT NULL DEFAULT '',
  trial_email_subject text NOT NULL DEFAULT 'Your AdChefs trial task',
  trial_email_body text NOT NULL DEFAULT 'Hi {{first_name}},

Thanks for applying to AdChefs. Here is your trial task:

{{notion_task_url}}

When you''re done, submit it here:
{{submission_form_url}}?email={{email}}

— AdChefs',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.job_postings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.job_postings TO authenticated;
GRANT ALL ON public.job_postings TO service_role;

ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active postings"
  ON public.job_postings FOR SELECT
  USING (is_active = true OR public.is_admin(auth.uid()));

CREATE POLICY "Admins manage postings"
  ON public.job_postings FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER job_postings_updated_at
  BEFORE UPDATE ON public.job_postings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ APPLICATIONS ============
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_posting_id uuid REFERENCES public.job_postings(id) ON DELETE SET NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  software text NOT NULL,
  availability text NOT NULL,
  portfolio_url text,
  years_experience text,
  additional_info text,
  stage text NOT NULL DEFAULT 'new'
    CHECK (stage IN ('new','qualified','trial_sent','trial_submitted','interview','hired','rejected')),
  qualifies boolean NOT NULL DEFAULT false,
  trial_email_scheduled_for timestamptz,
  trial_email_sent_at timestamptz,
  followup_sent_at timestamptz,
  proceed boolean,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX applications_email_idx ON public.applications (lower(email));
CREATE INDEX applications_stage_idx ON public.applications (stage);
CREATE INDEX applications_trial_due_idx ON public.applications (trial_email_scheduled_for)
  WHERE trial_email_sent_at IS NULL AND qualifies = true;

GRANT INSERT ON public.applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can apply"
  ON public.applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins view applications"
  ON public.applications FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins update applications"
  ON public.applications FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins delete applications"
  ON public.applications FOR DELETE
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-qualify trigger
CREATE OR REPLACE FUNCTION public.applications_before_insert()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.software IN ('Premiere Pro','DaVinci Resolve') AND NEW.availability = 'ASAP' THEN
    NEW.qualifies := true;
    IF NEW.stage = 'new' THEN
      NEW.stage := 'qualified';
    END IF;
    IF NEW.trial_email_scheduled_for IS NULL THEN
      NEW.trial_email_scheduled_for := now() + interval '4 hours';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER applications_before_insert
  BEFORE INSERT ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.applications_before_insert();

-- ============ TRIAL SUBMISSIONS ============
CREATE TABLE public.trial_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES public.applications(id) ON DELETE SET NULL,
  email text NOT NULL,
  submission_url text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX trial_submissions_email_idx ON public.trial_submissions (lower(email));
CREATE INDEX trial_submissions_app_idx ON public.trial_submissions (application_id);

GRANT INSERT ON public.trial_submissions TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.trial_submissions TO authenticated;
GRANT ALL ON public.trial_submissions TO service_role;

ALTER TABLE public.trial_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit task"
  ON public.trial_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins view submissions"
  ON public.trial_submissions FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins update submissions"
  ON public.trial_submissions FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins delete submissions"
  ON public.trial_submissions FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Auto-link trigger
CREATE OR REPLACE FUNCTION public.trial_submissions_after_insert()
RETURNS trigger
LANGUAGE plpgsql
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

CREATE TRIGGER trial_submissions_after_insert
  AFTER INSERT ON public.trial_submissions
  FOR EACH ROW EXECUTE FUNCTION public.trial_submissions_after_insert();

-- ============ APP CONFIG ============
CREATE TABLE public.app_config (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  submission_form_url text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.app_config TO anon, authenticated;
GRANT INSERT, UPDATE ON public.app_config TO authenticated;
GRANT ALL ON public.app_config TO service_role;

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view config"
  ON public.app_config FOR SELECT USING (true);

CREATE POLICY "Admins manage config"
  ON public.app_config FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER app_config_updated_at
  BEFORE UPDATE ON public.app_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SEEDS ============
INSERT INTO public.app_config (id, submission_form_url)
VALUES (1, 'https://adchefs.com/submit-task')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.job_postings (slug, title, description, junior_pay, senior_pay, notion_task_url)
VALUES (
  'video-editor',
  'Video Editor',
  'Edit high-converting paid social video ads for top e-commerce brands. Remote, project-based, paid per video.',
  '€30–60 per ad',
  '€80–150 per ad',
  'https://www.notion.so/your-task-link'
)
ON CONFLICT (slug) DO NOTHING;
