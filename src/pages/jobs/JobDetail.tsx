import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';

const schema = z.object({
  first_name: z.string().trim().min(1).max(80),
  last_name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(255),
  software: z.string().min(1),
  availability: z.string().min(1),
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
    software: '', availability: '',
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
      availability: parsed.data.availability,
      portfolio_url: parsed.data.portfolio_url || null,
      years_experience: parsed.data.years_experience || null,
      additional_info: parsed.data.additional_info || null,
    });
    setSubmitting(false);
    if (error) { toast.error('Could not submit. Try again.'); return; }
    setSubmitted(true);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  if (!posting) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Role not found. <Link to="/jobs" className="ml-2 underline">Back to jobs</Link></div>;

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Thanks for applying.</h1>
          <p className="text-muted-foreground">We review every submission and respond within 48 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link to="/jobs" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> All roles
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">{posting.title}</h1>
        <p className="text-sm text-muted-foreground mt-2">
          {[posting.junior_pay && `Junior ${posting.junior_pay}`, posting.senior_pay && `Senior ${posting.senior_pay}`].filter(Boolean).join(' · ')}
        </p>
        {posting.description && <p className="mt-6 text-foreground/80 whitespace-pre-line">{posting.description}</p>}

        <form onSubmit={onSubmit} className="mt-10 space-y-5 border-t border-border pt-8">
          <h2 className="text-lg font-semibold">Apply</h2>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <Label>Availability *</Label>
              <Select value={form.availability} onValueChange={v => setForm({ ...form, availability: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASAP">ASAP</SelectItem>
                  <SelectItem value="Within 2 weeks">Within 2 weeks</SelectItem>
                  <SelectItem value="Within a month">Within a month</SelectItem>
                  <SelectItem value="Just exploring">Just exploring</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Submitting…' : 'Submit application'}
          </Button>
        </form>
      </div>
    </div>
  );
}