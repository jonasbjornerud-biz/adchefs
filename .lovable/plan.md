## Goal

Send the trial task (and other transactional) emails via Resend instead of the Lovable email platform, so we get full control over the template and no platform-appended unsubscribe footer. Auth emails stay on the Lovable platform (Supabase auth hook still needs them).

## Scope

- Only `process-email-queue` worker changes. No changes to `send-transactional-email` enqueue logic, queue tables, pgmq RPCs, cron, or templates.
- Trial task email HTML already rendered by `send-transactional-email` is sent as-is — Resend will not append a footer, so output matches our template exactly.

## Steps

1. **Add `RESEND_API_KEY` secret** via the secrets tool (user supplies value).
2. **Update `supabase/functions/process-email-queue/index.ts`:**
   - Keep all existing logic: JWT check, pgmq batch read, TTL, dedupe, DLQ, rate-limit cooldown, retry counters, logging to `email_send_log`, delete-from-queue.
   - For `queue === 'auth_emails'`: keep calling `sendLovableEmail` (Supabase auth hook integration depends on it).
   - For `queue === 'transactional_emails'`: replace `sendLovableEmail` call with a `fetch('https://api.resend.com/emails', ...)` POST using `Authorization: Bearer ${RESEND_API_KEY}`. Body: `{ from: payload.from, to: payload.to, subject: payload.subject, html: payload.html, text: payload.text, headers: { 'X-Entity-Ref-ID': payload.message_id } }`.
   - Map Resend errors into the existing error shape: 429 → existing rate-limit path (read `Retry-After` header), 403/401 → forbidden/DLQ path, other non-2xx → throw to fall into the existing failed-attempts retry path.
   - Drop `unsubscribe_token` and `purpose` fields on transactional sends (Resend doesn't need them).
3. **Sender domain check.** Resend requires the `from` domain to be verified in Resend. The current `from` is `Jonas at AdChefs <jonas@notify.adchefs.com>` (Lovable-delegated subdomain). Two options:
   - **(a) Verify a new/different sender domain in Resend** (e.g. `jonas@adchefs.com` or a fresh `mail.adchefs.com`) — recommended; needs DNS records added at the registrar that Resend shows in its dashboard.
   - **(b) Use `onboarding@resend.dev`** temporarily for testing only.
   The plan assumes (a); after secret is added I'll prompt for the verified sender address and update `send-transactional-email`'s `from`/`SENDER_DOMAIN` constants accordingly.
4. **Deploy** `process-email-queue` (and `send-transactional-email` if the from-address changes).
5. **Verify**: trigger the trial email, watch `email_send_log` row go to `sent`, confirm received email has no platform footer.

## Open questions before build

- Which verified sender address should Resend use? (`jonas@adchefs.com` requires verifying `adchefs.com` root in Resend; a subdomain like `mail.adchefs.com` is cleaner and avoids touching the existing `notify.adchefs.com` delegation.)
- Do you want auth emails (signup confirmation, password reset) moved to Resend too, or leave them on the current platform?

Once you confirm those + provide the Resend API key, I'll implement.
