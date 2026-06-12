import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/playbook';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { RecruitmentPanel } from '@/components/recruitment/RecruitmentPanel';
import ClientEditDialog from '@/components/admin/ClientEditDialog';
import AdminShell from '@/components/admin/AdminShell';
import { ClientCard, MetricCard, EmptyState } from '@/components/backend';

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
        {section === 'clients' ? (
          <>
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
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Total clients"
                value={String(clients.length).padStart(2, '0')}
                hint="Active brand portals"
                icon={<Users className="w-3.5 h-3.5" strokeWidth={1.75} />}
              />
              <MetricCard
                label="Portal template"
                value="v1"
                hint="adchefs-premium"
              />
              <MetricCard
                label="New onboarding"
                value="—"
                hint="Connect a client to begin"
              />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-[140px] rounded-[6px] border border-[#E2E0D9] bg-[#FAF8F3] animate-pulse" />
                ))}
              </div>
            ) : clients.length === 0 ? (
              <EmptyState
                eyebrow="No clients yet"
                icon={<Users className="w-4 h-4" strokeWidth={1.5} />}
                title="Spin up your first brand portal."
                body="Every new client automatically inherits the AdChefs premium portal — editor performance, KPI dashboard, and ad reporting included."
                action={
                  <Button
                    onClick={() => navigate('/admin/clients/new')}
                    className="bg-[#1A1A1A] hover:bg-black text-[#FAF8F3] rounded-[4px] h-10"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> New client
                  </Button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clients.map((client, i) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    index={i}
                    onOpen={() => navigate(`/admin/clients/${client.id}`)}
                    onEdit={() => { setEditingClient(client); setEditOpen(true); }}
                  />
                ))}
              </div>
            )}
          </div>
          </>
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
