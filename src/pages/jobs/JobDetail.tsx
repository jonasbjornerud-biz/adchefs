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
import SEO from '@/components/SEO';

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
  created_at?: string | null;
  expires_at?: string | null;
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
      const { data } = await (supabase as any).rpc('get_active_job_posting', { _slug: slug! });
      const row = Array.isArray(data) ? data[0] : data;
      setPosting((row as Posting) ?? null);
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
    const { error } = await supabase.from('applications').insert([{
      job_posting_id: posting!.id,
      first_name: parsed.data.first_name,
      last_name: parsed.data.last_name,
      email: parsed.data.email,
      software: parsed.data.software,
      availability: 'Not specified',
      portfolio_url: parsed.data.portfolio_url || null,
      years_experience: parsed.data.years_experience || null,
      additional_info: parsed.data.additional_info || null,
    }]);
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

  const parsePay = (s: string | null | undefined): number | null => {
    if (!s) return null;
    const m = s.replace(/[, ]/g, "").match(/(\d+(?:\.\d+)?)/);
    return m ? Number(m[1]) : null;
  };
  const minPay = parsePay(posting.junior_pay);
  const maxPay = parsePay(posting.senior_pay);
  const jobJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: posting.title,
    description: posting.description,
    datePosted: (posting.created_at ?? new Date().toISOString()).slice(0, 10),
    employmentType: "CONTRACTOR",
    hiringOrganization: {
      "@type": "Organization",
      name: "AdChefs",
      sameAs: "https://adchefs.com",
    },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: { "@type": "Country", name: "Anywhere" },
  };
  if (posting.expires_at) {
    jobJsonLd.validThrough = posting.expires_at;
  }
  if (minPay != null) {
    jobJsonLd.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: {
        "@type": "QuantitativeValue",
        minValue: minPay,
        maxValue: maxPay ?? minPay,
        unitText: "VIDEO",
      },
    };
  }

  const perks = [
    { icon: Zap, title: "Per-video pay", body: "Get paid for the videos you edit, not the hours spent. The faster and sharper you are, the more you make." },
    { icon: Trophy, title: "Real direct response work", body: "Edit ads that actually run for e-commerce brands, and get live feedback on the results." },
    { icon: Globe2, title: "Remote", body: "Work from anywhere. We care about cuts that convert, not where you work from." },
    { icon: Sparkles, title: "Direct mentorship", body: "Notes from a founder with 7 years in DR video. Every project sharpens your craft." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={`${posting.title} — Remote Role at AdChefs`}
        description={
          (posting.description || '').replace(/\s+/g, ' ').trim().slice(0, 155) ||
          `Apply for the ${posting.title} role at AdChefs. Remote, pay per delivered video, direct mentorship.`
        }
        path={`/jobs/${slug}`}
        jsonLd={jobJsonLd}
      />
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
          <div className="mb-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link to="/jobs" className="inline-flex items-center mono text-[11px] uppercase tracking-[0.15em] text-background/60 hover:text-accent transition-colors">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> All roles
            </Link>

            <span className="eyebrow inline-block" style={{ borderColor: "hsl(var(--accent))", color: "hsl(var(--accent))", background: "transparent" }}>
              Now hiring · Remote
            </span>
          </div>

          <h1 className="mt-6 font-display text-[48px] sm:text-[68px] md:text-[84px] leading-[1.0] tracking-[-0.03em] max-w-4xl">
            {posting.title.split(' ').slice(0, -1).join(' ')}{' '}
            <em style={{ color: "hsl(var(--accent))" }}>{posting.title.split(' ').slice(-1)}</em>
          </h1>

          <p className="mt-7 text-[16px] sm:text-[18px] leading-relaxed text-background/70 max-w-xl">
            Edit ads that drive sales. Get paid per video, and learn about the performance metrics.
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
      <section className="relative bg-background">
        <div className="relative max-w-[1100px] mx-auto px-6 py-24">
          <div className="max-w-2xl mb-14">
            <span className="inline-block mono text-[11px] uppercase tracking-[0.15em] text-[#3B86A8] border border-[#3B86A8] rounded-[4px] px-[14px] py-[8px]">
              Why edit with AdChefs
            </span>
            <h2 className="mt-5 text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-[#1A1A1A]" style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700 }}>
              Built for editors who want their work to <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400 }}>matter.</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-12">
            {perks.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="rounded-[4px]"
                  style={{ backgroundColor: '#EEEDE8', padding: '32px 28px' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="mono text-[11px] uppercase tracking-[0.12em] text-[#75726B]">
                      PERK {String(i + 1).padStart(2, '0')}
                    </span>
                    <Icon className="w-[18px] h-[18px] text-[#3B86A8]" strokeWidth={1.75} />
                  </div>
                  <div className="mt-3 mb-5 h-px" style={{ backgroundColor: '#E2E0D9' }} />
                  <h3 className="text-[22px] tracking-[-0.02em] text-[#1A1A1A] leading-tight" style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}>
                    {p.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-[1.55] text-[#75726B]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                    {p.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* APPLICATION */}
      <section id="apply" className="bg-secondary py-20">
        <div className="max-w-2xl mx-auto px-6">
          <span className="eyebrow">Apply in 2 minutes</span>
          <h2 className="mt-5 font-display text-[32px] md:text-[40px] leading-[1.05] tracking-[-0.02em]">
            Ready to <em>edit some winning ads?</em>
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