import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Send, Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

type Posting = {
  id: string; slug: string; title: string; brand: string; submit_slug: string;
  notion_task_url: string; is_active: boolean;
};
type Application = {
  id: string; job_posting_id: string | null;
  first_name: string; last_name: string; email: string;
  software: string; stage: string; starred?: boolean | null;
  portfolio_url: string | null;
};

/* ---------------- Gravatar ---------------- */
async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
function gravatarUrl(hash: string, size = 96) {
  // d=404 -> the <img> errors out when no gravatar exists, letting us fall back to initials
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=404`;
}

function EditorAvatar({ email, name }: { email: string; name: string }) {
  const [hash, setHash] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    sha256Hex(email.trim().toLowerCase()).then(setHash);
  }, [email]);
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase()).join('') || '?';
  return (
    <div
      className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shrink-0"
      style={{ backgroundColor: '#1A1A1A', color: '#FAF8F3', fontFamily: "'Inter Tight', sans-serif", fontWeight: 600, fontSize: '14px' }}
    >
      {hash && !failed ? (
        <img
          src={gravatarUrl(hash)}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : initials}
    </div>
  );
}

/* ---------------- Email template ---------------- */
const DEFAULT_SUBJECT = (brand: string) => `An invitation from AdChefs — paid trial for ${brand}`;
const DEFAULT_BODY = (vars: {
  first_name: string; previous_brand: string; new_brand: string;
  notion_task_url: string; submission_form_url: string;
}) => `Hi ${vars.first_name},

A while back you applied for our ${vars.previous_brand || 'previous'} role and made our shortlist — your trial work genuinely stood out, even though we ended up moving forward with someone else for that brand.

We've just opened a new role with ${vars.new_brand}, and I think your editing style would be a great fit. Rather than have you go through the application again, I'd like to invite you straight to the paid trial task for them.

Task brief & assets:
${vars.notion_task_url}

When you're done, submit your work here:
${vars.submission_form_url}

No pressure if the timing doesn't work — but if it does, I'd love to see what you put together.

Best,
Jonas`;

/* ---------------- Component ---------------- */
export function ShortlistedEditors() {
  const [apps, setApps] = useState<Application[]>([]);
  const [postings, setPostings] = useState<Posting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [open, setOpen] = useState(false);
  const [targetPostingId, setTargetPostingId] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  async function load() {
    setLoading(true);
    const [{ data: a }, { data: p }] = await Promise.all([
      (supabase.from('applications' as never) as any)
        .select('id,job_posting_id,first_name,last_name,email,software,stage,starred,portfolio_url')
        .eq('starred', true).order('created_at', { ascending: false }),
      (supabase.from('job_postings' as never) as any).select('*').order('created_at', { ascending: false }),
    ]);
    setApps((a as Application[]) ?? []);
    setPostings((p as Posting[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const postingById = useMemo(() => {
    const m = new Map<string, Posting>(); postings.forEach(p => m.set(p.id, p)); return m;
  }, [postings]);
  const activePostings = postings.filter(p => p.is_active);
  const targetPosting = postings.find(p => p.id === targetPostingId);

  const selectedApps = apps.filter(a => selected.has(a.id));

  function toggle(id: string) {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }
  function toggleAll() {
    setSelected(prev => prev.size === apps.length ? new Set() : new Set(apps.map(a => a.id)));
  }

  function openInvite() {
    if (selected.size === 0) { toast.error('Select at least one editor'); return; }
    if (activePostings.length === 0) { toast.error('No active job postings'); return; }
    const first = activePostings[0];
    setTargetPostingId(first.id);
    setSubject(DEFAULT_SUBJECT(first.brand));
    // Body is regenerated per-recipient at send time; show a generic template here
    setBody(DEFAULT_BODY({
      first_name: '{{first_name}}',
      previous_brand: '{{previous_brand}}',
      new_brand: first.brand,
      notion_task_url: first.notion_task_url || '{{notion_task_url}}',
      submission_form_url: `${window.location.origin}/submit-task-${first.submit_slug}`,
    }));
    setOpen(true);
  }

  function onTargetChange(id: string) {
    setTargetPostingId(id);
    const p = postings.find(x => x.id === id);
    if (!p) return;
    setSubject(DEFAULT_SUBJECT(p.brand));
    setBody(DEFAULT_BODY({
      first_name: '{{first_name}}',
      previous_brand: '{{previous_brand}}',
      new_brand: p.brand,
      notion_task_url: p.notion_task_url || '{{notion_task_url}}',
      submission_form_url: `${window.location.origin}/submit-task-${p.submit_slug}`,
    }));
  }

  async function sendAll() {
    if (!targetPosting) { toast.error('Pick a target brand'); return; }
    setSending(true);
    let sent = 0, failed = 0;
    for (const app of selectedApps) {
      const previousBrand = postingById.get(app.job_posting_id ?? '')?.brand ?? '';
      const personalSubject = subject
        .split('{{first_name}}').join(app.first_name)
        .split('{{previous_brand}}').join(previousBrand)
        .split('{{new_brand}}').join(targetPosting.brand);
      const personalBody = body
        .split('{{first_name}}').join(app.first_name)
        .split('{{previous_brand}}').join(previousBrand || 'a previous')
        .split('{{new_brand}}').join(targetPosting.brand)
        .split('{{notion_task_url}}').join(targetPosting.notion_task_url || '')
        .split('{{submission_form_url}}').join(`${window.location.origin}/submit-task-${targetPosting.submit_slug}`);
      try {
        const { error } = await supabase.functions.invoke('send-transactional-email', {
          body: {
            templateName: 'trial-task',
            recipientEmail: app.email,
            idempotencyKey: `shortlist-invite-${app.id}-${targetPosting.id}-${Date.now()}`,
            templateData: { subject: personalSubject, body: personalBody, first_name: app.first_name },
          },
        });
        if (error) throw error;
        sent++;
      } catch (e: any) {
        console.error('invite send failed', app.email, e);
        failed++;
      }
    }
    setSending(false);
    setOpen(false);
    setSelected(new Set());
    if (sent) toast.success(`Sent ${sent} invite${sent === 1 ? '' : 's'}`);
    if (failed) toast.error(`${failed} failed`);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <span className="inline-block mono text-[11px] uppercase tracking-[0.15em] text-[#3B86A8] border border-[#3B86A8] rounded-[4px] px-[14px] py-[8px]">
            Shortlist
          </span>
          <h2
            className="mt-5 text-[26px] md:text-[32px] leading-[1.05] tracking-[-0.02em] text-[#1A1A1A]"
            style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700 }}
          >
            Shortlisted{' '}
            <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400 }}>editors.</em>
          </h2>
          <p className="mt-2 mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">
            {apps.length} starred across all roles · select & invite to a new trial
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm" variant="outline"
            onClick={toggleAll}
            className="rounded-[4px] mono text-[10px] uppercase tracking-[0.15em]"
            disabled={apps.length === 0}
          >
            {selected.size === apps.length && apps.length > 0 ? 'Clear' : 'Select all'}
          </Button>
          <Button
            size="sm"
            onClick={openInvite}
            disabled={selected.size === 0}
            className="bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-[#FAF8F3] rounded-[4px] disabled:opacity-40 mono text-[10px] uppercase tracking-[0.15em]"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" /> Invite to trial {selected.size > 0 ? `(${selected.size})` : ''}
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">Loading…</p>
      ) : apps.length === 0 ? (
        <div className="rounded-[4px] px-8 py-16 text-center" style={{ backgroundColor: '#EEEDE8' }}>
          <Star className="w-5 h-5 mx-auto mb-3" style={{ color: '#75726B' }} />
          <p className="mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">
            No shortlisted editors yet. Star applicants in the pipeline to build your shortlist.
          </p>
        </div>
      ) : (
        <ul className="border-t" style={{ borderColor: '#E2E0D9' }}>
          {apps.map(app => {
            const posting = app.job_posting_id ? postingById.get(app.job_posting_id) : null;
            const checked = selected.has(app.id);
            return (
              <li key={app.id} className="border-b" style={{ borderColor: '#E2E0D9' }}>
                <label
                  className="grid grid-cols-[auto_auto_1fr_auto_auto] items-center gap-5 py-4 px-3 sm:px-5 -mx-3 sm:-mx-5 rounded-[4px] hover:bg-[#EEEDE8] transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(app.id)}
                    className="accent-[#1A1A1A] w-4 h-4 rounded-[2px]"
                  />
                  <EditorAvatar email={app.email} name={`${app.first_name} ${app.last_name}`} />
                  <div className="min-w-0">
                    <p className="text-[17px] tracking-[-0.02em] text-[#1A1A1A] truncate" style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}>
                      {app.first_name} {app.last_name}
                    </p>
                    <p className="mono text-[11px] uppercase tracking-[0.15em] text-[#75726B] truncate">
                      {app.email}
                    </p>
                  </div>
                  <div className="hidden sm:flex flex-col items-end gap-1">
                    <span className="mono text-[10px] uppercase tracking-[0.15em] text-[#75726B]">Applied for</span>
                    <span
                      className="inline-flex items-center rounded-[4px] px-2.5 py-1 mono text-[10px] uppercase tracking-[0.15em]"
                      style={{ background: 'linear-gradient(90deg, #BFE3F5 0%, #ECF7FD 100%)', color: '#1A4A6B' }}
                    >
                      {posting?.brand ?? '—'}
                    </span>
                  </div>
                  <Star className="w-4 h-4" style={{ color: '#1A1A1A', fill: '#9ED8F5' }} />
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {/* Invite dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl rounded-[4px]">
          <DialogHeader>
            <DialogTitle className="tracking-[-0.02em]" style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700 }}>
              Invite to{' '}
              <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400 }}>new trial.</em>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <Label className="mono text-[10px] uppercase tracking-[0.15em] text-[#75726B]">Target brand (job posting)</Label>
              <Select value={targetPostingId} onValueChange={onTargetChange}>
                <SelectTrigger className="mt-1.5 rounded-[4px]"><SelectValue placeholder="Pick a brand" /></SelectTrigger>
                <SelectContent>
                  {activePostings.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.brand} — {p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mono text-[10px] uppercase tracking-[0.15em] text-[#75726B]">Recipients</Label>
              <div className="mt-1.5 flex flex-wrap gap-1.5 rounded-[4px] border p-2.5 max-h-[110px] overflow-y-auto" style={{ borderColor: '#E2E0D9', backgroundColor: '#FAF8F3' }}>
                {selectedApps.map(a => (
                  <span key={a.id} className="inline-flex items-center gap-1 rounded-[3px] px-2 py-1 mono text-[10px] uppercase tracking-[0.15em]" style={{ backgroundColor: '#EEEDE8', color: '#1A1A1A' }}>
                    <Mail className="w-3 h-3" /> {a.first_name} {a.last_name}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <Label className="mono text-[10px] uppercase tracking-[0.15em] text-[#75726B]">Subject</Label>
              <Input value={subject} onChange={e => setSubject(e.target.value)} className="mt-1.5 rounded-[4px]" />
            </div>

            <div>
              <Label className="mono text-[10px] uppercase tracking-[0.15em] text-[#75726B]">
                Body · uses {'{{first_name}}'}, {'{{previous_brand}}'}, {'{{new_brand}}'}, {'{{notion_task_url}}'}, {'{{submission_form_url}}'}
              </Label>
              <Textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={16}
                className="mt-1.5 rounded-[4px] font-mono text-[13px] leading-[1.55]"
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-[4px]">Cancel</Button>
            <Button
              onClick={sendAll}
              disabled={sending || !targetPosting}
              className="bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-[#FAF8F3] rounded-[4px]"
            >
              {sending ? 'Sending…' : (
                <><CheckCircle2 className="w-4 h-4 mr-1.5" /> Send to {selectedApps.length}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
