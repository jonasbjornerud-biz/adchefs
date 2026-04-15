import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithCredentials } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { LogIn } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);

    try {
      await loginWithCredentials(username, password);

      // Check if admin
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Login failed');

      const { data: client } = await supabase
        .from('clients')
        .select('is_admin')
        .eq('user_id', user.id)
        .single();

      if (client?.is_admin) {
        navigate('/admin');
      } else {
        navigate('/playbook');
      }
    } catch (err: any) {
      toast({ title: 'Login failed', description: 'Invalid username or password', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">Playbook Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to access your training playbook</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Username</label>
            <Input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Password</label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" disabled={loading || !username || !password} className="w-full bg-sky-500 hover:bg-sky-600 text-white">
            <LogIn className="w-4 h-4 mr-2" />
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
