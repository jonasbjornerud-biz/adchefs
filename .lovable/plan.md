
## Important: this needs a new Lovable project

You picked **Separate project**, and that's the right call — the current project is your AdChefs marketing site + editor playbook. Mixing a recruitment pipeline (with its own admin auth, RLS, cron, and email queue) into the same Supabase backend would create real risk of collision with `clients`, `modules`, and editor auth flows.

**To start:** Dashboard → New Project → paste your spec (or just say "build this") → I'll execute the plan below there. Enable Lovable Cloud on first prompt.

The rest of this plan describes exactly what gets built in that new project.

---

## 1. Database schema (single migration)

Tables, all with RLS enabled:

- `job_postings` — public read of `is_active=true` rows; admin write only.
- `applications` — anon INSERT; admin SELECT/UPDATE/DELETE.
- `trial_submissions` — anon INSERT; admin SELECT/UPDATE.
- `app_config` — single-row table (id=1, CHECK constraint); admin read/write; edge functions read via service role.
- `user_roles` (enum `app_role: 'admin'`) + `has_role()` security-definer function — used by all admin RLS policies. Roles never on a profile/user table (avoids privilege escalation).

Triggers:

- `applications_before_insert`: computes `qualifies = software IN ('Premiere Pro','DaVinci Resolve') AND availability='ASAP'`; if true, sets `stage='qualified'` and `trial_email_scheduled_for = now() + interval '4 hours'`.
- `trial_submissions_after_insert`: case-insensitive email match against latest `applications` row → fills `application_id`, sets that application's `stage='trial_submitted'`.

Seed: one `job_postings` row (Video Editor / video-editor / active), one `app_config` row with your Notion URL and a placeholder `submission_form_url` (you'll update after first deploy).

## 2. Auth + admin seed

- Lovable Cloud auth: email/password, no auto-confirm, no Google (admin-only app).
- I'll seed Jonas's admin user in SQL — **you'll give me his email + a temporary password** in the first message of the new project.
- `/admin/*` routes guarded by an `AdminGuard` that checks `has_role(uid,'admin')`.

## 3. Public pages

- `/` — Job Board: dark hero "Join AdChefs", cards from active postings, junior/senior pay shown.
- `/jobs/:slug` — Posting detail + application form. All 8 fields per spec, zod validation, success state "Thanks for applying. We review every submission and respond within 48 hours." Never reveals qualification status.
- `/submit-task` — "ADCHEFS: Skill Task Submission". Pre-fills email from `?email=`. Inserts to `trial_submissions`.

## 4. Admin dashboard

- `/admin/login` — Supabase email/password.
- `/admin` — Pipeline:
  - Stage counter strip across the top.
  - Filterable/sortable table (stage, software, qualifies, free-text name/email search).
  - Tabs: Applications / Trial Tasks / Interviews (saved filters).
  - Inline stage dropdown per row, badge styling for software (Premiere/Resolve highlighted), Yes/No proceed toggle on rows with a submission.
  - Row click → detail drawer with full record, additional_info, trial submission link, and actions:
    - **Send follow-up** (calls edge function, disables after send, shows timestamp)
    - **Mark Proceed Yes/No** (sets `proceed` + `reviewed_at`)
    - **Send trial email now** (sets `trial_email_scheduled_for = now()`, then invokes `send-trial-emails` immediately so it goes out instantly)
    - Stage changes also available here.

## 5. Email — Lovable Emails (built-in, no Resend)

Since you picked Lovable Emails, the flow is:

1. I'll provision a Lovable email subdomain (e.g. `notify.adchefs.com`) — you'll be prompted to add NS records once. App still works for everything else while DNS propagates.
2. Two React Email templates in `supabase/functions/_shared/transactional-email-templates/`:
   - `trial-task` — exact copy from spec, with `{{first_name}}`, `{{notion_task_url}}`, `{{submission_form_url}}?email={{email}}`.
   - `trial-followup` — exact copy from spec.
3. Edge functions:
   - **`send-trial-emails`** — selects qualifying applications where `trial_email_sent_at IS NULL AND trial_email_scheduled_for <= now()`, enqueues the template per recipient via `send-transactional-email`, then sets `trial_email_sent_at = now()` and `stage='trial_sent'`. Idempotent via per-application idempotency key.
   - **`send-followup`** — input `application_id`; enqueues followup; sets `followup_sent_at`.
4. `pg_cron` job runs `send-trial-emails` every 5 minutes via `pg_net` → function URL with service-role auth, set up through a migration that uses the **insert tool** (not migration tool) so the service-role key isn't baked into a remixable migration file.

No `RESEND_API_KEY` needed. Built-in queue handles retries, suppression, bounces, and the unsubscribe footer automatically (spec emails are transactional, so this is compliant).

## 6. Design

Dark, modern, bold. Black/near-black backgrounds, white text, Inter (or similar geometric sans), single neon accent (purple `#7C3AED` to match the existing AdChefs brand). All colors as HSL tokens in `index.css`, no hard-coded hex in components.

## 7. Build order I'll follow

1. Schema migration + triggers + RLS + seeds
2. Roles table + admin seed
3. Public job board + application form
4. `/submit-task` form
5. Admin login + pipeline dashboard
6. Email templates + `send-trial-emails` + `send-followup`
7. pg_cron schedule
8. Update `app_config.submission_form_url` after publish

---

## What I need from you to start in the new project

1. Create the new project and paste this plan (or the original spec).
2. First message: Jonas's admin **email + temporary password** for the seed.
3. After first deploy, the published URL so I can set `app_config.submission_form_url`.
4. When prompted, add the NS records for the Lovable email subdomain at your DNS provider.

Want me to also draft the exact opening prompt to paste into the new project?
