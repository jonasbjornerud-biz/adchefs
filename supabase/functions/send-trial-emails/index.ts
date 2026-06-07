import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

// Cron-invoked every 5 minutes. Also callable on-demand from the admin UI
// (with ?application_id=... to send a specific one immediately).

function render(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => vars[k] ?? '')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
  console.log('keys', { anonStart: anonKey?.slice(0, 6), serviceStart: serviceKey?.slice(0, 6) })
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

    const submitUrl = submissionFormUrl && posting.submit_slug
      ? `${submissionFormUrl}-${posting.submit_slug}?email=${encodeURIComponent(app.email)}`
      : (submissionFormUrl ? `${submissionFormUrl}?email=${encodeURIComponent(app.email)}` : '')
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

    const sendRes = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateName: 'trial-task',
        recipientEmail: app.email,
        idempotencyKey: `trial-task-${app.id}`,
        templateData: { subject, body, first_name: app.first_name },
      }),
    })
    const invokeData = await sendRes.json().catch(() => ({}))
    if (!sendRes.ok) {
      console.error('send failed', app.id, sendRes.status, invokeData)
      results.push({ id: app.id, error: `status ${sendRes.status}`, body: invokeData })
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