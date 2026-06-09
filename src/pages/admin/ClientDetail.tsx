import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/playbook';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Trash2, RotateCcw, Save, Eye, EyeOff, Upload, ImageIcon, Copy, Check, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePassword } from '@/lib/auth';
import ClientDashboard from '@/pages/editor/ClientDashboard';

function extractSheetId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9-_]{20,}$/.test(url.trim())) return url.trim();
  return null;
}

export default function ClientDetail() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [brandName, setBrandName] = useState('');
  const [username, setUsername] = useState('');
  const [sheetUrl, setSheetUrl] = useState('');
  const [logoPath, setLogoPath] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [copied, setCopied] = useState(false);
  const [metaToken, setMetaToken] = useState('');
  const [showMetaToken, setShowMetaToken] = useState(false);
  const [metaAccountId, setMetaAccountId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadData(); }, [clientId]);

  async function loadData() {
    if (!clientId) return;
    setLoading(true);
    const { data } = await supabase.from('clients').select('*').eq('id', clientId).single();
    const c = data as Client | null;
    setClient(c);
    if (c) {
      setBrandName(c.brand_name);
      setUsername(c.username);
      setSheetUrl(c.spreadsheet_id || '');
      setLogoPath(c.logo_url || null);
      setPassword(c.current_password || '');
      setMetaToken(c.meta_access_token || '');
      setMetaAccountId(c.meta_ad_account_id || '');
      if (c.logo_url) {
        const { data: signed } = await supabase.storage.from('module-assets').createSignedUrl(c.logo_url, 60 * 60);
        setLogoPreview(signed?.signedUrl || null);
      } else {
        setLogoPreview(null);
      }
    }
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

  function generateNew() {
    setPassword(generatePassword());
    setShowPw(true);
  }

  async function copyPassword() {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !clientId) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please upload an image.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Too large', description: 'Max image size is 5 MB.', variant: 'destructive' });
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
      const path = `client-logos/${clientId}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('module-assets')
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      setLogoPath(path);
      const { data: signed } = await supabase.storage.from('module-assets').createSignedUrl(path, 60 * 60);
      setLogoPreview(signed?.signedUrl || null);
      toast({ title: 'Image uploaded', description: 'Save to apply.' });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!clientId) return;
    if (!brandName.trim() || !username.trim()) {
      toast({ title: 'Missing fields', description: 'Brand name and username are required.', variant: 'destructive' });
      return;
    }
    const spreadsheet_id = sheetUrl ? extractSheetId(sheetUrl) : null;
    if (sheetUrl && !spreadsheet_id) {
      toast({ title: 'Invalid sheet URL', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const payload: any = {
      action: 'update_client',
      client_id: clientId,
      brand_name: brandName.trim(),
      username: username.trim().toLowerCase(),
      spreadsheet_id,
      logo_url: logoPath,
      meta_access_token: metaToken.trim() || null,
      meta_ad_account_id: metaAccountId.trim() || null,
    };
    // Only send password if it differs from current stored value (treat empty + same as no change)
    if (password && password !== (client?.current_password || '')) {
      payload.new_password = password;
    }
    const { data, error } = await supabase.functions.invoke('manage-clients', { body: payload });
    setSaving(false);
    if (error || data?.error) {
      toast({ title: 'Save failed', description: data?.error || error?.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Client updated' });
    await loadData();
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

  const fieldLabel = "text-[11px] font-mono uppercase tracking-[0.15em] text-[#75726B] block mb-2";
  const fieldInput = "bg-white border-[#E2E0D9] text-[#1A1A1A]";

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#1A1A1A] relative overflow-hidden">
      {/* Paper grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04] z-[1]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          backgroundSize: '200px 200px',
        }}
      />
      {/* Blue gradient accent */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(ellipse at 90% 0%, rgba(158, 216, 245, 0.35) 0%, transparent 55%)',
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#E2E0D9] bg-[#F7F6F3]/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin')} className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.15em] text-[#75726B] hover:text-[#1A1A1A] transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <div className="h-4 w-px bg-[#E2E0D9]" />
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[4px] flex items-center justify-center text-[#1A1A1A] text-[11px] font-semibold border border-[#1A1A1A]/15 bg-[#9ED8F5] overflow-hidden">
                {logoPreview ? <img src={logoPreview} alt="" className="w-full h-full object-cover" /> : client.brand_name.charAt(0)}
              </div>
              <span className="text-sm font-medium tracking-tight">{client.brand_name}</span>
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">Admin</span>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 h-8 px-3 rounded-[4px] text-[11px] font-mono uppercase tracking-[0.15em] text-destructive/70 hover:text-destructive border border-destructive/20 hover:border-destructive/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Edit panel */}
        <section className="rounded-[4px] bg-white border border-[#E2E0D9] p-8">
          <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
            <div>
              <span className="inline-block mono text-[11px] uppercase tracking-[0.15em] text-[#3B86A8] border border-[#3B86A8] rounded-[4px] px-[14px] py-[6px]">
                Edit client
              </span>
              <h2 className="mt-4 text-[26px] tracking-[-0.02em] text-[#1A1A1A] leading-tight" style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700 }}>
                Brand,{' '}
                <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, color: '#3B86A8' }}>
                  credentials, & integrations.
                </em>
              </h2>
            </div>
            <Button onClick={handleSave} disabled={saving} className="bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white rounded-[4px]">
              <Save className="w-4 h-4 mr-1.5" /> {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8">
            {/* Logo */}
            <div>
              <label className={fieldLabel}>Logo</label>
              <div className="relative w-[180px] h-[180px] rounded-[4px] overflow-hidden border border-dashed border-[#E2E0D9] flex items-center justify-center bg-[#F7F6F3]">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#75726B]">
                    <ImageIcon className="w-7 h-7" />
                    <span className="text-[10px] uppercase tracking-wider font-mono">No image</span>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="mt-3 w-[180px] rounded-[4px] border-[#E2E0D9] text-[#1A1A1A] hover:bg-[#F7F6F3]"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                {uploading ? 'Uploading…' : logoPreview ? 'Replace' : 'Upload image'}
              </Button>
            </div>

            {/* Fields */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={fieldLabel}>Brand name</label>
                  <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} className={fieldInput} />
                </div>
                <div>
                  <label className={fieldLabel}>Username</label>
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} className={`${fieldInput} font-mono`} />
                </div>
              </div>

              <div>
                <label className={fieldLabel}>Google Sheet URL</label>
                <Input value={sheetUrl} onChange={(e) => setSheetUrl(e.target.value)} placeholder="https://docs.google.com/spreadsheets/d/..." className={fieldInput} />
              </div>

              <div>
                <label className={fieldLabel}>Password</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Current password"
                      className={`${fieldInput} font-mono pr-10`}
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#75726B] hover:text-[#1A1A1A]">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button type="button" variant="outline" onClick={generateNew}
                    className="rounded-[4px] border-[#E2E0D9] text-[#1A1A1A] hover:bg-[#F7F6F3]">
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Generate
                  </Button>
                  <Button type="button" variant="outline" onClick={copyPassword} disabled={!password}
                    className="rounded-[4px] border-[#E2E0D9] text-[#1A1A1A] hover:bg-[#F7F6F3]">
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
                <p className="text-[10px] text-[#75726B] mt-1.5 font-mono uppercase tracking-[0.12em]">
                  Editing this value updates the client's login password on save.
                </p>
              </div>

              {/* Meta Ads */}
              <div className="pt-5 border-t border-[#E2E0D9]">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[#3B86A8]" />
                  <h3 className="text-sm font-semibold text-[#1A1A1A]">Meta Ads integration</h3>
                </div>
                <p className="text-[12px] text-[#75726B] mb-4 max-w-xl">
                  Connect this client's own Meta Business account so the KPI dashboard pulls their spend, ROAS, and creatives directly. Get the token from{' '}
                  <a className="text-[#3B86A8] underline underline-offset-2" href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noreferrer">Graph API Explorer</a>
                  {' '}with <span className="font-mono">ads_read</span> + <span className="font-mono">ads_management</span> permissions.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className={fieldLabel}>Meta access token</label>
                    <div className="relative">
                      <Input
                        type={showMetaToken ? 'text' : 'password'}
                        value={metaToken}
                        onChange={(e) => setMetaToken(e.target.value)}
                        placeholder="EAAB…"
                        className={`${fieldInput} font-mono pr-10`}
                      />
                      <button type="button" onClick={() => setShowMetaToken(!showMetaToken)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#75726B] hover:text-[#1A1A1A]">
                        {showMetaToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={fieldLabel}>Meta ad account ID</label>
                    <Input
                      value={metaAccountId}
                      onChange={(e) => setMetaAccountId(e.target.value)}
                      placeholder="act_1234567890"
                      className={`${fieldInput} font-mono`}
                    />
                    <p className="text-[10px] text-[#75726B] mt-1.5 font-mono uppercase tracking-[0.12em]">
                      Format: <span className="normal-case">act_</span> + numeric account id.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Preview */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-4 h-4 text-[#3B86A8]" />
            <h2 className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#75726B]">Client view preview</h2>
            <span className="text-[10px] text-[#75726B]/70">What {client.brand_name} sees when they sign in</span>
          </div>
          <div className="rounded-[4px] overflow-hidden border border-[#E2E0D9] bg-white">
            <ClientDashboard
              clientOverride={{ ...client, brand_name: brandName, logo_url: logoPath }}
              hideChrome
            />
          </div>
        </section>
      </main>
    </div>
  );
}
