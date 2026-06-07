import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

function render(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => vars[k] ?? '')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
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

  const sendRes = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      templateName: 'trial-followup',
      recipientEmail: app.email,
      idempotencyKey: `trial-followup-${app.id}-${Date.now()}`,
      templateData: { subject, body, first_name: app.first_name },
    }),
  })
  const invokeData = await sendRes.json().catch(() => ({}))
  if (!sendRes.ok) {
    return new Response(JSON.stringify({ error: 'send failed', status: sendRes.status, body: invokeData }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  await supabase.from('applications').update({ followup_sent_at: new Date().toISOString() }).eq('id', app.id)

  return new Response(JSON.stringify({ success: true, result: invokeData }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
})