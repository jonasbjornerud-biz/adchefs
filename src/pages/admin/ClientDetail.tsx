import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/playbook';
import { ArrowLeft, Pencil } from 'lucide-react';
import ClientDashboard from '@/pages/editor/ClientDashboard';
import ClientEditDialog from '@/components/admin/ClientEditDialog';

export default function ClientDetail() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => { loadData(); }, [clientId]);

  async function loadData() {
    if (!clientId) return;
    setLoading(true);
    const { data } = await supabase.from('clients').select('*').eq('id', clientId).single();
    setClient(data as Client | null);
    setLoading(false);
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F6F3]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs uppercase tracking-[0.18em] font-mono text-[#75726B]">Loading</span>
      </div>
    </div>
  );

  if (!client) return (
    <div className="min-h-screen flex items-center justify-center text-[#75726B] bg-[#F7F6F3]">
      Client not found
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      {/* Slim admin bar */}
      <div className="sticky top-0 z-50 border-b border-[#1A1A1A]/10 bg-[#1A1A1A] text-white">
        <div className="max-w-6xl mx-auto px-6 h-10 flex items-center justify-between">
          <button onClick={() => navigate('/admin')} className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.15em] text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to admin
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/50">
              Admin preview · {client.brand_name}
            </span>
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-1.5 h-7 px-2.5 rounded-[4px] text-[11px] font-mono uppercase tracking-[0.15em] bg-white text-[#1A1A1A] hover:bg-[#9ED8F5] transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
        </div>
      </div>

      {/* Exact client portal view */}
      <ClientDashboard clientOverride={client} />

      <ClientEditDialog
        client={client}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={loadData}
        onDeleted={() => navigate('/admin')}
      />
    </div>
  );
}
