
ALTER TABLE public.job_postings
  ADD COLUMN IF NOT EXISTS brand text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS submit_slug text;

UPDATE public.job_postings SET submit_slug = slug WHERE submit_slug IS NULL;

ALTER TABLE public.job_postings ALTER COLUMN submit_slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS job_postings_submit_slug_key ON public.job_postings(submit_slug);

ALTER TABLE public.job_postings
  ALTER COLUMN trial_email_body SET DEFAULT 'Hi {{first_name}},

After reviewing your submission for the video editing role at {{brand}}, we were impressed with your portfolio and work examples, and would like to proceed with the hiring process.

The next step will involve a task of editing a short video for one of {{brand}}''s products, where you have full creative freedom.

All of the material for the task is here:

{{notion_task_url}}

When you''re done, please submit your work here: {{submission_form_url}}

We look forward to reviewing your work before moving to the last stage, an interview, if we see potential. Best of luck!

Best,
Jonas';
