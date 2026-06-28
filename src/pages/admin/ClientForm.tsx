import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { generatePassword, brandToUsername } from '@/lib/auth';
import { ArrowLeft, Copy, Check, KeyRound, Zap, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminShell from '@/components/admin/AdminShell';
import { PageHeader, FormField, FormLabel, FormHint, StatusPill } from '@/components/backend';
import { DEFAULT_PORTAL_TEMPLATE } from '@/lib/clientDefaults';

function extractSheetId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

export default function ClientForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [brandName, setBrandName] = useState('');
  const [sheetUrl, setSheetUrl] = useState('');
  const [metaAccessToken, setMetaAccessToken] = useState('');
  const [metaAdAccountId, setMetaAdAccountId] = useState('');
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleCreate() {
    if (!brandName.trim()) return;
    setLoading(true);

    try {
      const username = brandToUsername(brandName);
      const password = generatePassword();
      const spreadsheetId = sheetUrl.trim() ? extractSheetId(sheetUrl.trim()) : null;

      const { data, error } = await supabase.functions.invoke('manage-clients', {
        body: {
          action: 'create_client',
          username,
          password,
          brand_name: brandName.trim(),
          spreadsheet_id: spreadsheetId,
          meta_access_token: metaAccessToken.trim() || null,
          meta_ad_account_id: metaAdAccountId.trim() || null,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

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
    <AdminShell
      eyebrow="Admin · new client"
      actions={
        <button
          onClick={() => navigate('/admin?section=clients')}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[4px] border border-[#E2E0D9] bg-white text-[#1A1A1A] hover:bg-[#FAF8F3] mono text-[10px] uppercase tracking-[0.15em] transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back
        </button>
      }
    >
      <div className="relative max-w-[920px] mx-auto px-6 py-12">
        <PageHeader
          eyebrow="New brand"
          title={<>Onboard a <em>new client.</em></>}
          subtitle="They'll inherit the premium AdChefs portal — editor performance, KPI dashboard, and ad reporting — out of the box."
        />

        {!credentials ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            {/* Form column */}
            <div className="space-y-8">
              {/* Brand identity */}
              <section className="relative glass-card overflow-hidden">
                <span
                  aria-hidden
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: 'linear-gradient(90deg,#9ED8F5 0%,#3B86A8 35%,transparent 100%)', opacity: 0.6 }}
                />
                <div className="px-6 pt-6 pb-3 border-b border-[#EEEDE8]">
                  <p className="mono text-[10px] uppercase tracking-[0.18em] text-[#75726B]">Section 01</p>
                  <h2
                    className="mt-1 text-[18px] tracking-[-0.015em] text-[#1A1A1A]"
                    style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}
                  >
                    Brand identity
                  </h2>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <FormLabel>Brand name</FormLabel>
                    <FormField
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g. BluComerce"
                    />
                    {brandName && (
                      <FormHint tone="ok">Username · {brandToUsername(brandName)}</FormHint>
                    )}
                  </div>
                </div>
              </section>

              {/* Editor performance source */}
              <section className="relative glass-card overflow-hidden">
                <span
                  aria-hidden
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: 'linear-gradient(90deg,#9ED8F5 0%,#3B86A8 35%,transparent 100%)', opacity: 0.6 }}
                />
                <div className="px-6 pt-6 pb-3 border-b border-[#EEEDE8] flex items-center justify-between">
                  <div>
                    <p className="mono text-[10px] uppercase tracking-[0.18em] text-[#75726B]">Section 02</p>
                    <h2
                      className="mt-1 text-[18px] tracking-[-0.015em] text-[#1A1A1A]"
                      style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}
                    >
                      Editor performance <span className="text-[#9A988F] font-normal">— optional</span>
                    </h2>
                  </div>
                  <FileSpreadsheet className="w-4 h-4 text-[#3B86A8]" strokeWidth={1.5} />
                </div>
                <div className="p-6 space-y-3">
                  <FormLabel hint="Google Sheet URL">EOD Report sheet</FormLabel>
                  <FormField
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                  />
                  {sheetUrl && extractSheetId(sheetUrl) && (
                    <FormHint tone="ok">Sheet ID · {extractSheetId(sheetUrl)}</FormHint>
                  )}
                  {sheetUrl && !extractSheetId(sheetUrl) && (
                    <FormHint tone="error">Invalid Google Sheets URL</FormHint>
                  )}
                </div>
              </section>

              {/* Meta Ads */}
              <section className="relative glass-card overflow-hidden">
                <span
                  aria-hidden
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: 'linear-gradient(90deg,#9ED8F5 0%,#3B86A8 35%,transparent 100%)', opacity: 0.6 }}
                />
                <div className="px-6 pt-6 pb-3 border-b border-[#EEEDE8] flex items-center justify-between">
                  <div>
                    <p className="mono text-[10px] uppercase tracking-[0.18em] text-[#75726B]">Section 03</p>
                    <h2
                      className="mt-1 text-[18px] tracking-[-0.015em] text-[#1A1A1A]"
                      style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}
                    >
                      Meta Ads <span className="text-[#9A988F] font-normal">— optional</span>
                    </h2>
                    <p className="mt-1.5 text-[12px] text-[#75726B] max-w-md">
                      Powers the client's KPI dashboard. Both fields can be edited later.
                    </p>
                  </div>
                  <Zap className="w-4 h-4 text-[#3B86A8]" strokeWidth={1.5} />
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <FormLabel>Meta access token</FormLabel>
                    <FormField
                      value={metaAccessToken}
                      onChange={(e) => setMetaAccessToken(e.target.value)}
                      placeholder="EAAB..."
                      className="font-mono text-[12px]"
                    />
                  </div>
                  <div>
                    <FormLabel>Meta ad account ID</FormLabel>
                    <FormField
                      value={metaAdAccountId}
                      onChange={(e) => setMetaAdAccountId(e.target.value)}
                      placeholder="act_1234567890"
                      className="font-mono text-[12px]"
                    />
                  </div>
                </div>
              </section>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => navigate('/admin?section=clients')}
                  className="h-11 px-5 rounded-[4px] border border-[#E2E0D9] bg-white text-[#1A1A1A] hover:bg-[#FAF8F3] text-[13px] font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!brandName.trim() || loading}
                  className="group h-11 px-6 rounded-[4px] bg-[#1A1A1A] text-[#F7F6F3] hover:bg-black text-[13px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {loading ? 'Creating…' : 'Create client'}
                </button>
              </div>
            </div>

            {/* Side panel: what they get */}
            <aside className="lg:sticky lg:top-20 self-start">
              <div className="relative glass-card p-5 overflow-hidden">
                <span
                  aria-hidden
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: 'linear-gradient(90deg,#9ED8F5 0%,#3B86A8 35%,transparent 100%)', opacity: 0.6 }}
                />
                <p className="mono text-[10px] uppercase tracking-[0.18em] text-[#3B86A8] mb-3">
                  Portal template
                </p>
                <h3
                  className="text-[15px] tracking-[-0.01em] text-[#1A1A1A] mb-3"
                  style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}
                >
                  Every new client inherits this stack.
                </h3>
                <ul className="space-y-2.5 text-[12px] text-[#1A1A1A]">
                  {[
                    ['Client portal home', DEFAULT_PORTAL_TEMPLATE.client_portal_enabled],
                    ['Editor Performance', DEFAULT_PORTAL_TEMPLATE.editor_performance_enabled],
                    ['KPI Dashboard', DEFAULT_PORTAL_TEMPLATE.kpi_dashboard_enabled],
                    ['Ad Performance', DEFAULT_PORTAL_TEMPLATE.ad_performance_enabled],
                  ].map(([label, on]) => (
                    <li key={label as string} className="flex items-center justify-between gap-3">
                      <span>{label as string}</span>
                      <StatusPill variant={on ? 'connected' : 'not-configured'}>
                        {on ? 'Default on' : 'Off'}
                      </StatusPill>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 pt-4 border-t border-[#EEEDE8] mono text-[10px] uppercase tracking-[0.15em] text-[#75726B]">
                  Theme · adchefs-premium
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="max-w-xl">
            <div className="relative glass-card p-7 overflow-hidden">
              <span
                aria-hidden
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: 'linear-gradient(90deg,#9ED8F5 0%,#3B86A8 50%,transparent 100%)' }}
              />
              <div className="flex items-center gap-2 mb-2">
                <KeyRound className="w-4 h-4 text-[#3B86A8]" strokeWidth={1.5} />
                <span className="mono text-[10px] uppercase tracking-[0.18em] text-[#3B86A8]">
                  Client created · portal ready
                </span>
              </div>
              <h2
                className="text-[24px] tracking-[-0.02em] text-[#1A1A1A] mb-2"
                style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700 }}
              >
                Save these <em>credentials.</em>
              </h2>
              <p className="text-[13px] text-[#75726B] mb-5">
                The password won't be shown again. Share it with the client through a secure channel.
              </p>

              <div className="rounded-[4px] border border-[#E2E0D9] bg-[#FAF8F3] p-4 font-mono text-[13px] space-y-1.5">
                <p><span className="text-[#75726B]">Username · </span>{credentials.username}</p>
                <p><span className="text-[#75726B]">Password · </span>{credentials.password}</p>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <button
                  onClick={copyCredentials}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-[4px] border border-[#E2E0D9] bg-white text-[#1A1A1A] hover:bg-[#FAF8F3] text-[13px] font-medium transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy credentials'}
                </button>
                <button
                  onClick={() => navigate('/admin?section=clients')}
                  className="h-10 px-4 rounded-[4px] bg-[#1A1A1A] text-[#F7F6F3] hover:bg-black text-[13px] font-medium transition-colors"
                >
                  Back to clients
                </button>
                <button
                  onClick={() => { setCredentials(null); setBrandName(''); setSheetUrl(''); setMetaAccessToken(''); setMetaAdAccountId(''); }}
                  className="h-10 px-4 rounded-[4px] text-[#75726B] hover:text-[#1A1A1A] text-[13px] font-medium transition-colors"
                >
                  Create another
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
