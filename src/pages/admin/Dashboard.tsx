import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/playbook';
import { Button } from '@/components/ui/button';
import { Plus, Users, LogOut, Sparkles, ExternalLink } from 'lucide-react';
import { logout } from '@/lib/auth';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RecruitmentPanel } from '@/components/recruitment/RecruitmentPanel';

type AdminDashboardProps = {
  initialTab?: 'clients' | 'recruitment';
};

export default function AdminDashboard({ initialTab = 'clients' }: AdminDashboardProps) {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
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

    setClients((clientsData || []) as Client[]);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Admin</h1>
            <p className="text-sm text-muted-foreground">Manage clients & recruitment</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/mock')}>
              <Sparkles className="w-4 h-4 mr-1 text-accent" /> MOCK Demo
              <ExternalLink className="w-3 h-3 ml-1.5 opacity-50" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => { logout(); navigate('/login'); }}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <Tabs defaultValue={initialTab} className="w-full">
          <TabsList>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
          </TabsList>
          <TabsContent value="clients" className="mt-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-1">
              <Users className="w-5 h-5 text-foreground" />
              <span className="text-sm text-muted-foreground">Total Clients</span>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">{clients.length}</p>
          </div>
        </div>

        {/* Client list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Clients</h2>
            <Button size="sm" onClick={() => navigate('/admin/clients/new')} className="bg-foreground hover:bg-foreground/90 text-white">
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
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-foreground font-bold text-sm">
                    {client.brand_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{client.brand_name}</p>
                    <p className="text-xs text-muted-foreground font-mono">@{client.username}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
          </TabsContent>
          <TabsContent value="recruitment" className="mt-6">
            <RecruitmentPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
