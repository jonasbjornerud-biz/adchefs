import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, Briefcase } from 'lucide-react';

interface Posting {
  id: string;
  slug: string;
  title: string;
  description: string;
  junior_pay: string | null;
  senior_pay: string | null;
}

export default function JobBoard() {
  const [postings, setPostings] = useState<Posting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('job_postings')
        .select('id, slug, title, description, junior_pay, senior_pay')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      setPostings((data as Posting[]) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">Careers</p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Join AdChefs</h1>
          <p className="text-muted-foreground mt-4 max-w-xl">
            We craft high-converting paid social video ads for top e-commerce brands. Pay-per-video, remote, no retainers.
          </p>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-muted-foreground">Loading open roles…</p>
        ) : postings.length === 0 ? (
          <p className="text-muted-foreground">No open roles right now. Check back soon.</p>
        ) : (
          <div className="space-y-3">
            {postings.map(p => (
              <Link
                key={p.id}
                to={`/jobs/${p.slug}`}
                className="group flex items-center gap-5 p-6 rounded-xl border border-border bg-card hover:border-foreground/30 transition-all"
              >
                <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {[p.junior_pay && `Junior ${p.junior_pay}`, p.senior_pay && `Senior ${p.senior_pay}`].filter(Boolean).join(' · ') || 'Remote · Pay-per-video'}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}