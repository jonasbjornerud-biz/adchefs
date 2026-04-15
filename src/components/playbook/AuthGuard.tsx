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

  useEffect(() => {
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
        .single();

      if (!client?.is_admin) {
        navigate('/playbook');
        return;
      }
    }

    setAuthorized(true);
    setLoading(false);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!authorized) return null;
  return <>{children}</>;
}
