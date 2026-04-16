import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/playbook';
import { Button } from '@/components/ui/button';
import { Plus, Users, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';
import { logout } from '@/lib/auth';

interface ClientWithStatus extends Client {
  hasSheet: boolean;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    setLoading(true);
    const { data: clientsData } = await supabase
      .from('clients')
      .select('*')
      .eq('is_admin', false)
      .order('created_at', { ascending: false });

    const enriched: ClientWithStatus[] = (clientsData || []).map((c: Client) => ({
      ...c,
      hasSheet: !!c.spreadsheet_id,
    }));

    setClients(enriched);
    setLoading(false);
  }

  const totalClients = clients.length;
  const connectedSheets = clients.filter(c => c.hasSheet).length;
  const missingSheets = totalClients - connectedSheets;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Admin</h1>
            <p className="text-sm text-muted-foreground">Manage client portals</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { logout(); navigate('/login'); }}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-1">
              <Users className="w-5 h-5 text-sky-500" />
              <span className="text-sm text-muted-foreground">Total Clients</span>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">{totalClients}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-sm text-muted-foreground">Sheets Connected</span>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">{connectedSheets}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-1">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <span className="text-sm text-muted-foreground">Missing Sheets</span>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">{missingSheets}</p>
          </div>
        </div>

        {/* Client list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Clients</h2>
            <Button size="sm" onClick={() => navigate('/admin/clients/new')} className="bg-sky-500 hover:bg-sky-600 text-white">
              <Plus className="w-4 h-4 mr-1" /> New Client
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : clients.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl text-muted-foreground">
              No clients yet. Create your first client to get started.
            </div>
          ) : (
            <div className="space-y-2">
              {clients.map(client => (
                <button
                  key={client.id}
                  onClick={() => navigate(`/admin/clients/${client.id}`)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-border/80 hover:shadow-sm transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-700 dark:text-sky-400 font-bold text-sm">
                    {client.brand_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{client.brand_name}</p>
                    <p className="text-xs text-muted-foreground font-mono">@{client.username}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    {client.hasSheet ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                        ✓ Sheet
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">
                        No Sheet
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
