import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithCredentials } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { LogIn } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);

    try {
      await loginWithCredentials(username, password);

      if (rememberMe) {
        localStorage.setItem('adchefs_remember', 'true');
      } else {
        localStorage.removeItem('adchefs_remember');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Login failed');

      const { data: client } = await supabase
        .from('clients')
        .select('is_admin')
        .eq('user_id', user.id)
        .maybeSingle();

      if (client?.is_admin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast({ title: 'Login failed', description: 'Invalid username or password', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#09090B' }}>
      {/* Dot grid background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />
      {/* Radial glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.08) 0%, transparent 60%)',
      }} />

      <div className="relative w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">A</div>
            <span className="text-white/80 text-sm font-medium tracking-wide">AdChefs</span>
          </div>
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="text-sm text-white/40 mt-1">Sign in to your client portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-white/60 block mb-1.5">Username</label>
            <Input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              className="bg-white/[0.06] border-white/[0.08] text-white placeholder:text-white/20 focus:border-violet-500/50 focus:ring-violet-500/20 h-10"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-white/60 block mb-1.5">Password</label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="bg-white/[0.06] border-white/[0.08] text-white placeholder:text-white/20 focus:border-violet-500/50 focus:ring-violet-500/20 h-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
              className="border-white/20 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
            />
            <label htmlFor="remember" className="text-xs text-white/40 cursor-pointer select-none">
              Remember me
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full h-10 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 shadow-lg shadow-violet-500/20 transition-all duration-200"
          >
            <LogIn className="w-4 h-4 mr-2" />
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-[10px] text-white/20">
          Credentials provided by your account manager
        </p>
      </div>
    </div>
  );
}
