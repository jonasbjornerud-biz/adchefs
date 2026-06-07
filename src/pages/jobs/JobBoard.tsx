import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowUpRight } from 'lucide-react';

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
      {/* HERO */}
      <section className="relative overflow-hidden bg-foreground text-background pt-24 pb-28">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(hsl(var(--accent)) 1px, transparent 1.5px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, hsl(var(--accent) / 0.25) 0%, transparent 65%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="relative max-w-[1100px] mx-auto px-6">
          <div className="mb-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <span className="mono text-[11px] uppercase tracking-[0.15em] text-background/60">
              Careers
            </span>
            <span
              className="eyebrow inline-block"
              style={{ borderColor: 'hsl(var(--accent))', color: 'hsl(var(--accent))', background: 'transparent' }}
            >
              Now hiring · Remote
            </span>
          </div>

          <h1 className="mt-6 font-display text-[48px] sm:text-[68px] md:text-[84px] leading-[1.0] tracking-[-0.03em] max-w-4xl">
            Edit ads that{' '}
            <em style={{ color: 'hsl(var(--accent))' }}>convert.</em>
          </h1>

          <p className="mt-7 text-[16px] sm:text-[18px] leading-relaxed text-background/70 max-w-xl">
            We craft high-converting paid social video ads for top e-commerce brands. Pay-per-video, remote, no retainers.
          </p>
        </div>
      </section>

      {/* ROLES */}
      <section className="relative bg-background">
        <div className="relative max-w-[1100px] mx-auto px-6 py-24">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <span className="inline-block mono text-[11px] uppercase tracking-[0.15em] text-[#3B86A8] border border-[#3B86A8] rounded-[4px] px-[14px] py-[8px]">
                Open roles
              </span>
              <h2
                className="mt-5 text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-[#1A1A1A]"
                style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700 }}
              >
                Find your{' '}
                <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400 }}>seat.</em>
              </h2>
            </div>
            {!loading && postings.length > 0 && (
              <span className="mono text-[11px] uppercase tracking-[0.15em] text-[#75726B] hidden sm:block">
                {String(postings.length).padStart(2, '0')} {postings.length === 1 ? 'role' : 'roles'}
              </span>
            )}
          </div>

          {loading ? (
            <p className="mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">Loading open roles…</p>
          ) : postings.length === 0 ? (
            <div className="rounded-[4px] px-8 py-14 text-center" style={{ backgroundColor: '#EEEDE8' }}>
              <p className="mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">
                No open roles right now. Check back soon.
              </p>
            </div>
          ) : (
            <ul className="border-t" style={{ borderColor: '#E2E0D9' }}>
              {postings.map((p, i) => (
                <li key={p.id} className="border-b" style={{ borderColor: '#E2E0D9' }}>
                  <Link
                    to={`/jobs/${p.slug}`}
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 sm:gap-10 py-7 sm:py-8 transition-colors hover:bg-[#EEEDE8] px-3 sm:px-5 -mx-3 sm:-mx-5 rounded-[4px]"
                  >
                    <span className="mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <h3
                        className="text-[22px] sm:text-[26px] tracking-[-0.02em] text-[#1A1A1A] leading-tight truncate"
                        style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}
                      >
                        {p.title}
                      </h3>
                      <p
                        className="mt-1.5 text-[14px] text-[#75726B]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {[p.junior_pay && `Junior ${p.junior_pay}`, p.senior_pay && `Senior ${p.senior_pay}`]
                          .filter(Boolean)
                          .join(' · ') || 'Remote · Pay-per-video'}
                      </p>
                    </div>
                    <span className="flex items-center gap-3">
                      <span className="mono text-[11px] uppercase tracking-[0.15em] text-[#3B86A8] hidden sm:inline">
                        View role
                      </span>
                      <span className="w-10 h-10 rounded-[4px] border border-[#E2E0D9] flex items-center justify-center text-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-background group-hover:border-[#1A1A1A] transition-colors">
                        <ArrowUpRight className="w-4 h-4" strokeWidth={1.75} />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}