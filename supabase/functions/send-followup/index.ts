import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { TEMPLATES } from '../_shared/transactional-email-templates/registry.ts'

const SENDER_DOMAIN = 'notify.adchefs.com'
const FROM_DOMAIN = 'adchefs.com'

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function enqueueTemplate(
  supabase: any, templateName: string, recipientEmail: string,
  idempotencyKey: string, templateData: Record<string, any>,
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
      from: `Jonas at AdChefs <jonas@${FROM_DOMAIN}>`,
      reply_to: `jonas@${FROM_DOMAIN}`,
      sender_domain: SENDER_DOMAIN,
      subject, html, text: plainText,
      purpose: 'transactional', label: templateName,
      idempotency_key: idempotencyKey,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  })
  if (error) throw new Error(error.message)
  return { queued: true, messageId }
}

function render(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => vars[k] ?? '')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceKey)

  let application_id: string
  try {
    const body = await req.json()
    application_id = body.application_id
  } catch {
    return new Response(JSON.stringify({ error: 'invalid json' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
  if (!application_id) {
    return new Response(JSON.stringify({ error: 'application_id required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  const { data: app, error } = await supabase
    .from('applications')
    .select('id, first_name, last_name, email, job_posting_id')
    .eq('id', application_id)
    .maybeSingle()
  if (error || !app) {
    return new Response(JSON.stringify({ error: 'application not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  const { data: cfg } = await supabase.from('app_config').select('submission_form_url').eq('id', 1).maybeSingle()
  const { data: posting } = await supabase
    .from('job_postings')
    .select('followup_email_subject, followup_email_body, notion_task_url, brand, submit_slug')
    .eq('id', app.job_posting_id!)
    .maybeSingle()

  if (!posting) {
    return new Response(JSON.stringify({ error: 'posting not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  const base = cfg?.submission_form_url || ''
  const submitUrl = base && posting.submit_slug
    ? `${base}-${posting.submit_slug}?email=${encodeURIComponent(app.email)}`
    : (base ? `${base}?email=${encodeURIComponent(app.email)}` : '')
  const vars = {
    first_name: app.first_name,
    last_name: app.last_name,
    email: app.email,
    brand: posting.brand || '',
    notion_task_url: posting.notion_task_url || '',
    submission_form_url: submitUrl,
  }
  const subject = render(posting.followup_email_subject || 'Following up on your trial task', vars)
  const body = render(posting.followup_email_body || '', vars)

  let invokeData: any
  try {
    invokeData = await enqueueTemplate(
      supabase, 'trial-followup', app.email,
      `trial-followup-${app.id}-${Date.now()}`,
      { subject, body, first_name: app.first_name },
    )
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  await supabase.from('applications').update({ followup_sent_at: new Date().toISOString() }).eq('id', app.id)

  return new Response(JSON.stringify({ success: true, result: invokeData }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
})