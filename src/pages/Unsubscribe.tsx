import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [state, setState] = useState<'loading' | 'valid' | 'invalid' | 'already' | 'success' | 'error'>('loading');
  const [working, setWorking] = useState(false);

  const seo = (
    <SEO title="Unsubscribe — AdChefs" description="Manage your AdChefs email preferences." path="/unsubscribe" noindex />
  );

  useEffect(() => {
    if (!token) { setState('invalid'); return; }
    (async () => {
      try {
        const res = await fetch(`${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`, {
          headers: { apikey: supabaseAnonKey },
        });
        const data = await res.json();
        if (data.valid) setState('valid');
        else if (data.reason === 'already_unsubscribed') setState('already');
        else setState('invalid');
      } catch {
        setState('error');
      }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setWorking(true);
    const { data, error } = await supabase.functions.invoke('handle-email-unsubscribe', { body: { token } });
    setWorking(false);
    if (error) setState('error');
    else if ((data as any)?.success) setState('success');
    else if ((data as any)?.reason === 'already_unsubscribed') setState('already');
    else setState('error');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      {seo}
      <div className="max-w-md w-full text-center space-y-4 border border-border rounded-2xl p-8 bg-card">
        <h1 className="text-2xl font-semibold text-foreground">Unsubscribe</h1>
        {state === 'loading' && <p className="text-muted-foreground">Verifying your link…</p>}
        {state === 'valid' && (
          <>
            <p className="text-muted-foreground">Click below to stop receiving emails from AdChefs.</p>
            <Button onClick={confirm} disabled={working}>{working ? 'Working…' : 'Confirm unsubscribe'}</Button>
          </>
        )}
        {state === 'success' && <p className="text-muted-foreground">You've been unsubscribed. We won't email you again.</p>}
        {state === 'already' && <p className="text-muted-foreground">This email is already unsubscribed.</p>}
        {state === 'invalid' && <p className="text-muted-foreground">This unsubscribe link is invalid or expired.</p>}
        {state === 'error' && <p className="text-destructive">Something went wrong. Please try again later.</p>}
      </div>
    </main>
  );
}