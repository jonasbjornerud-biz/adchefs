import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Send, Mail, CheckCircle2, Play, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { EmbeddedSubmission } from './RecruitmentPanel';

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
type Submission = {
  id: string; application_id: string | null; email: string;
  submission_url: string; notes: string | null; created_at: string;
};

/* ---------------- Profile photo ----------------
 * unavatar.io aggregates public avatars from Google, Gravatar, Twitter, etc.
 * by email. Falls back to initials on failure.
 */
function initialsOf(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase()).join('') || '?';
}

function ProfilePhoto({ email, name, size = 'lg' }: { email: string; name: string; size?: 'sm' | 'lg' }) {
  const [idx, setIdx] = useState(0);
  const sources = [
    `https://unavatar.io/google/${encodeURIComponent(email)}?fallback=false`,
    `https://unavatar.io/${encodeURIComponent(email)}?fallback=false`,
  ];
  const failed = idx >= sources.length;
  const cls = size === 'lg'
    ? 'w-full h-full object-cover'
    : 'w-full h-full object-cover';
  if (failed) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)',
          color: '#FAF8F3',
          fontFamily: "'Inter Tight', sans-serif",
          fontWeight: 600,
          fontSize: size === 'lg' ? '64px' : '14px',
          letterSpacing: '-0.02em',
        }}
      >
        {initialsOf(name)}
      </div>
    );
  }
  return (
    <img
      key={idx}
      src={sources[idx]}
      alt={name}
      loading="lazy"
      className={cls}
      onError={() => setIdx(i => i + 1)}
    />
  );
}

/* ---------------- Email template ---------------- */
const DEFAULT_SUBJECT = (_brand: string) => `Re: Video Editing Position. Follow-up`;
const DEFAULT_BODY = (vars: {
  first_name: string; previous_brand: string; new_brand: string;
  notion_task_url: string; submission_form_url: string;
}) => `Hi ${vars.first_name},

A while back you applied for our ${vars.previous_brand || 'previous'} video editor role and made our shortlist. Your trial work was really impressive, even though we ended up moving forward with someone else for that brand.

We've just opened a new role with ${vars.new_brand}, and I think your editing style would be a great fit based on your previous trial and portfolio. Rather than have you go through the application again, I'd like to invite you straight to the trial task for them.

You can find everything you need here: ${vars.notion_task_url}

The submission form can be found in the bottom of the document along with the rest of the resources.

No pressure if the timing doesn't work, but if it does, I'd love to see what you can put together. Don't hesitate to reach out if you have any questions.

Best,
Jonas`;

/* ---------------- Component ---------------- */
export function ShortlistedEditors() {
  const [apps, setApps] = useState<Application[]>([]);
  const [postings, setPostings] = useState<Posting[]>([]);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [open, setOpen] = useState(false);
  const [targetPostingId, setTargetPostingId] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  async function load() {
    setLoading(true);
    const [{ data: a }, { data: p }, { data: s }] = await Promise.all([
      (supabase.from('applications' as never) as any)
        .select('id,job_posting_id,first_name,last_name,email,software,stage,starred,portfolio_url')
        .eq('starred', true).order('created_at', { ascending: false }),
      (supabase.from('job_postings' as never) as any).select('*').order('created_at', { ascending: false }),
      (supabase.from('trial_submissions' as never) as any).select('*').order('created_at', { ascending: false }),
    ]);
    setApps((a as Application[]) ?? []);
    setPostings((p as Posting[]) ?? []);
    setSubs((s as Submission[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const postingById = useMemo(() => {
    const m = new Map<string, Posting>(); postings.forEach(p => m.set(p.id, p)); return m;
  }, [postings]);
  function subFor(app: Application) {
    return subs.find(s => s.application_id === app.id) ||
      subs.find(s => s.email.toLowerCase() === app.email.toLowerCase());
  }
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
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {apps.map(app => {
            const posting = app.job_posting_id ? postingById.get(app.job_posting_id) : null;
            const sub = subFor(app);
            const checked = selected.has(app.id);
            return (
              <article
                key={app.id}
                className="relative rounded-[6px] border overflow-hidden flex flex-col transition-colors"
                style={{
                  borderColor: checked ? '#1A1A1A' : '#E2E0D9',
                  backgroundColor: '#FAF8F3',
                  boxShadow: checked ? '0 0 0 1px #1A1A1A inset' : 'none',
                }}
              >
                {/* Square profile photo */}
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1 / 1', backgroundColor: '#1A1A1A' }}>
                  <ProfilePhoto email={app.email} name={`${app.first_name} ${app.last_name}`} />
                  {/* Open trial button overlay */}
                  {sub && (
                    <a
                      href={sub.submission_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="absolute bottom-2 right-2 z-20 inline-flex items-center gap-1 rounded-[3px] px-2.5 py-1.5 mono text-[10px] uppercase tracking-[0.15em] backdrop-blur transition-colors"
                      style={{ backgroundColor: 'rgba(26,26,26,0.78)', color: '#FAF8F3' }}
                      title="Open trial submission"
                    >
                      <Play className="w-3 h-3" /> View trial <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  )}
                  {/* Selection checkbox overlay */}
                  <label
                    className="absolute top-2 left-2 z-20 flex items-center gap-1.5 cursor-pointer rounded-[3px] px-2 py-1 backdrop-blur"
                    style={{ backgroundColor: 'rgba(26,26,26,0.7)' }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(app.id)}
                      className="accent-white w-3.5 h-3.5 rounded-[2px]"
                    />
                    <span className="mono text-[10px] uppercase tracking-[0.15em] text-white">
                      {checked ? 'Selected' : 'Select'}
                    </span>
                  </label>
                </div>

                {/* Candidate meta */}
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[16px] tracking-[-0.02em] text-[#1A1A1A] truncate" style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}>
                        {app.first_name} {app.last_name}
                      </p>
                      <p className="mono text-[10px] uppercase tracking-[0.15em] text-[#75726B] truncate">
                        {app.email}
                      </p>
                    </div>
                    <Star className="w-4 h-4 shrink-0 mt-1" style={{ color: '#1A1A1A', fill: '#9ED8F5' }} />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="mono text-[10px] uppercase tracking-[0.15em] text-[#75726B]">Applied for</span>
                    <span
                      className="inline-flex items-center rounded-[4px] px-2 py-0.5 mono text-[10px] uppercase tracking-[0.15em]"
                      style={{ background: 'linear-gradient(90deg, #BFE3F5 0%, #ECF7FD 100%)', color: '#1A4A6B' }}
                    >
                      {posting?.brand ?? '—'}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
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
