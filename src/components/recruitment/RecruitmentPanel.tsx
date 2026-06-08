import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Mail, MailCheck, Clock, CheckCircle2, XCircle, Copy, ExternalLink, Send, Trash2, Pencil, Star, Play, X, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

type Posting = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  submit_slug: string;
  description: string;
  junior_pay: string | null;
  senior_pay: string | null;
  notion_task_url: string;
  trial_email_subject: string;
  trial_email_body: string;
  followup_email_subject: string;
  followup_email_body: string;
  is_active: boolean;
  created_at: string;
};

type Application = {
  id: string;
  job_posting_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  software: string;
  availability: string;
  portfolio_url: string | null;
  years_experience: string | null;
  additional_info: string | null;
  stage: string;
  qualifies: boolean;
  trial_email_scheduled_for: string | null;
  trial_email_sent_at: string | null;
  followup_sent_at: string | null;
  proceed: boolean | null;
  reviewed_at: string | null;
  created_at: string;
  starred?: boolean | null;
};

type Submission = {
  id: string;
  application_id: string | null;
  email: string;
  submission_url: string;
  notes: string | null;
  created_at: string;
};

const STAGES = ['new', 'qualified', 'trial_sent', 'trial_submitted', 'interview', 'hired', 'rejected'] as const;
const STAGE_LABEL: Record<string, string> = {
  new: 'New', qualified: 'Qualified', trial_sent: 'Trial sent',
  trial_submitted: 'Trial submitted', interview: 'Interview', hired: 'Hired', rejected: 'Rejected',
};

/** Editorial stage chip styles (inline so they survive Tailwind purge). */
const STAGE_CHIP: Record<string, React.CSSProperties> = {
  new:              { backgroundColor: '#EEEDE8', color: '#75726B', borderColor: '#E2E0D9' },
  qualified:        { backgroundColor: '#9ED8F5', color: '#1A1A1A', borderColor: '#9ED8F5' },
  trial_sent:       { backgroundColor: '#1A1A1A', color: '#FAF8F3', borderColor: '#1A1A1A' },
  trial_submitted:  { backgroundColor: '#9ED8F5', color: '#1A1A1A', borderColor: '#9ED8F5', fontWeight: 700 },
  interview:        { backgroundColor: '#1A1A1A', color: '#FAF8F3', borderColor: '#1A1A1A' },
  hired:            { backgroundColor: '#1A1A1A', color: '#FAF8F3', borderColor: '#1A1A1A' },
  rejected:         { backgroundColor: '#EEEDE8', color: '#75726B', borderColor: '#E2E0D9' },
};

function StageChip({ stage }: { stage: string }) {
  return (
    <span
      className="mono inline-flex items-center text-[10px] uppercase tracking-[0.15em] px-2 py-1 rounded-[4px] border"
      style={STAGE_CHIP[stage] ?? STAGE_CHIP.new}
    >
      {STAGE_LABEL[stage] ?? stage}
    </span>
  );
}

/* ---------------- Embed helpers ---------------- */
function hostOf(url: string) { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; } }
function faviconFor(url: string) {
  const h = hostOf(url);
  return h ? `https://www.google.com/s2/favicons?domain=${h}&sz=64` : '';
}
type Embed = { kind: 'iframe' | 'image' | 'link'; src?: string; thumb?: string; host: string };
function embedFor(url: string): Embed {
  const host = hostOf(url);
  // Loom
  let m = url.match(/loom\.com\/(?:share|embed)\/([a-f0-9-]+)/i);
  if (m) return { kind: 'iframe', src: `https://www.loom.com/embed/${m[1]}`, host };
  // YouTube
  m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (m) return { kind: 'iframe', src: `https://www.youtube.com/embed/${m[1]}`, thumb: `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`, host };
  // Vimeo
  m = url.match(/vimeo\.com\/(\d+)/);
  if (m) return { kind: 'iframe', src: `https://player.vimeo.com/video/${m[1]}`, host };
  // Google Drive file
  m = url.match(/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/);
  if (m) return { kind: 'iframe', src: `https://drive.google.com/file/d/${m[1]}/preview`, host };
  // Frame.io / others -> link with favicon
  return { kind: 'link', host };
}

function LinkFavicon({ url, size = 16 }: { url: string; size?: number }) {
  const src = faviconFor(url);
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className="rounded-[2px] shrink-0"
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
    />
  );
}

