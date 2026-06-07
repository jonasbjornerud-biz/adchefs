import { useEffect, useState } from 'react';
import { useSearchParams, useParams, Link, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, CheckCircle2, Upload } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().trim().email().max(255),
  submission_url: z.string().trim().url().max(500),
  notes: z.string().max(2000).optional(),
});

export default function SubmitTask() {
  const [params] = useSearchParams();
  const { submitSlug } = useParams<{ submitSlug?: string }>();
  const location = useLocation();
  const slugFromPath = location.pathname.startsWith('/submit-task-')
    ? location.pathname.replace('/submit-task-', '').split('/')[0]
    : undefined;
  const activeSubmitSlug = submitSlug || slugFromPath;
  const [posting, setPosting] = useState<{ title: string; brand: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', submission_url: '', notes: '' });

  useEffect(() => {
    const e = params.get('email');
    if (e) setForm(f => ({ ...f, email: e }));
  }, [params]);

  useEffect(() => {
    if (!activeSubmitSlug) { setPosting(null); return; }
    (async () => {
      const { data } = await (supabase.from('job_postings' as never) as any)
        .select('title, brand')
        .eq('submit_slug', activeSubmitSlug)
        .maybeSingle();
      if (data) setPosting(data as any);
    })();
  }, [activeSubmitSlug]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? 'Check form'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('trial_submissions').insert({
      email: parsed.data.email,
      submission_url: parsed.data.submission_url,
      notes: parsed.data.notes || null,
    });
    setSubmitting(false);
    if (error) { toast.error('Could not submit. Try again.'); return; }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-foreground text-background flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[4px] bg-accent text-foreground mb-6">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <span className="eyebrow" style={{ borderColor: "hsl(var(--accent))", color: "hsl(var(--accent))" }}>
            Task received
          </span>
          <h1 className="mt-5 font-display text-[36px] md:text-[44px] leading-[1.05] tracking-[-0.02em]">
            Cut's <em style={{ color: "hsl(var(--accent))" }}>in</em>. We're watching.
          </h1>
          <p className="mt-4 text-[15px] text-background/70 leading-relaxed">
            We review every submission frame by frame. Expect notes — and a next step — within 48 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* SUBMISSION FORM */}
      <section className="bg-secondary py-20 min-h-screen">
        <div className="max-w-2xl mx-auto px-6">
          <span className="eyebrow">Upload in 60 seconds</span>
          <h2 className="mt-5 font-display text-[32px] md:text-[40px] leading-[1.05] tracking-[-0.02em]">
            Show us what you <em>edited.</em>
          </h2>
          <p className="mt-3 text-[14px] text-muted-foreground">
            Make sure your link is publicly viewable. Google Drive, WeTransfer, Frame.io all work.
          </p>

          <form onSubmit={onSubmit} className="mt-10 space-y-5 bg-background border border-border rounded-[4px] p-8">
          <div className="space-y-2">
            <Label>Email *</Label>
            <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Submission URL (Google Drive, WeTransfer, Frame.io…) *</Label>
            <Input type="url" placeholder="https://…" value={form.submission_url} onChange={e => setForm({ ...form, submission_url: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Textarea rows={4} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
          <Button type="submit" disabled={submitting} variant="cta" size="lg" className="w-full">
            {submitting ? 'Submitting…' : 'Submit task'}
            {!submitting && <ArrowRight className="ml-1 h-4 w-4" />}
          </Button>
          </form>
        </div>
      </section>
    </div>
  );
}