import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().trim().email().max(255),
  submission_url: z.string().trim().url().max(500),
  notes: z.string().max(2000).optional(),
});

export default function SubmitTask() {
  const [params] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', submission_url: '', notes: '' });

  useEffect(() => {
    const e = params.get('email');
    if (e) setForm(f => ({ ...f, email: e }));
  }, [params]);

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
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Submission received.</h1>
          <p className="text-muted-foreground">We'll review your task and get back to you shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-xl mx-auto px-6 py-12">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">ADCHEFS</p>
        <h1 className="text-3xl font-semibold tracking-tight">Skill Task Submission</h1>
        <p className="text-muted-foreground mt-2">Upload your finished trial task below.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
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
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Submitting…' : 'Submit task'}
          </Button>
        </form>
      </div>
    </div>
  );
}