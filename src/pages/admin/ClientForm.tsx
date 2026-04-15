import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { createClientAuth, generatePassword, brandToUsername } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ClientForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleCreate() {
    if (!brandName.trim()) return;
    setLoading(true);

    try {
      const username = brandToUsername(brandName);
      const password = generatePassword();

      // Create Supabase auth user
      const authData = await createClientAuth(username, password);
      if (!authData.user) throw new Error('Failed to create auth user');

      // Create client record
      const { error } = await supabase.from('clients').insert({
        user_id: authData.user.id,
        brand_name: brandName.trim(),
        username,
        is_admin: false,
      });

      if (error) throw error;

      // Get the new client ID
      const { data: newClient } = await supabase
        .from('clients')
        .select('id')
        .eq('username', username)
        .single();

      if (newClient) {
        // Create default 3 stages
        const stages = [
          { client_id: newClient.id, title: 'SOP Modules', stage_number: 1, sort_order: 1 },
          { client_id: newClient.id, title: 'Gear Up', stage_number: 2, sort_order: 2 },
          { client_id: newClient.id, title: 'Learn More', stage_number: 3, sort_order: 3 },
        ];
        await supabase.from('stages').insert(stages);
      }

      setCredentials({ username, password });
      toast({ title: 'Client created', description: `${brandName} is ready.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  const copyCredentials = () => {
    if (!credentials) return;
    navigator.clipboard.writeText(`Username: ${credentials.username}\nPassword: ${credentials.password}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-xl font-semibold text-foreground mb-6">New Client</h1>

        {!credentials ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Brand Name</label>
              <Input
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. BluComerce"
                className="max-w-md"
              />
              {brandName && (
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  Username: {brandToUsername(brandName)}
                </p>
              )}
            </div>
            <Button onClick={handleCreate} disabled={!brandName.trim() || loading} className="bg-sky-500 hover:bg-sky-600 text-white">
              {loading ? 'Creating...' : 'Create Client'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 p-5 space-y-3">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">✅ Client created successfully</p>
              <p className="text-xs text-muted-foreground">Save these credentials — the password won't be shown again.</p>
              <div className="bg-card rounded-lg border border-border p-4 font-mono text-sm space-y-1">
                <p><span className="text-muted-foreground">Username:</span> {credentials.username}</p>
                <p><span className="text-muted-foreground">Password:</span> {credentials.password}</p>
              </div>
              <Button variant="outline" size="sm" onClick={copyCredentials}>
                {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? 'Copied!' : 'Copy Credentials'}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/admin')}>Back to Dashboard</Button>
              <Button onClick={() => { setCredentials(null); setBrandName(''); }} className="bg-sky-500 hover:bg-sky-600 text-white">
                Create Another
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
