import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithCredentials } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight } from 'lucide-react';
import SEO from '@/components/SEO';

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
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden admin-bloom">
      <SEO
        title="Sign in — AdChefs"
        description="Sign in to your AdChefs dashboard."
        path="/login"
        noindex
      />
      {/* Soft blue gradient wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 10%, rgba(158,216,245,0.55) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 90% 90%, rgba(158,216,245,0.45) 0%, transparent 60%), linear-gradient(180deg, #ffffff 0%, #f4fbff 100%)',
        }}
      />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(26,26,26,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,26,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      <div className="relative w-full max-w-[420px]">
        {/* Card */}
        <div className="relative glass-card p-8">
          <div className="mb-7">
            <h1 className="font-display text-[28px] leading-tight text-foreground font-semibold tracking-tight">
              Welcome back.
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Sign in to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-username" className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground block mb-2">
                Username
              </label>
              <Input
                id="login-username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="yourname"
                autoComplete="username"
                className="h-11 bg-white border-foreground/15 rounded-[4px] focus-visible:ring-accent focus-visible:border-accent text-foreground placeholder:text-muted-foreground/60"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground block mb-2">
                Password
              </label>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="h-11 bg-white border-foreground/15 rounded-[4px] focus-visible:ring-accent focus-visible:border-accent text-foreground placeholder:text-muted-foreground/60"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="border-foreground/25 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground data-[state=checked]:text-background rounded-[3px]"
              />
              <label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer select-none">
                Keep me signed in
              </label>
            </div>

            <Button
              type="submit"
              variant="cta"
              disabled={loading || !username || !password}
              className="w-full h-11 rounded-[4px] mt-2 group"
            >
              {loading ? 'Signing in…' : 'Sign in'}
              {!loading && <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />}
            </Button>
          </form>
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-6 font-mono uppercase tracking-[0.15em]">
          Credentials issued by your account manager
        </p>
      </div>
    </div>
  );
}