function EmbeddedSubmission({ url, compact = false }: { url: string; compact?: boolean }) {
  const e = embedFor(url);
  if (e.kind === 'iframe' && e.src) {
    return (
      <div className={`relative w-full overflow-hidden rounded-[4px] border ${compact ? '' : ''}`} style={{ borderColor: '#E2E0D9', backgroundColor: '#000', aspectRatio: '16 / 9' }}>
        <iframe
          src={e.src}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          loading="lazy"
        />
      </div>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-center gap-2 w-full rounded-[4px] border px-4 py-10"
      style={{ borderColor: '#E2E0D9', backgroundColor: '#EEEDE8' }}
    >
      <LinkFavicon url={url} size={20} />
      <span className="mono text-[11px] uppercase tracking-[0.15em] text-[#1A1A1A]">{e.host || 'Open submission'}</span>
      <ExternalLink className="w-3.5 h-3.5 text-[#75726B]" />
    </a>
  );
}

const emptyPosting = {
  slug: '', title: '', brand: '', submit_slug: '', description: '',
  junior_pay: '', senior_pay: '',
  notion_task_url: '',
  trial_email_subject: 'Your AdChefs trial task',
  trial_email_body: `Hi {{first_name}},

After reviewing your submission for the video editing role at {{brand}}, we were impressed with your portfolio and work examples, and would like to proceed with the hiring process.

The next step will involve a task of editing a short video for one of {{brand}}'s products, where you have full creative freedom.

All of the material for the task is here:

{{notion_task_url}}

When you're done, please submit your work here: {{submission_form_url}}

We look forward to reviewing your work before moving to the last stage, an interview, if we see potential. Best of luck!

Best,
Jonas`,
  followup_email_subject: 'Following up on your AdChefs trial task',
  followup_email_body: `Hi {{first_name}},

Just checking in — we sent you the trial task a few days ago and haven't seen a submission yet. If life got in the way, no worries, but we'd love to see what you can do.

Task: {{notion_task_url}}
Submit here: {{submission_form_url}}?email={{email}}

Let me know if you have any questions.

— AdChefs`,
  is_active: true,
};

export function RecruitmentPanel() {
  return (
    <Tabs defaultValue="pipeline" className="w-full">
      <TabsList className="rounded-[4px] bg-[#EEEDE8] border" style={{ borderColor: '#E2E0D9' }}>
        <TabsTrigger value="pipeline" className="rounded-[3px] mono text-[10px] uppercase tracking-[0.15em] data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-[#FAF8F3]">Pipeline</TabsTrigger>
        <TabsTrigger value="shortlist" className="rounded-[3px] mono text-[10px] uppercase tracking-[0.15em] data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-[#FAF8F3]">Shortlist</TabsTrigger>
        <TabsTrigger value="postings" className="rounded-[3px] mono text-[10px] uppercase tracking-[0.15em] data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-[#FAF8F3]">Job Postings</TabsTrigger>
      </TabsList>
      <TabsContent value="pipeline" className="mt-8"><Pipeline /></TabsContent>
      <TabsContent value="shortlist" className="mt-8"><Shortlist /></TabsContent>
      <TabsContent value="postings" className="mt-8"><Postings /></TabsContent>
    </Tabs>
  );
}

/* ============== POSTINGS ============== */
function Postings() {
  const [postings, setPostings] = useState<Posting[]>([]);
  const [editing, setEditing] = useState<Partial<Posting> | null>(null);
  const [open, setOpen] = useState(false);

  async function load() {
    const { data } = await (supabase.from('job_postings' as never) as any)
      .select('*').order('created_at', { ascending: false });
    setPostings((data as Posting[]) ?? []);
  }
  useEffect(() => { load(); }, []);

  function newOne() { setEditing({ ...emptyPosting }); setOpen(true); }
  function edit(p: Posting) { setEditing(p); setOpen(true); }

  async function save() {
    if (!editing?.title || !editing?.slug) { toast.error('Title and slug required'); return; }
    const payload: any = {
      slug: editing.slug, title: editing.title,
      brand: editing.brand ?? '',
      submit_slug: (editing.submit_slug || editing.slug || '').toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      description: editing.description ?? '',
      junior_pay: editing.junior_pay || null,
      senior_pay: editing.senior_pay || null,
      notion_task_url: editing.notion_task_url ?? '',
      trial_email_subject: editing.trial_email_subject ?? '',
      trial_email_body: editing.trial_email_body ?? '',
      followup_email_subject: editing.followup_email_subject ?? '',
      followup_email_body: editing.followup_email_body ?? '',
      is_active: editing.is_active ?? true,
    };
    const { error } = editing.id
      ? await (supabase.from('job_postings' as never) as any).update(payload).eq('id', editing.id)
      : await (supabase.from('job_postings' as never) as any).insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success('Saved'); setOpen(false); load();
  }

  async function toggleActive(p: Posting) {
    await (supabase.from('job_postings' as never) as any).update({ is_active: !p.is_active }).eq('id', p.id);
    load();
  }

  async function remove(p: Posting) {
    if (!confirm(`Delete posting "${p.title}"?`)) return;
    await (supabase.from('job_postings' as never) as any).delete().eq('id', p.id);
    load();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          <span className="inline-block mono text-[11px] uppercase tracking-[0.15em] text-[#3B86A8] border border-[#3B86A8] rounded-[4px] px-[14px] py-[8px]">
            Roles
          </span>
          <h2
            className="mt-5 text-[26px] md:text-[32px] leading-[1.05] tracking-[-0.02em] text-[#1A1A1A]"
            style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700 }}
          >
            Job{' '}
            <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400 }}>postings.</em>
          </h2>
          <p className="mt-2 mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">
            Roles with their own skill task & email copy
          </p>
        </div>
        <Button
          onClick={newOne}
          size="sm"
          className="bg-foreground hover:bg-foreground/90 text-background rounded-[4px]"
        >
          <Plus className="w-4 h-4 mr-1" /> New role
        </Button>
      </div>

      {postings.length === 0 ? (
        <div className="rounded-[4px] px-8 py-14 text-center" style={{ backgroundColor: '#EEEDE8' }}>
          <p className="mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">
            No roles yet. Create your first.
          </p>
        </div>
      ) : (
        <ul className="border-t" style={{ borderColor: '#E2E0D9' }}>
          {postings.map((p, i) => (
            <li key={p.id} className="border-b" style={{ borderColor: '#E2E0D9' }}>
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 py-5 px-3 sm:px-5 -mx-3 sm:-mx-5 rounded-[4px] hover:bg-[#EEEDE8] transition-colors">
                <span className="mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className="text-[20px] tracking-[-0.02em] text-[#1A1A1A] leading-tight truncate"
                      style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}
                    >
                      {p.title}
                    </p>
                    <span
                      className="mono text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-[3px]"
                      style={
                        p.is_active
                          ? { color: '#1A1A1A', backgroundColor: '#E2E0D9' }
                          : { color: '#75726B', backgroundColor: 'transparent', border: '1px solid #E2E0D9' }
                      }
                    >
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="mt-1 mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">
                    /jobs/{p.slug}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Switch checked={p.is_active} onCheckedChange={() => toggleActive(p)} />
                  <Button variant="ghost" size="icon" onClick={() => window.open(`/jobs/${p.slug}`, '_blank')}><ExternalLink className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => edit(p)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(p)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? 'Edit role' : 'New role'}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Title *</Label><Input value={editing.title ?? ''} onChange={e => setEditing({ ...editing, title: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Slug *</Label><Input value={editing.slug ?? ''} onChange={e => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Brand *</Label><Input value={editing.brand ?? ''} onChange={e => setEditing({ ...editing, brand: e.target.value })} placeholder="Rituel" /></div>
                <div className="space-y-1.5">
                  <Label>Submit URL slug *</Label>
                  <Input
                    value={editing.submit_slug ?? ''}
                    onChange={e => setEditing({ ...editing, submit_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    placeholder="rituel"
                  />
                  <p className="text-xs text-muted-foreground">Public URL: /submit-task-{editing.submit_slug || '…'}</p>
                </div>
              </div>
              <div className="space-y-1.5"><Label>Description</Label><Textarea rows={3} value={editing.description ?? ''} onChange={e => setEditing({ ...editing, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Junior pay</Label><Input value={editing.junior_pay ?? ''} onChange={e => setEditing({ ...editing, junior_pay: e.target.value })} placeholder="€30–60 per ad" /></div>
                <div className="space-y-1.5"><Label>Senior pay</Label><Input value={editing.senior_pay ?? ''} onChange={e => setEditing({ ...editing, senior_pay: e.target.value })} placeholder="€80–150 per ad" /></div>
              </div>
              <div className="space-y-1.5"><Label>Skill task URL (Notion)</Label><Input value={editing.notion_task_url ?? ''} onChange={e => setEditing({ ...editing, notion_task_url: e.target.value })} placeholder="https://notion.so/…" /></div>
              <div className="space-y-1.5"><Label>Trial email subject</Label><Input value={editing.trial_email_subject ?? ''} onChange={e => setEditing({ ...editing, trial_email_subject: e.target.value })} /></div>
              <div className="space-y-1.5">
                <Label>Trial email body</Label>
                <p className="text-xs text-muted-foreground">Available variables: <code>{'{{first_name}}'}</code>, <code>{'{{email}}'}</code>, <code>{'{{brand}}'}</code>, <code>{'{{notion_task_url}}'}</code>, <code>{'{{submission_form_url}}'}</code></p>
                <Textarea rows={10} className="font-mono text-xs" value={editing.trial_email_body ?? ''} onChange={e => setEditing({ ...editing, trial_email_body: e.target.value })} />
              </div>
              <div className="space-y-1.5 border-t border-border pt-4"><Label>Follow-up email subject</Label><Input value={editing.followup_email_subject ?? ''} onChange={e => setEditing({ ...editing, followup_email_subject: e.target.value })} /></div>
              <div className="space-y-1.5">
                <Label>Follow-up email body</Label>
                <p className="text-xs text-muted-foreground">Sent manually when an applicant hasn't submitted the trial. Same variables available.</p>
                <Textarea rows={8} className="font-mono text-xs" value={editing.followup_email_body ?? ''} onChange={e => setEditing({ ...editing, followup_email_body: e.target.value })} />
              </div>
              <div className="flex items-center gap-2"><Switch checked={editing.is_active ?? true} onCheckedChange={v => setEditing({ ...editing, is_active: v })} /><Label>Active (public)</Label></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ============== PIPELINE ============== */
function Pipeline() {
  const [apps, setApps] = useState<Application[]>([]);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [postings, setPostings] = useState<Posting[]>([]);
  const [selected, setSelected] = useState<Application | null>(null);
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [postingFilter, setPostingFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [config, setConfig] = useState<{ submission_form_url: string }>({ submission_form_url: '' });

  async function load() {
    const [{ data: a }, { data: s }, { data: p }, { data: c }] = await Promise.all([
      (supabase.from('applications' as never) as any).select('*').order('created_at', { ascending: false }),
      (supabase.from('trial_submissions' as never) as any).select('*').order('created_at', { ascending: false }),
      (supabase.from('job_postings' as never) as any).select('*'),
      (supabase.from('app_config' as never) as any).select('*').eq('id', 1).maybeSingle(),
    ]);
    setApps((a as Application[]) ?? []);
    setSubs((s as Submission[]) ?? []);
    setPostings((p as Posting[]) ?? []);
    if (c) setConfig(c as any);
  }
  useEffect(() => { load(); }, []);

  const scopedApps = postingFilter === 'all'
    ? apps
    : apps.filter(a => a.job_posting_id === postingFilter);

  const counts = STAGES.reduce<Record<string, number>>((acc, st) => {
    acc[st] = scopedApps.filter(a => a.stage === st).length; return acc;
  }, {});

  const filtered = scopedApps.filter(a => {
    if (stageFilter !== 'all' && a.stage !== stageFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!`${a.first_name} ${a.last_name} ${a.email}`.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  async function updateApp(id: string, patch: Partial<Application>) {
    const { error } = await (supabase.from('applications' as never) as any).update(patch).eq('id', id);
    if (error) { toast.error(error.message); return; }
    load();
    if (selected?.id === id) setSelected({ ...selected, ...patch } as Application);
  }

  async function deleteApp(app: Application) {
    if (!confirm(`Delete applicant ${app.first_name} ${app.last_name}? This also removes related trial submissions.`)) return;
    // Remove dependent rows first to avoid FK issues
    await (supabase.from('trial_submissions' as never) as any).delete().eq('application_id', app.id);
    const { error } = await (supabase.from('applications' as never) as any).delete().eq('id', app.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Applicant deleted');
    if (selected?.id === app.id) setSelected(null);
    load();
  }

  function postingFor(app: Application) { return postings.find(p => p.id === app.job_posting_id); }
  function subFor(app: Application) {
    return subs.find(s => s.application_id === app.id) ||
      subs.find(s => s.email.toLowerCase() === app.email.toLowerCase());
  }

  function renderTemplate(app: Application, kind: 'trial' | 'followup') {
    const p = postingFor(app);
    if (!p) return { subject: '', body: '' };
    const base = config.submission_form_url || `${window.location.origin}/submit-task`;
    const sub = p.submit_slug
      ? `${base}-${p.submit_slug}?email=${encodeURIComponent(app.email)}`
      : `${base}?email=${encodeURIComponent(app.email)}`;
    const subject = kind === 'trial' ? p.trial_email_subject : p.followup_email_subject;
    const raw = kind === 'trial' ? p.trial_email_body : p.followup_email_body;
    const body = (raw ?? '')
      .replace(/\{\{first_name\}\}/g, app.first_name)
      .replace(/\{\{email\}\}/g, app.email)
      .replace(/\{\{brand\}\}/g, p.brand || '')
      .replace(/\{\{notion_task_url\}\}/g, p.notion_task_url)
      .replace(/\{\{submission_form_url\}\}/g, sub);
    return { subject: subject ?? '', body };
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="inline-block mono text-[10px] uppercase tracking-[0.15em] text-[#1A1A1A] border border-[#1A1A1A] rounded-[4px] px-[14px] py-[8px]">
          PIPELINE
        </span>
        <h2
          className="mt-5 text-[26px] md:text-[32px] leading-[1.05] tracking-[-0.02em] text-[#1A1A1A]"
          style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}
        >
          Editor{' '}
          <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400 }}>applicants.</em>
        </h2>
      </div>

      {/* Stage counters */}
      <div className="rounded-[4px] border p-1.5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-1" style={{ borderColor: '#E2E0D9', backgroundColor: '#FAF8F3' }}>
        {([['all', 'All', apps.length] as const, ...STAGES.map(st => [st, STAGE_LABEL[st], counts[st]] as const)]).map(([key, label, count]) => {
          const active = stageFilter === key;
          return (
            <button
              key={key}
              onClick={() => setStageFilter(key)}
              className="group relative px-5 py-3 rounded-[4px] text-left transition-all duration-150"
              style={{
                backgroundColor: active ? '#1A1A1A' : 'transparent',
                color: active ? '#FAF8F3' : '#1A1A1A',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#EEEDE8'; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
            >
              <p className="mono text-[10px] uppercase tracking-[0.15em]" style={{ color: active ? 'rgba(250,248,243,0.65)' : '#75726B' }}>
                {label}
              </p>
              <p
                className="mt-1 text-[1.75rem] leading-none tracking-[-0.02em]"
                style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}
              >
                {String(count).padStart(2, '0')}
              </p>
              {active && (
                <span className="absolute left-3 right-3 -bottom-px h-[2px]" style={{ backgroundColor: '#9ED8F5' }} />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <Input placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs rounded-[4px]" />
        <Select value={postingFilter} onValueChange={setPostingFilter}>
          <SelectTrigger className="w-56 rounded-[4px]"><SelectValue placeholder="All roles" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {postings.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-[4px] border overflow-hidden" style={{ borderColor: '#E2E0D9', backgroundColor: '#FAF8F3' }}>
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#EEEDE8' }}>
            <tr className="mono text-[10px] uppercase tracking-[0.15em] text-[#75726B]">
              <th className="text-left p-3 font-normal w-8"></th>
              <th className="text-left p-3 font-normal">Applicant</th>
              <th className="text-left p-3 font-normal">Role</th>
              <th className="text-left p-3 font-normal">Software</th>
              <th className="text-left p-3 font-normal">Stage</th>
              <th className="text-left p-3 font-normal">Email</th>
              <th className="text-left p-3 font-normal">Task</th>
              <th className="text-left p-3 font-normal">Applied</th>
              <th className="text-left p-3 font-normal w-8"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="p-10 text-center mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">No applicants {stageFilter !== 'all' ? `in "${STAGE_LABEL[stageFilter]}"` : 'yet'}.</td></tr>
            )}
            {filtered.map(app => {
              const sub = subFor(app);
              const posting = postingFor(app);
              return (
                <tr key={app.id} className="border-b cursor-pointer transition-colors hover:bg-[#EEEDE8] group min-h-[56px]" style={{ borderColor: '#EEEDE8' }} onClick={() => setSelected(app)}>
                  <td className="p-3 align-middle" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => updateApp(app.id, { starred: !app.starred } as any)}
                      className="p-1 rounded-[3px] transition-colors hover:bg-[#E2E0D9]"
                      aria-label={app.starred ? 'Unstar' : 'Shortlist'}
                      title={app.starred ? 'Remove from shortlist' : 'Add to shortlist'}
                    >
                      <Star
                        className="w-4 h-4"
                        style={{ color: app.starred ? '#1A1A1A' : '#C8C5BC', fill: app.starred ? '#9ED8F5' : 'transparent' }}
                      />
                    </button>
                  </td>
                  <td className="p-3">
                    <p className="text-[15px] text-[#1A1A1A]" style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}>{app.first_name} {app.last_name}</p>
                    <p className="mono text-[11px] uppercase tracking-[0.12em] text-[#75726B] mt-0.5">{app.email}</p>
                  </td>
                   <td className="p-3 text-[#75726B]">{posting?.title ?? '—'}</td>
                  <td className="p-3">
                    {['Premiere Pro','CapCut'].includes(app.software) ? (
                      <span className="inline-flex items-center rounded-[4px] bg-[#1A1A1A] text-[#FAF8F3] px-2 py-1 mono text-[10px] uppercase tracking-[0.15em]">
                        {app.software}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-[4px] bg-[#EEEDE8] text-[#75726B] px-2 py-1 mono text-[10px] uppercase tracking-[0.15em]">
                        {app.software}
                      </span>
                    )}
                  </td>
                  <td className="p-3"><StageChip stage={app.stage} /></td>
                  <td className="p-3"><EmailStatus app={app} /></td>
                  <td className="p-3">
                    {sub ? (
                      <a
                        href={sub.submission_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="text-[13px] text-[#75726B] hover:underline transition-colors"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                        title={sub.submission_url}
                      >
                        {hostOf(sub.submission_url) || 'View'}
                      </a>
                    ) : <span className="mono text-[11px] text-[#75726B]">--</span>}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}</td>
                  <td className="p-3 align-middle" onClick={e => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteApp(app)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                      title="Delete applicant"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      <Sheet open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (() => {
            const sub = subFor(selected);
            const posting = postingFor(selected);
            const trial = renderTemplate(selected, 'trial');
            const followup = renderTemplate(selected, 'followup');
            const mailto = (s: string, b: string) =>
              `mailto:${selected.email}?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(b)}`;
            const showFollowup =
              !!posting && !!selected.trial_email_sent_at && !sub;
            return (
              <>
                <SheetHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <SheetTitle className="tracking-[-0.02em]" style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700 }}>
                        {selected.first_name} {selected.last_name}
                      </SheetTitle>
                      <p className="mt-1 mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">{selected.email}</p>
                      <div className="mt-3"><StageChip stage={selected.stage} /></div>
                    </div>
                    <button
                      onClick={() => updateApp(selected.id, { starred: !selected.starred } as any)}
                      className="p-2 rounded-[3px] border hover:bg-[#EEEDE8] transition-colors"
                      style={{ borderColor: '#E2E0D9' }}
                      title={selected.starred ? 'Remove from shortlist' : 'Add to shortlist'}
                    >
                      <Star className="w-4 h-4" style={{ color: '#1A1A1A', fill: selected.starred ? '#9ED8F5' : 'transparent' }} />
                    </button>
                  </div>
                </SheetHeader>
                <div className="mt-6 space-y-5">
                  <Field label="Role" value={posting?.title ?? '—'} />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Software" value={selected.software} />
                    <Field label="Availability" value={selected.availability} />
                  </div>
                  {selected.portfolio_url && <Field label="Portfolio"><a href={selected.portfolio_url} target="_blank" rel="noreferrer" className="text-primary underline break-all">{selected.portfolio_url}</a></Field>}
                  {selected.years_experience && <Field label="Experience" value={selected.years_experience} />}
                  {selected.additional_info && <Field label="Notes"><p className="text-sm whitespace-pre-wrap">{selected.additional_info}</p></Field>}

                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Label className="text-xs">Stage</Label>
                      <Select value={selected.stage} onValueChange={v => updateApp(selected.id, { stage: v })}>
                        <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STAGES.map(s => <SelectItem key={s} value={s}>{STAGE_LABEL[s]}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <EmailStatus app={selected} verbose />
                  </div>

                  {posting && (
                    <div className="border-t border-border pt-4 space-y-2">
                      <Label className="text-xs">Trial email</Label>
                      <div className="p-3 rounded-lg bg-muted/40 text-xs">
                        <p className="font-semibold mb-1">Subject: {trial.subject}</p>
                        <pre className="whitespace-pre-wrap font-sans text-foreground/80">{trial.body}</pre>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(trial.body); toast.success('Copied'); }}><Copy className="w-3.5 h-3.5 mr-1" /> Copy</Button>
                        <Button size="sm" asChild><a href={mailto(trial.subject, trial.body)}><Send className="w-3.5 h-3.5 mr-1" /> Open in mail app</a></Button>
                        {!selected.trial_email_sent_at && (
                          <Button size="sm" variant="secondary" onClick={() => updateApp(selected.id, { trial_email_sent_at: new Date().toISOString(), stage: 'trial_sent' })}>
                            <MailCheck className="w-3.5 h-3.5 mr-1" /> Mark sent
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {showFollowup && (
                    <div className="border-t border-border pt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Follow-up email</Label>
                        {selected.followup_sent_at ? (
                          <span className="text-xs text-foreground dark:text-accent inline-flex items-center gap-1">
                            <MailCheck className="w-3.5 h-3.5" /> Sent {formatDistanceToNow(new Date(selected.followup_sent_at), { addSuffix: true })}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Trial sent {formatDistanceToNow(new Date(selected.trial_email_sent_at!), { addSuffix: true })}, no submission
                          </span>
                        )}
                      </div>
                      <div className="p-3 rounded-lg bg-muted/40 text-xs">
                        <p className="font-semibold mb-1">Subject: {followup.subject}</p>
                        <pre className="whitespace-pre-wrap font-sans text-foreground/80">{followup.body}</pre>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(followup.body); toast.success('Copied'); }}><Copy className="w-3.5 h-3.5 mr-1" /> Copy</Button>
                        <Button size="sm" asChild><a href={mailto(followup.subject, followup.body)}><Send className="w-3.5 h-3.5 mr-1" /> Open in mail app</a></Button>
                        <Button size="sm" variant="secondary" onClick={() => updateApp(selected.id, { followup_sent_at: new Date().toISOString() })}>
                          <MailCheck className="w-3.5 h-3.5 mr-1" /> Mark follow-up sent
                        </Button>
                      </div>
                    </div>
                  )}

                  {sub && (
                    <div className="border-t border-border pt-4 space-y-2">
                      <Label className="text-xs">Trial submission</Label>
                      <EmbeddedSubmission url={sub.submission_url} />
                      <a
                        href={sub.submission_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 mono text-[10px] uppercase tracking-[0.15em] text-[#75726B] hover:text-[#1A1A1A] transition-colors"
                      >
                        <LinkFavicon url={sub.submission_url} /> Open on {hostOf(sub.submission_url) || 'source'} <ExternalLink className="w-3 h-3" />
                      </a>
                      {sub.notes && <p className="text-xs text-muted-foreground whitespace-pre-wrap">{sub.notes}</p>}
                      <div className="flex gap-2 pt-1">
                        <Button size="sm" variant={selected.proceed === true ? 'default' : 'outline'} onClick={() => updateApp(selected.id, { proceed: true, reviewed_at: new Date().toISOString() })}>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Proceed
                        </Button>
                        <Button size="sm" variant={selected.proceed === false ? 'destructive' : 'outline'} onClick={() => updateApp(selected.id, { proceed: false, reviewed_at: new Date().toISOString(), stage: 'rejected' })}>
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-8 pt-4 border-t border-border flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteApp(selected)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete applicant
                  </Button>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Field({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      {children ?? <p className="text-sm">{value}</p>}
    </div>
  );
}

function EmailStatus({ app, verbose }: { app: Application; verbose?: boolean }) {
  if (app.trial_email_sent_at) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-foreground dark:text-accent">
        <MailCheck className="w-3.5 h-3.5" />
        {verbose ? `Sent ${formatDistanceToNow(new Date(app.trial_email_sent_at), { addSuffix: true })}` : 'Sent'}
      </span>
    );
  }
  if (app.trial_email_scheduled_for) {
    const due = new Date(app.trial_email_scheduled_for);
    const future = due.getTime() > Date.now();
    return (
      <span className={`inline-flex items-center gap-1 text-xs ${future ? 'text-foreground dark:text-foreground' : 'text-destructive'}`}>
        <Clock className="w-3.5 h-3.5" />
        {verbose ? `${future ? 'Scheduled' : 'Overdue'} ${formatDistanceToNow(due, { addSuffix: true })}` : (future ? 'Scheduled' : 'Overdue')}
      </span>
    );
  }
  return <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Mail className="w-3.5 h-3.5" /> Not queued</span>;
}

/* ============== SHORTLIST ============== */
function Shortlist() {
  const [apps, setApps] = useState<Application[]>([]);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [postings, setPostings] = useState<Posting[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  async function load() {
    const [{ data: a }, { data: s }, { data: p }] = await Promise.all([
      (supabase.from('applications' as never) as any).select('*').eq('starred', true).order('created_at', { ascending: false }),
      (supabase.from('trial_submissions' as never) as any).select('*').order('created_at', { ascending: false }),
      (supabase.from('job_postings' as never) as any).select('*'),
    ]);
    setApps((a as Application[]) ?? []);
    setSubs((s as Submission[]) ?? []);
    setPostings((p as Posting[]) ?? []);
  }
  useEffect(() => { load(); }, []);

  async function updateApp(id: string, patch: Partial<Application>) {
    const { error } = await (supabase.from('applications' as never) as any).update(patch).eq('id', id);
    if (error) { toast.error(error.message); return; }
    load();
  }

  function subFor(app: Application) {
    return subs.find(s => s.application_id === app.id) ||
      subs.find(s => s.email.toLowerCase() === app.email.toLowerCase());
  }
  function postingFor(app: Application) { return postings.find(p => p.id === app.job_posting_id); }

  function toggleCompare(id: string) {
    setCompare(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 4) { toast.error('Compare up to 4 at once'); return prev; }
      return [...prev, id];
    });
  }

  const compareApps = apps.filter(a => compare.includes(a.id));

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
            Hand-picked{' '}
            <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400 }}>candidates.</em>
          </h2>
          <p className="mt-2 mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">
            {apps.length} starred · select 2–4 to compare
          </p>
        </div>
        <Button
          size="sm"
          disabled={compare.length < 2}
          onClick={() => setCompareOpen(true)}
          className="bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-[#FAF8F3] rounded-[4px] disabled:opacity-40"
        >
          Compare {compare.length > 0 ? `(${compare.length})` : ''}
        </Button>
      </div>

      {apps.length === 0 ? (
        <div className="rounded-[4px] px-8 py-16 text-center" style={{ backgroundColor: '#EEEDE8' }}>
          <Star className="w-5 h-5 mx-auto mb-3" style={{ color: '#75726B' }} />
          <p className="mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">
            No shortlisted candidates yet. Tap the star on any applicant in the pipeline.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {apps.map(app => {
            const sub = subFor(app);
            const posting = postingFor(app);
            const checked = compare.includes(app.id);
            return (
              <article
                key={app.id}
                className="relative rounded-[4px] border overflow-hidden flex flex-col"
                style={{ borderColor: checked ? '#1A1A1A' : '#E2E0D9', backgroundColor: '#FAF8F3' }}
              >
                {sub ? (
                  <EmbeddedSubmission url={sub.submission_url} />
                ) : (
                  <div className="aspect-video flex items-center justify-center" style={{ backgroundColor: '#EEEDE8' }}>
                    <span className="mono text-[10px] uppercase tracking-[0.15em] text-[#75726B]">No submission yet</span>
                  </div>
                )}
                <div className="p-4 space-y-3 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[18px] tracking-[-0.02em] truncate" style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600, color: '#1A1A1A' }}>
                        {app.first_name} {app.last_name}
                      </p>
                      <p className="mono text-[10px] uppercase tracking-[0.15em] text-[#75726B] truncate">
                        {posting?.title ?? 'No role'} · {app.software}
                      </p>
                    </div>
                    <button
                      onClick={() => updateApp(app.id, { starred: false } as any)}
                      className="p-1 rounded-[3px] hover:bg-[#EEEDE8] transition-colors"
                      title="Remove from shortlist"
                    >
                      <Star className="w-4 h-4" style={{ color: '#1A1A1A', fill: '#9ED8F5' }} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <StageChip stage={app.stage} />
                    {app.proceed === true && (
                      <span className="mono inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] px-2 py-1 rounded-[4px]" style={{ backgroundColor: '#9ED8F5', color: '#1A1A1A' }}>
                        <CheckCircle2 className="w-3 h-3" /> Reviewed
                      </span>
                    )}
                  </div>

                  {app.additional_info && (
                    <p className="text-[13px] leading-[1.5] text-[#1A1A1A]/80 line-clamp-3 whitespace-pre-wrap">{app.additional_info}</p>
                  )}

                  <div className="mt-auto pt-3 border-t flex items-center justify-between gap-2" style={{ borderColor: '#E2E0D9' }}>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCompare(app.id)}
                        className="accent-[#1A1A1A] w-3.5 h-3.5 rounded-[2px]"
                      />
                      <span className="mono text-[10px] uppercase tracking-[0.15em] text-[#75726B]">Compare</span>
                    </label>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-[3px] h-7 px-2 mono text-[10px] uppercase tracking-[0.15em]"
                        onClick={() => updateApp(app.id, { stage: 'interview' })}
                        disabled={app.stage === 'interview' || app.stage === 'hired'}
                      >
                        Interview
                      </Button>
                      <Button
                        size="sm"
                        className="rounded-[3px] h-7 px-2 mono text-[10px] uppercase tracking-[0.15em] bg-[#1A1A1A] text-[#9ED8F5] hover:bg-[#1A1A1A]/90"
                        onClick={() => updateApp(app.id, { stage: 'hired' })}
                        disabled={app.stage === 'hired'}
                      >
                        Hire <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Compare modal */}
      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent className="max-w-[95vw] w-[95vw] max-h-[92vh] overflow-y-auto rounded-[4px]">
          <DialogHeader>
            <DialogTitle className="tracking-[-0.02em]" style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700 }}>
              Side-by-side <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400 }}>review</em>
            </DialogTitle>
          </DialogHeader>
          <div
            className="grid gap-4 mt-2"
            style={{ gridTemplateColumns: `repeat(${Math.min(Math.max(compareApps.length, 1), 4)}, minmax(0, 1fr))` }}
          >
            {compareApps.map(app => {
              const sub = subFor(app);
              const posting = postingFor(app);
              return (
                <div key={app.id} className="rounded-[4px] border overflow-hidden flex flex-col" style={{ borderColor: '#E2E0D9' }}>
                  {sub ? <EmbeddedSubmission url={sub.submission_url} /> : (
                    <div className="aspect-video flex items-center justify-center" style={{ backgroundColor: '#EEEDE8' }}>
                      <span className="mono text-[10px] uppercase tracking-[0.15em] text-[#75726B]">No submission</span>
                    </div>
                  )}
                  <div className="p-3 space-y-2">
                    <p className="text-[15px] tracking-[-0.02em] truncate" style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}>
                      {app.first_name} {app.last_name}
                    </p>
                    <p className="mono text-[10px] uppercase tracking-[0.15em] text-[#75726B] truncate">
                      {posting?.title ?? '—'} · {app.software}
                    </p>
                    <StageChip stage={app.stage} />
                    <div className="flex gap-1 pt-1">
                      <Button size="sm" variant="outline" className="rounded-[3px] h-7 px-2 mono text-[10px] uppercase tracking-[0.15em] flex-1" onClick={() => updateApp(app.id, { stage: 'interview' })}>
                        Interview
                      </Button>
                      <Button size="sm" className="rounded-[3px] h-7 px-2 mono text-[10px] uppercase tracking-[0.15em] flex-1 bg-[#1A1A1A] text-[#9ED8F5] hover:bg-[#1A1A1A]/90" onClick={() => updateApp(app.id, { stage: 'hired' })}>
                        Hire
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}