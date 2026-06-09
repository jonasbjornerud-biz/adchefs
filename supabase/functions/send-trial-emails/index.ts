import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { TEMPLATES } from '../_shared/transactional-email-templates/registry.ts'

const SENDER_DOMAIN = 'adchefs.com'
const FROM_DOMAIN = 'adchefs.com'

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function enqueueTemplate(
  supabase: any,
  templateName: string,
  recipientEmail: string,
  idempotencyKey: string,
  templateData: Record<string, any>,
) {
  const template = TEMPLATES[templateName]
  if (!template) throw new Error(`template ${templateName} not registered`)

  const normalized = recipientEmail.toLowerCase()

  const { data: suppressed } = await supabase
    .from('suppressed_emails').select('id').eq('email', normalized).maybeSingle()
  if (suppressed) return { suppressed: true }

  let unsubscribeToken: string
  const { data: existing } = await supabase
    .from('email_unsubscribe_tokens').select('token, used_at').eq('email', normalized).maybeSingle()
  if (existing && !existing.used_at) {
    unsubscribeToken = existing.token
  } else {
    unsubscribeToken = generateToken()
    await supabase.from('email_unsubscribe_tokens')
      .upsert({ token: unsubscribeToken, email: normalized }, { onConflict: 'email', ignoreDuplicates: true })
    const { data: stored } = await supabase
      .from('email_unsubscribe_tokens').select('token').eq('email', normalized).maybeSingle()
    if (stored?.token) unsubscribeToken = stored.token
  }

  const html = await renderAsync(React.createElement(template.component, templateData))
  const plainText = await renderAsync(React.createElement(template.component, templateData), { plainText: true })
  const subject = typeof template.subject === 'function' ? template.subject(templateData) : template.subject

  const messageId = crypto.randomUUID()
  await supabase.from('email_send_log').insert({
    message_id: messageId, template_name: templateName, recipient_email: recipientEmail, status: 'pending',
  })

  const { error } = await supabase.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: {
      message_id: messageId,
      to: recipientEmail,
      from: `Jonas <jonas@${FROM_DOMAIN}>`,
      reply_to: `jonas@${FROM_DOMAIN}`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text: plainText,
      purpose: 'transactional',
      label: templateName,
      idempotency_key: idempotencyKey,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  })
  if (error) throw new Error(error.message)
  return { queued: true, messageId }
}

// Cron-invoked every 5 minutes. Also callable on-demand from the admin UI
// (with ?application_id=... to send a specific one immediately).

function render(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => vars[k] ?? '')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceKey)

  const url = new URL(req.url)
  const onlyId = url.searchParams.get('application_id')

  // Fetch app_config for submission form URL
  const { data: cfg } = await supabase.from('app_config').select('submission_form_url').eq('id', 1).maybeSingle()
  const submissionFormUrl = cfg?.submission_form_url || ''

  let query = supabase
    .from('applications')
    .select('id, first_name, last_name, email, job_posting_id, trial_email_scheduled_for, trial_email_sent_at, qualifies, stage')
    .is('trial_email_sent_at', null)
    .eq('qualifies', true)

  if (onlyId) {
    query = query.eq('id', onlyId)
  } else {
    query = query.lte('trial_email_scheduled_for', new Date().toISOString())
  }

  const { data: apps, error } = await query.limit(50)
  if (error) {
    console.error('Failed to load applications', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  const results: any[] = []
  for (const app of apps ?? []) {
    if (!app.job_posting_id) {
      results.push({ id: app.id, skipped: 'no_posting' })
      continue
    }
    const { data: posting } = await supabase
      .from('job_postings')
      .select('trial_email_subject, trial_email_body, notion_task_url, brand, submit_slug')
      .eq('id', app.job_posting_id)
      .maybeSingle()
    if (!posting) {
      results.push({ id: app.id, skipped: 'posting_missing' })
      continue
    }

    const query = `?email=${encodeURIComponent(app.email)}&app=${encodeURIComponent(app.id)}`
    const submitUrl = submissionFormUrl && posting.submit_slug
      ? `${submissionFormUrl}-${posting.submit_slug}${query}`
      : (submissionFormUrl ? `${submissionFormUrl}${query}` : '')
    const vars = {
      first_name: app.first_name,
      last_name: app.last_name,
      email: app.email,
      brand: posting.brand || '',
      notion_task_url: posting.notion_task_url || '',
      submission_form_url: submitUrl,
    }
    const subject = render(posting.trial_email_subject || 'Your AdChefs trial task', vars)
    const body = render(posting.trial_email_body || '', vars)

    let invokeData: any
    try {
      invokeData = await enqueueTemplate(
        supabase, 'trial-task', app.email, `trial-task-${app.id}`,
        { subject, body, first_name: app.first_name },
      )
    } catch (e) {
      console.error('send failed', app.id, e)
      results.push({ id: app.id, error: (e as Error).message })
      continue
    }

    await supabase
      .from('applications')
      .update({ trial_email_sent_at: new Date().toISOString(), stage: 'trial_sent' })
      .eq('id', app.id)

    results.push({ id: app.id, sent: true, result: invokeData })
  }

  return new Response(JSON.stringify({ processed: results.length, results }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})