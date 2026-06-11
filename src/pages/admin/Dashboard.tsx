import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/playbook';
import { Button } from '@/components/ui/button';
import { Plus, Users, ExternalLink, Pencil } from 'lucide-react';
import { RecruitmentPanel } from '@/components/recruitment/RecruitmentPanel';
import ClientEditDialog from '@/components/admin/ClientEditDialog';
import AdminShell from '@/components/admin/AdminShell';

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

type Section = 'pipeline' | 'shortlist' | 'jobs' | 'clients';
const SECTION_META: Record<Section, { eyebrow: string; title: React.ReactNode; subtitle: string }> = {
  pipeline: {
    eyebrow: 'Pipeline',
    title: <>Editor <em>applicants.</em></>,
    subtitle: 'Every applicant across every brand, in one view.',
  },
  shortlist: {
    eyebrow: 'Shortlist',
    title: <>Shortlisted <em>editors.</em></>,
    subtitle: 'Starred talent, ready to invite to a new trial.',
  },
  jobs: {
    eyebrow: 'Roles',
    title: <>Job <em>postings.</em></>,
    subtitle: 'Public roles, trial tasks, and email copy.',
  },
  clients: {
    eyebrow: 'Roster',
    title: <>Active <em>clients.</em></>,
    subtitle: 'Brand portals you manage.',
  },
};

type AdminDashboardProps = {
  /** Legacy prop kept for backwards compat with /admin/recruitment route */
  initialTab?: 'clients' | 'recruitment';
};

export default function AdminDashboard({ initialTab }: AdminDashboardProps = {}) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sectionParam = (params.get('section') as Section | null);
  const fallback: Section = initialTab === 'recruitment' ? 'pipeline' : 'pipeline';
  const section: Section = sectionParam ?? fallback;
  const meta = SECTION_META[section];

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

  const headerActions =
    section === 'clients' ? (
      <Button
        size="sm"
        onClick={() => navigate('/admin/clients/new')}
        className="bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-[#FAF8F3] rounded-[4px] h-8"
      >
        <Plus className="w-3.5 h-3.5 mr-1" /> New client
      </Button>
    ) : null;

  return (
    <AdminShell eyebrow="Admin · internal" actions={headerActions}>
      <div className="relative max-w-[1280px] mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-10">
          <span className="inline-block mono text-[11px] uppercase tracking-[0.15em] text-[#3B86A8] border border-[#3B86A8]/40 rounded-[4px] px-[14px] py-[6px] bg-white/50 backdrop-blur-sm">
            {meta.eyebrow}
          </span>
          <h1
            className="mt-5 text-[34px] sm:text-[44px] leading-[1.02] tracking-[-0.025em] text-[#1A1A1A]"
            style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700 }}
          >
            {meta.title}
          </h1>
          <p className="mt-2 text-[14px] text-[#75726B] max-w-xl">{meta.subtitle}</p>
        </div>

        {section === 'clients' ? (
          <div className="space-y-8">
            <div
              className="rounded-[8px] border p-6 max-w-sm"
              style={{ borderColor: '#E2E0D9', background: 'linear-gradient(135deg, #FFFFFF 0%, #ECF7FD 100%)' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-4 h-4" style={{ color: '#3B86A8' }} />
                <span className="mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">
                  Total clients
                </span>
              </div>
              <p
                className="text-[44px] leading-none tracking-[-0.02em] text-[#1A1A1A]"
                style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700 }}
              >
                {String(clients.length).padStart(2, '0')}
              </p>
            </div>

            {loading ? (
              <p className="mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">Loading…</p>
            ) : clients.length === 0 ? (
              <div className="rounded-[8px] px-8 py-14 text-center border" style={{ borderColor: '#E2E0D9', backgroundColor: '#FAF8F3' }}>
                <p className="mono text-[11px] uppercase tracking-[0.15em] text-[#75726B]">
                  No clients yet. Create your first client to get started.
                </p>
              </div>
            ) : (
              <ul className="rounded-[8px] border bg-white/60 backdrop-blur-sm overflow-hidden" style={{ borderColor: '#E2E0D9' }}>
                {clients.map((client, i) => (
                  <li key={client.id} className="border-b last:border-b-0" style={{ borderColor: '#EEEDE8' }}>
                    <div className="group w-full grid grid-cols-[auto_auto_1fr_auto] items-center gap-6 px-5 py-5 transition-colors hover:bg-[#ECF7FD]/40">
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
                          className="text-[20px] tracking-[-0.02em] text-[#1A1A1A] leading-tight truncate"
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
                          className="w-9 h-9 rounded-[4px] border border-[#E2E0D9] bg-white flex items-center justify-center text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/clients/${client.id}`)}
                          aria-label={`Open ${client.brand_name} portal`}
                          className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-[4px] border border-[#E2E0D9] bg-white text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-colors mono text-[11px] uppercase tracking-[0.15em]"
                        >
                          Open portal
                          <ExternalLink className="w-3 h-3" strokeWidth={1.75} />
                        </button>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <RecruitmentPanel
            section={section === 'pipeline' || section === 'shortlist' || section === 'jobs' ? section : 'pipeline'}
          />
        )}
      </div>

      <ClientEditDialog
        client={editingClient}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={loadClients}
        onDeleted={loadClients}
      />
    </AdminShell>
  );
}
