import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Zap, Trophy, Globe2 } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';

const schema = z.object({
  first_name: z.string().trim().min(1).max(80),
  last_name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(255),
  software: z.string().min(1),
  portfolio_url: z.string().trim().url().max(500).optional().or(z.literal('')),
  years_experience: z.string().max(50).optional(),
  additional_info: z.string().max(2000).optional(),
});

interface Posting {
  id: string;
  title: string;
  description: string;
  junior_pay: string | null;
  senior_pay: string | null;
}

export default function JobDetail() {
  const { slug } = useParams();
  const [posting, setPosting] = useState<Posting | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '',
    software: '',
    portfolio_url: '', years_experience: '', additional_info: '',
  });

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('job_postings')
        .select('id, title, description, junior_pay, senior_pay')
        .eq('slug', slug!)
        .eq('is_active', true)
        .maybeSingle();
      setPosting(data as Posting | null);
      setLoading(false);
    })();
  }, [slug]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Please check the form');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('applications').insert({
      job_posting_id: posting!.id,
      first_name: parsed.data.first_name,
      last_name: parsed.data.last_name,
      email: parsed.data.email,
      software: parsed.data.software,
      portfolio_url: parsed.data.portfolio_url || null,
      years_experience: parsed.data.years_experience || null,
      additional_info: parsed.data.additional_info || null,
    });
    setSubmitting(false);
    if (error) { toast.error('Could not submit. Try again.'); return; }
    setSubmitted(true);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground mono text-xs uppercase tracking-[0.15em]">Loading…</div>;
  if (!posting) return (
    <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
      Role not found. <Link to="/jobs" className="ml-2 underline">Back to jobs</Link>
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-foreground text-background flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[4px] bg-accent text-foreground mb-6">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <span className="eyebrow" style={{ borderColor: "hsl(var(--accent))", color: "hsl(var(--accent))" }}>
            Application received
          </span>
          <h1 className="mt-5 font-display text-[36px] md:text-[44px] leading-[1.05] tracking-[-0.02em]">
            You're <em style={{ color: "hsl(var(--accent))" }}>in</em> the pool.
          </h1>
          <p className="mt-4 text-[15px] text-background/70 leading-relaxed">
            Every application gets eyes. If your work fits, you'll hear from us within 48 hours with a paid trial task.
          </p>
        </div>
      </div>
    );
  }

  const perks = [
    { icon: Zap, title: "Per-video pay", body: "Get paid for what you ship. No hourly grind. The faster and sharper you are, the more you make." },
    { icon: Trophy, title: "Real DR work", body: "Edit ads that actually run on €5K+/mo brands. Hook rate, hold curve, ROAS — you'll see what wins." },
    { icon: Globe2, title: "Remote, async", body: "Work from anywhere. We care about cuts that convert, not green dots on Slack." },
    { icon: Sparkles, title: "Direct mentorship", body: "Notes from a founder with 7 years in DR video. Every project sharpens your craft." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="relative overflow-hidden bg-foreground text-background pt-24 pb-32">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(hsl(var(--accent)) 1px, transparent 1.5px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none" style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.25) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }} />

        <div className="relative max-w-[1100px] mx-auto px-6">
          <Link to="/jobs" className="inline-flex items-center mono text-[11px] uppercase tracking-[0.15em] text-background/60 hover:text-accent transition-colors mb-10">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> All roles
          </Link>

          <span className="eyebrow" style={{ borderColor: "hsl(var(--accent))", color: "hsl(var(--accent))", background: "transparent" }}>
            Now hiring · Remote · Async
          </span>

          <h1 className="mt-6 font-display text-[48px] sm:text-[68px] md:text-[84px] leading-[1.0] tracking-[-0.03em] max-w-4xl">
            {posting.title.split(' ').slice(0, -1).join(' ')}{' '}
            <em style={{ color: "hsl(var(--accent))" }}>{posting.title.split(' ').slice(-1)}</em>
          </h1>

          <p className="mt-7 text-[16px] sm:text-[18px] leading-relaxed text-background/70 max-w-xl">
            Cut ads that actually run. Get paid per video. Work with brands that obsess over hook rate, hold curve, and ROAS — not vibes.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-accent text-foreground hover:bg-accent/85 rounded-[4px]"
            >
              Apply now
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <div className="mono text-[11px] uppercase tracking-[0.15em] text-background/50 ml-2">
              Takes 2 minutes
            </div>
          </div>
        </div>
      </section>

      {/* PERKS */}
      <section className="bg-background border-y border-border">
        <div className="max-w-[1100px] mx-auto px-6 py-20">
          <div className="max-w-2xl mb-12">
            <span className="eyebrow">Why edit with AdChefs</span>
            <h2 className="mt-5 font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em]">
              Built for editors who want their work to <em>matter.</em>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-px bg-border border border-border rounded-[4px] overflow-hidden">
            {perks.map((p) => (
              <div key={p.title} className="bg-background p-8">
                <div className="w-9 h-9 rounded-[4px] bg-secondary flex items-center justify-center mb-5">
                  <p.icon className="w-4 h-4 text-foreground" />
                </div>
                <h3 className="font-display text-[18px] tracking-tight mb-2">{p.title}</h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATION */}
      <section id="apply" className="bg-secondary py-20">
        <div className="max-w-2xl mx-auto px-6">
          <span className="eyebrow">Apply in 2 minutes</span>
          <h2 className="mt-5 font-display text-[32px] md:text-[40px] leading-[1.05] tracking-[-0.02em]">
            Ready to <em>ship?</em>
          </h2>
          <p className="mt-3 text-[14px] text-muted-foreground">
            We review every submission. Strong fits get a paid trial task within 48 hours.
          </p>

          <form onSubmit={onSubmit} className="mt-10 space-y-5 bg-background border border-border rounded-[4px] p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First name *</Label>
              <Input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Last name *</Label>
              <Input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email *</Label>
            <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Editing software *</Label>
            <Select value={form.software} onValueChange={v => setForm({ ...form, software: v })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Premiere Pro">Premiere Pro</SelectItem>
                <SelectItem value="DaVinci Resolve">DaVinci Resolve</SelectItem>
                <SelectItem value="Final Cut Pro">Final Cut Pro</SelectItem>
                <SelectItem value="CapCut">CapCut</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Portfolio URL</Label>
            <Input type="url" placeholder="https://…" value={form.portfolio_url} onChange={e => setForm({ ...form, portfolio_url: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Years of experience</Label>
            <Input value={form.years_experience} onChange={e => setForm({ ...form, years_experience: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Anything else?</Label>
            <Textarea rows={4} value={form.additional_info} onChange={e => setForm({ ...form, additional_info: e.target.value })} />
          </div>
          <Button type="submit" disabled={submitting} variant="cta" size="lg" className="w-full">
            {submitting ? 'Submitting…' : 'Submit application'}
            {!submitting && <ArrowRight className="ml-1 h-4 w-4" />}
          </Button>
          </form>
        </div>
      </section>
    </div>
  );
}