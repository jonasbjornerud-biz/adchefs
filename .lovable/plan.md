# Branded video editor application rebuild

## Goal
Rebuild the public job application to follow the supplied form structure while retaining AdChefs’ Paper, Ink, Surface, and Accent palette, typography, 4px corners, and editorial tone. The screenshots are visual references only.

## Page and form
- Keep the existing role page, dynamic job title, SEO data, and application success state.
- Restyle the application area as a focused, narrow application page with a branded Accent hero, concise role introduction, application-only notice, and clearly numbered sections.
- Remove the phone-number field entirely.
- Add a short privacy statement beside the submit button, matching the reference layout.
- Keep every requested answer required and show clear inline validation errors.

### 01 — About you
- First name and last name.
- Email address.
- Searchable country selector.
- Age and city.
- “Where did you hear about this job?” with LinkedIn, OnlineJobs, YTJobs, Indeed, and Other.

### 02 — Skills & work
- Editing software selector using the current software choices.
- Capacity slider starting at 40 hours per week.
- Editing-experience slider starting at 5 years.
- Weekly output slider starting at 8 videos.
- Use ranges that preserve the positions shown in the reference: 5–60 hours, 0–10 years, and 1–15 videos.
- Computer and internet group: GPU, CPU, RAM, and internet speed explicitly labeled and stored in Mbps.
- Long-form answers for AI-tool usage, what makes an ad effective in its first three seconds, and “Tell us a bit about yourself.”
- Required portfolio-folder URL with the one-link/view-access guidance from the reference.
- Required start date.
- Required best-ad example: a URL plus a concise breakdown of their contribution and why the ad works.

## Data and security
- Extend the existing applications record with additive fields for the new structured answers; preserve all historical applications.
- Keep the existing public submission and admin-only review model.
- Add database-side validation for required text, accepted referral values, sensible numeric ranges, valid URLs, and Mbps/integer fields, alongside the client-side Zod validation and input limits.
- Update the existing application submission to send only validated, trimmed values. Do not log applicant data.

## Recruitment dashboard
- Extend the existing applicant detail drawer so every new answer is visible and clearly grouped.
- Keep the current pipeline, filtering, stages, trial workflow, and historical applicant display unchanged.
- Existing applications without the new fields will show an em dash rather than erroring.

## Verification
- Test the application at desktop and mobile widths.
- Confirm searchable country selection, all slider defaults, required-field errors, URL/numeric limits, and a successful submission.
- Confirm the new answers appear in the recruitment drawer and older applications still open correctly.
- Check for build, runtime, console, and backend-policy errors.
