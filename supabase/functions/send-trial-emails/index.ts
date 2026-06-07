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
      .select('trial_email_subject, trial_email_body, notion_task_url')
      .eq('id', app.job_posting_id)
      .maybeSingle()
    if (!posting) {
      results.push({ id: app.id, skipped: 'posting_missing' })
      continue
    }

    const vars = {
      first_name: app.first_name,
      last_name: app.last_name,
      email: app.email,
      notion_task_url: posting.notion_task_url || '',
      submission_form_url: submissionFormUrl ? `${submissionFormUrl}?email=${encodeURIComponent(app.email)}` : '',
    }
    const subject = render(posting.trial_email_subject || 'Your AdChefs trial task', vars)
    const body = render(posting.trial_email_body || '', vars)

    const { data: invokeData, error: invokeErr } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'trial-task',
        recipientEmail: app.email,
        idempotencyKey: `trial-task-${app.id}`,
        templateData: { subject, body, first_name: app.first_name },
      },
    })

    if (invokeErr) {
      console.error('send failed', app.id, invokeErr)
      results.push({ id: app.id, error: invokeErr.message })
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