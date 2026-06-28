import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/playbook';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { RotateCcw, Save, Eye, EyeOff, Upload, ImageIcon, Copy, Check, Sparkles, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePassword } from '@/lib/auth';

function extractSheetId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9-_]{20,}$/.test(url.trim())) return url.trim();
  return null;
}

interface Props {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
  onDeleted?: () => void;
}

export default function ClientEditDialog({ client, open, onOpenChange, onSaved, onDeleted }: Props) {
  const { toast } = useToast();
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
  const [originalPassword, setOriginalPassword] = useState('');

  useEffect(() => {
    if (!client || !open) return;
    setBrandName(client.brand_name);
    setUsername(client.username);
    setSheetUrl(client.spreadsheet_id || '');
    setLogoPath(client.logo_url || null);
    setPassword('');
    setOriginalPassword('');
    setMetaToken('');
    setMetaAccountId('');
    setShowPw(false);
    setShowMetaToken(false);
    (async () => {
      const { data: secrets } = await (supabase as any)
        .from('client_secrets')
        .select('current_password, meta_access_token, meta_ad_account_id')
        .eq('client_id', client.id)
        .maybeSingle();
      if (secrets) {
        setPassword(secrets.current_password || '');
        setOriginalPassword(secrets.current_password || '');
        setMetaToken(secrets.meta_access_token || '');
        setMetaAccountId(secrets.meta_ad_account_id || '');
      }
      if (client.logo_url) {
        const { data: signed } = await supabase.storage.from('module-assets').createSignedUrl(client.logo_url, 60 * 60);
        setLogoPreview(signed?.signedUrl || null);
      } else {
        setLogoPreview(null);
      }
    })();
  }, [client?.id, open]);

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
    if (!file || !client) return;
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
      const path = `client-logos/${client.id}-${Date.now()}.${ext}`;
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
    if (!client) return;
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
      client_id: client.id,
      brand_name: brandName.trim(),
      username: username.trim().toLowerCase(),
      spreadsheet_id,
      logo_url: logoPath,
      meta_access_token: metaToken.trim() || null,
      meta_ad_account_id: metaAccountId.trim() || null,
    };
    if (password && password !== originalPassword) {
      payload.new_password = password;
    }
    const { data, error } = await supabase.functions.invoke('manage-clients', { body: payload });
    setSaving(false);
    if (error || data?.error) {
      toast({ title: 'Save failed', description: data?.error || error?.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Client updated' });
    onSaved?.();
    onOpenChange(false);
  }

  async function handleDelete() {
    if (!client) return;
    if (!confirm(`Delete ${client.brand_name} and all their data? This cannot be undone.`)) return;
    const { data, error } = await supabase.functions.invoke('manage-clients', {
      body: { action: 'delete_client', client_id: client.id },
    });
    if (error || data?.error) {
      toast({ title: 'Error', description: data?.error || error?.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Client deleted' });
    onDeleted?.();
    onOpenChange(false);
  }

  const fieldLabel = "text-[11px] font-mono uppercase tracking-[0.15em] text-[#75726B] block mb-2";
  const fieldInput = "bg-white border-[#E2E0D9] text-[#1A1A1A]";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto glass-sheet border-0">
        <SheetHeader className="text-left">
          <div>
            <span className="inline-block mono text-[11px] uppercase tracking-[0.15em] text-[#3B86A8] border border-[#3B86A8] rounded-[4px] px-[14px] py-[6px]">
              Edit client
            </span>
          </div>
          <SheetTitle className="mt-3 text-[26px] tracking-[-0.02em] text-[#1A1A1A] leading-tight" style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 700 }}>
            Brand,{' '}
            <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, color: '#3B86A8' }}>
              credentials, & integrations.
            </em>
          </SheetTitle>
          <SheetDescription className="text-[12px] text-[#75726B]">
            {client?.brand_name} · @{client?.username}
          </SheetDescription>
        </SheetHeader>

        {client && (
          <div className="mt-6 space-y-6 pb-24">
            <div>
              <label className={fieldLabel}>Logo</label>
              <div className="flex items-start gap-4">
                <div className="relative w-[120px] h-[120px] rounded-[4px] overflow-hidden border border-dashed border-[#E2E0D9] flex items-center justify-center bg-white shrink-0">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-[#75726B]">
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-[9px] uppercase tracking-wider font-mono">No image</span>
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
                  className="rounded-[4px] border-[#E2E0D9] text-[#1A1A1A] bg-white hover:bg-[#F7F6F3]"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  {uploading ? 'Uploading…' : logoPreview ? 'Replace' : 'Upload image'}
                </Button>
              </div>
            </div>

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
                  className="rounded-[4px] border-[#E2E0D9] text-[#1A1A1A] bg-white hover:bg-[#F7F6F3]">
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Generate
                </Button>
                <Button type="button" variant="outline" onClick={copyPassword} disabled={!password}
                  className="rounded-[4px] border-[#E2E0D9] text-[#1A1A1A] bg-white hover:bg-[#F7F6F3]">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>
              <p className="text-[10px] text-[#75726B] mt-1.5 font-mono uppercase tracking-[0.12em]">
                Editing this value updates the client's login password on save.
              </p>
            </div>

            <div className="pt-5 border-t border-[#E2E0D9]">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#3B86A8]" />
                <h3 className="text-sm font-semibold text-[#1A1A1A]">Meta Ads integration</h3>
              </div>
              <p className="text-[12px] text-[#75726B] mb-4">
                Connect this client's own Meta Business account so the KPI dashboard pulls their spend, ROAS, and creatives. Get the token from{' '}
                <a className="text-[#3B86A8] underline underline-offset-2" href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noreferrer">Graph API Explorer</a>
                {' '}with <span className="font-mono">ads_read</span> + <span className="font-mono">ads_management</span>.
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
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E2E0D9] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.15em] text-destructive/70 hover:text-destructive transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete client
              </button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}
                  className="rounded-[4px] border-[#E2E0D9] text-[#1A1A1A] bg-white hover:bg-[#F7F6F3]">
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving} className="bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white rounded-[4px]">
                  <Save className="w-4 h-4 mr-1.5" /> {saving ? 'Saving…' : 'Save changes'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
