import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/playbook';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Trash2, RotateCcw, Save, Eye, EyeOff, Upload, ImageIcon, Copy, Check } from 'lucide-react';
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
    };
    if (password) payload.new_password = password;
    const { data, error } = await supabase.functions.invoke('manage-clients', { body: payload });
    setSaving(false);
    if (error || data?.error) {
      toast({ title: 'Save failed', description: data?.error || error?.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Client updated' });
    setPassword('');
    await loadData();
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#09090B' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
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
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      <header className="relative z-10 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin')} className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center text-[11px] font-bold text-white shadow-lg shadow-foreground/20 overflow-hidden">
                {logoPreview ? <img src={logoPreview} alt="" className="w-full h-full object-cover" /> : client.brand_name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-white">{client.brand_name}</span>
              <span className="text-[10px] text-white/20">Admin View</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleDelete}
              className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] text-destructive/60 hover:text-destructive transition-colors"
              style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)' }}>
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10 space-y-10">
        <section className="rounded-2xl p-8" style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Edit client</h2>
              <p className="text-xs text-white/40 mt-0.5">Update brand details, logo, and credentials.</p>
            </div>
            <Button onClick={handleSave} disabled={saving} className="bg-accent hover:bg-accent/90 text-foreground">
              <Save className="w-4 h-4 mr-1.5" /> {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/40 block mb-2">Logo</label>
              <div className="relative w-[180px] h-[180px] rounded-xl overflow-hidden border border-dashed flex items-center justify-center"
                style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.02)' }}>
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-white/30">
                    <ImageIcon className="w-7 h-7" />
                    <span className="text-[10px] uppercase tracking-wider">No image</span>
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
                className="mt-3 w-[180px] bg-transparent border-white/15 text-white/80 hover:bg-white/5 hover:text-white"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                {uploading ? 'Uploading…' : logoPreview ? 'Replace' : 'Upload image'}
              </Button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/40 block mb-2">Brand name</label>
                  <Input value={brandName} onChange={(e) => setBrandName(e.target.value)}
                    className="bg-white/[0.03] border-white/10 text-white" />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/40 block mb-2">Username</label>
                  <Input value={username} onChange={(e) => setUsername(e.target.value)}
                    className="bg-white/[0.03] border-white/10 text-white font-mono" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/40 block mb-2">Google Sheet URL</label>
                <Input value={sheetUrl} onChange={(e) => setSheetUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="bg-white/[0.03] border-white/10 text-white" />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/40 block mb-2">Password</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep current"
                      className="bg-white/[0.03] border-white/10 text-white font-mono pr-10"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button type="button" variant="outline" onClick={generateNew}
                    className="bg-transparent border-white/15 text-white/80 hover:bg-white/5 hover:text-white">
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Generate
                  </Button>
                  {password && (
                    <Button type="button" variant="outline" onClick={copyPassword}
                      className="bg-transparent border-white/15 text-white/80 hover:bg-white/5 hover:text-white">
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                  )}
                </div>
                <p className="text-[10px] text-white/30 mt-1.5">Set a new password to overwrite. Share it with the client.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-mono uppercase tracking-[0.15em] text-white/60">Client view preview</h2>
            <span className="text-[10px] text-white/30">What {client.brand_name} sees when they sign in</span>
          </div>
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
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
