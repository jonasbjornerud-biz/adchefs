import { useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface AuthGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  // Bypass auth inside Lovable builder previews so admin routes can be inspected
  // so the editor can view/test admin & client routes without logging in every refresh.
  const isLovablePreview =
    typeof window !== 'undefined' &&
    (/^id-preview--/.test(window.location.hostname) ||
      window.location.hostname.endsWith('.lovableproject.com') ||
      window.location.search.includes('__lovable_token='));

  useEffect(() => {
    if (isLovablePreview) {
      setAuthorized(true);
      setLoading(false);
      return;
    }
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/login'); return; }

    if (requireAdmin) {
      const { data: client } = await supabase
        .from('clients')
        .select('is_admin')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!client?.is_admin) {
        navigate('/dashboard');
        return;
      }
    } else {
      // Editor route — admins are allowed through (they can preview any client).
      const { data: client } = await supabase
        .from('clients')
        .select('is_admin')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!client) {
        navigate('/login');
        return;
      }
      // Admins fall through to the editor page; the page itself handles ?clientId=.
    }

    setAuthorized(true);
    setLoading(false);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!authorized) return null;
  return <>{children}</>;
}
