import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/playbook';
import { Button } from '@/components/ui/button';
import { Plus, Users, LogOut, Sparkles, ExternalLink, Pencil } from 'lucide-react';
import { logout } from '@/lib/auth';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RecruitmentPanel } from '@/components/recruitment/RecruitmentPanel';
import ClientEditDialog from '@/components/admin/ClientEditDialog';

function ClientAvatar({ client, onClick }: { client: Client; onClick: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (!client.logo_url) { setUrl(null); return; }
    supabase.storage.from('module-assets').createSignedUrl(client.logo_url, 60 * 60)
      .then(({ data }) => { if (!cancelled) setUrl(data?.signedUrl || null); });
    return () => { cancelled = true; };
  }, [client.logo_url]);
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-10 h-10 rounded-[4px] flex items-center justify-center text-background cursor-pointer hover:opacity-90 overflow-hidden"
      style={{ backgroundColor: '#1A1A1A', fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}
      aria-label={`Open ${client.brand_name} portal`}
    >
      {url ? (
        <img src={url} alt={client.brand_name} className="w-full h-full object-cover" />
      ) : (
        client.brand_name.charAt(0).toUpperCase()
      )}
    </button>
  );
}

type AdminDashboardProps = {
  initialTab?: 'clients' | 'recruitment';
};

export default function AdminDashboard({ initialTab = 'clients' }: AdminDashboardProps) {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editOpen, setEditOpen] = useState(false);

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
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="relative overflow-hidden bg-foreground text-background pt-16 pb-20">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(hsl(var(--accent)) 1px, transparent 1.5px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, hsl(var(--accent) / 0.25) 0%, transparent 65%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="relative max-w-[1100px] mx-auto px-6">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <span className="mono text-[11px] uppercase tracking-[0.15em] text-background/60">
                Backend
              </span>
              <span
                className="eyebrow inline-block"
                style={{ borderColor: 'hsl(var(--accent))', color: 'hsl(var(--accent))', background: 'transparent' }}
              >
                Admin · Internal
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/mock')}
                className="bg-transparent border-background/30 text-background hover:bg-background/10 hover:text-background"
              >
                <Sparkles className="w-4 h-4 mr-1" style={{ color: 'hsl(var(--accent))' }} /> MOCK Demo
                <ExternalLink className="w-3 h-3 ml-1.5 opacity-50" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { logout(); navigate('/login'); }}
                className="bg-transparent border-background/30 text-background hover:bg-background/10 hover:text-background"
              >
                <LogOut className="w-4 h-4 mr-1" /> Logout
              </Button>
            </div>
          </div>

          <h1
            className="mt-6 font-display text-[40px] sm:text-[60px] md:text-[72px] leading-[1.0] tracking-[-0.03em] max-w-4xl"
          >
            Run the{' '}
            <em style={{ color: 'hsl(var(--accent))' }}>operation.</em>
          </h1>
          <p className="mt-7 text-[15px] sm:text-[17px] leading-relaxed text-background/70 max-w-xl">
            Manage clients, briefs, and the editor pipeline from one place.
          </p>
        </div>
      </section>

      {/* MAIN */}
      <main className="relative max-w-[1100px] mx-auto px-6 py-16">
        <Tabs defaultValue={initialTab} className="w-full">
          <TabsList>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="mt-10 space-y-12">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
              <div
                className="rounded-[4px] border p-6"
                style={{ borderColor: '#E2E0D9', backgroundColor: '#EEEDE8' }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-4 h-4" style={{ color: '#3B86A8' }} />
                  <span className="mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">
                    Total clients
                  </span>
                </div>
                <p
                  className="text-[40px] tracking-[-0.02em] text-[#1A1A1A]"
                  style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700 }}
                >
                  {String(clients.length).padStart(2, '0')}
                </p>
              </div>
            </div>

            {/* Client list */}
            <div>
              <div className="flex items-end justify-between gap-6 mb-8">
                <div>
                  <span className="inline-block mono text-[11px] uppercase tracking-[0.15em] text-[#3B86A8] border border-[#3B86A8] rounded-[4px] px-[14px] py-[8px]">
                    Roster
                  </span>
                  <h2
                    className="mt-5 text-[28px] md:text-[36px] leading-[1.05] tracking-[-0.02em] text-[#1A1A1A]"
                    style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700 }}
                  >
                    Active{' '}
                    <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400 }}>clients.</em>
                  </h2>
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate('/admin/clients/new')}
                  className="bg-foreground hover:bg-foreground/90 text-background rounded-[4px]"
                >
                  <Plus className="w-4 h-4 mr-1" /> New client
                </Button>
              </div>

              {loading ? (
                <p className="mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">Loading…</p>
              ) : clients.length === 0 ? (
                <div className="rounded-[4px] px-8 py-14 text-center" style={{ backgroundColor: '#EEEDE8' }}>
                  <p className="mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">
                    No clients yet. Create your first client to get started.
                  </p>
                </div>
              ) : (
                <ul className="border-t" style={{ borderColor: '#E2E0D9' }}>
                  {clients.map((client, i) => (
                    <li key={client.id} className="border-b" style={{ borderColor: '#E2E0D9' }}>
                      <div className="group w-full grid grid-cols-[auto_auto_1fr_auto] items-center gap-6 sm:gap-8 py-6 transition-colors hover:bg-[#EEEDE8] px-3 sm:px-5 -mx-3 sm:-mx-5 rounded-[4px]">
                        <span className="mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <ClientAvatar client={client} onClick={() => navigate(`/admin/clients/${client.id}`)} />
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/clients/${client.id}`)}
                          className="min-w-0 text-left"
                        >
                          <p
                            className="text-[20px] sm:text-[22px] tracking-[-0.02em] text-[#1A1A1A] leading-tight truncate"
                            style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}
                          >
                            {client.brand_name}
                          </p>
                          <p className="mt-1 mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">
                            @{client.username}
                          </p>
                        </button>
                        <span className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setEditingClient(client); setEditOpen(true); }}
                            aria-label={`Edit ${client.brand_name}`}
                            className="w-10 h-10 rounded-[4px] border border-[#E2E0D9] bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-colors"
                          >
                            <Pencil className="w-4 h-4" strokeWidth={1.75} />
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/clients/${client.id}`)}
                            aria-label={`Open ${client.brand_name} portal`}
                            className="hidden sm:flex items-center gap-2 h-10 px-3 rounded-[4px] border border-[#E2E0D9] bg-white text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-colors mono text-[11px] uppercase tracking-[0.15em]"
                          >
                            Open portal
                            <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.75} />
                          </button>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>

          <TabsContent value="recruitment" className="mt-10">
            <RecruitmentPanel />
          </TabsContent>
        </Tabs>
      </main>

      <ClientEditDialog
        client={editingClient}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={loadClients}
        onDeleted={loadClients}
      />
    </div>
  );
}
