import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@3'

const str = (max: number) => z.string().trim().max(max).optional().default('')

const BodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(255),
  phone: str(50),
  company: str(200),
  website: str(500),
  message: z.string().trim().min(1).max(5000),
  budget: str(100),
  how_did_you_hear: str(100),
  utm_source: str(200),
  utm_medium: str(200),
  utm_campaign: str(200),
  landing_page: str(1000),
  referrer: str(1000),
  company_fax: str(200),
})

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

async function deliver(payload: Record<string, unknown>): Promise<string | null> {
  const url = Deno.env.get('INTAKE_URL')
  const secret = Deno.env.get('INTAKE_SECRET')
  if (!url || !secret) return 'INTAKE_URL or INTAKE_SECRET not configured'
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return `HTTP ${res.status}: ${(await res.text()).slice(0, 500)}`
    return null
  } catch (e) {
    return e instanceof Error ? e.message : String(e)
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  let body: unknown
  try { body = await req.json() } catch { return json({ error: 'Invalid JSON' }, 400) }

  // Retry mode (called by the 10-minute schedule)
  if ((body as { mode?: string })?.mode === 'retry') {
    const { data: rows } = await admin
      .from('contact_submissions')
      .select('id, payload, attempts')
      .eq('status', 'pending')
      .order('created_at')
      .limit(50)
    let delivered = 0
    for (const row of rows ?? []) {
      const err = await deliver(row.payload as Record<string, unknown>)
      await admin.from('contact_submissions').update({
        status: err ? 'pending' : 'delivered',
        attempts: row.attempts + 1,
        last_error: err,
        delivered_at: err ? null : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('id', row.id)
      if (!err) delivered++
    }
    return json({ processed: rows?.length ?? 0, delivered })
  }

  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400)

  const { company_fax, ...fields } = parsed.data
  // Honeypot: pretend success for bots
  if (company_fax) return json({ ok: true })

  const payload = { ...fields, submitted_at: new Date().toISOString() }
  const err = await deliver(payload)
  if (err) {
    console.error('Intake delivery failed, queued for retry:', err)
    const { error: dbErr } = await admin.from('contact_submissions').insert({
      payload, status: 'pending', attempts: 1, last_error: err,
    })
    if (dbErr) console.error('Failed to queue submission:', dbErr.message)
  }
  return json({ ok: true })
})
