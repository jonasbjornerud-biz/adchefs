import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/playbook';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Trash2, RotateCcw, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePassword } from '@/lib/auth';

export default function ClientDetail() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, [clientId]);

  async function loadData() {
    if (!clientId) return;
    setLoading(true);
    const { data } = await supabase.from('clients').select('*').eq('id', clientId).single();
    setClient(data as Client | null);
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm('Delete this client and all their data? This cannot be undone.')) return;
    const { data, error } = await supabase.functions.invoke('manage-clients', {
      body: { action: 'delete_client', client_id: clientId },
    });
    if (error || data?.error) {
      toast({ title: 'Error', description: data?.error || error?.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Client deleted' });
    navigate('/admin');
  }

  async function resetPassword() {
    const newPassword = generatePassword();
    const { data, error } = await supabase.functions.invoke('manage-clients', {
      body: { action: 'reset_password', client_id: clientId, new_password: newPassword },
    });
    if (error || data?.error) {
      toast({ title: 'Error', description: data?.error || error?.message, variant: 'destructive' });
      return;
    }
    navigator.clipboard.writeText(`New password: ${newPassword}`);
    toast({ title: 'Password reset', description: `New password copied to clipboard: ${newPassword}` });
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#09090B' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-white/30">Loading…</span>
      </div>
    </div>
  );

  if (!client) return (
    <div className="min-h-screen flex items-center justify-center text-white/30" style={{ background: '#09090B' }}>
      Client not found
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: '#09090B' }}>
      {/* Dot grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      {/* Header */}
      <header className="relative z-10 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin')} className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-[11px] font-bold text-white shadow-lg shadow-violet-500/20">
                {client.brand_name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-white">{client.brand_name}</span>
              <span className="text-[10px] text-white/20">Admin View</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={resetPassword}
              className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] text-white/40 hover:text-white/70 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <RotateCcw className="w-3 h-3" /> Reset PW
            </button>
            <button onClick={handleDelete}
              className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] text-destructive/60 hover:text-destructive transition-colors"
              style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)' }}>
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Hero */}
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center text-xl font-bold text-violet-400 shrink-0">
            {client.brand_name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{client.brand_name}</h1>
            <span className="text-xs px-2 py-0.5 rounded-md text-white/40 border border-white/10" style={{ fontFamily: "'JetBrains Mono', monospace", background: 'rgba(255,255,255,0.04)' }}>
              @{client.username}
            </span>
          </div>
        </div>

        {/* Editor Performance card */}
        <div className="grid grid-cols-1 gap-5">
          <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-start justify-between mb-5">
              <div className="w-10 h-10 rounded-xl bg-secondary0/10 border border-violet-500/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-violet-400" />
              </div>
            </div>
            <h3 className="text-base font-semibold text-white mb-0.5">Editor Performance</h3>
            <p className="text-xs text-white/30 mb-5">Delivery tracking and output metrics</p>
            {client.spreadsheet_id ? (
              <div className="flex items-center gap-2 py-4 justify-center">
                <span className="text-xs text-accent/60">✓ Sheet connected</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-6">
                <Lock className="w-5 h-5 text-white/10" />
                <span className="text-xs text-white/20">Connect a Google Sheet to enable tracking</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
