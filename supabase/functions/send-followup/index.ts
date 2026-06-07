import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

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
    .select('followup_email_subject, followup_email_body, notion_task_url')
    .eq('id', app.job_posting_id!)
    .maybeSingle()

  if (!posting) {
    return new Response(JSON.stringify({ error: 'posting not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  const vars = {
    first_name: app.first_name,
    last_name: app.last_name,
    email: app.email,
    notion_task_url: posting.notion_task_url || '',
    submission_form_url: cfg?.submission_form_url ? `${cfg.submission_form_url}?email=${encodeURIComponent(app.email)}` : '',
  }
  const subject = render(posting.followup_email_subject || 'Following up on your trial task', vars)
  const body = render(posting.followup_email_body || '', vars)

  const { data: invokeData, error: invokeErr } = await supabase.functions.invoke('send-transactional-email', {
    body: {
      templateName: 'trial-followup',
      recipientEmail: app.email,
      idempotencyKey: `trial-followup-${app.id}-${Date.now()}`,
      templateData: { subject, body, first_name: app.first_name },
    },
  })

  if (invokeErr) {
    return new Response(JSON.stringify({ error: invokeErr.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  await supabase.from('applications').update({ followup_sent_at: new Date().toISOString() }).eq('id', app.id)

  return new Response(JSON.stringify({ success: true, result: invokeData }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
})