import { useEffect, useState } from "react";
import { ExternalLink, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StatusPill } from "./StatusPill";

type Client = {
  id: string;
  brand_name: string;
  username: string;
  logo_url?: string | null;
};

function useLogo(path?: string | null) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (!path) { setUrl(null); return; }
    if (/^https?:\/\//.test(path)) { setUrl(path); return; }
    supabase.storage
      .from("module-assets")
      .createSignedUrl(path, 60 * 60)
      .then(({ data }) => { if (!cancelled) setUrl(data?.signedUrl || null); });
    return () => { cancelled = true; };
  }, [path]);
  return url;
}

export function ClientCard({
  client,
  index,
  onOpen,
  onEdit,
}: {
  client: Client;
  index?: number;
  onOpen: () => void;
  onEdit: () => void;
}) {
  const logo = useLogo(client.logo_url);
  return (
    <div className="group relative glass-card glass-card-hover">
      <span aria-hidden className="glass-rail" />
      <button
        type="button"
        onClick={onOpen}
        className="block w-full text-left p-5 cursor-pointer"
        aria-label={`Open ${client.brand_name} portal`}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-[6px] flex items-center justify-center text-[#F5F4EE] overflow-hidden shrink-0 border border-[#1A1A1A]/15"
            style={{ backgroundColor: "#1A1A1A", fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}
          >
            {logo ? (
              <img src={logo} alt={client.brand_name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[15px]">{client.brand_name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p
                className="text-[17px] tracking-[-0.015em] text-[#1A1A1A] leading-tight truncate"
                style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600 }}
              >
                {client.brand_name}
              </p>
              {typeof index === "number" && (
                <span className="mono text-[9px] uppercase tracking-[0.2em] text-[#9A988F]">
                  · {String(index + 1).padStart(2, "0")}
                </span>
              )}
            </div>
            <p className="mt-0.5 mono text-[10px] uppercase tracking-[0.18em] text-[#75726B] truncate">
              @{client.username}
            </p>
          </div>
          <StatusPill variant="connected">Portal ready</StatusPill>
        </div>
      </button>
      <div className="flex items-center justify-end gap-2 px-5 pb-5 -mt-1">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          aria-label={`Edit ${client.brand_name}`}
          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-[4px] border border-[#E2E0D9] bg-white text-[#1A1A1A] hover:bg-[#FAF8F3] mono text-[10px] uppercase tracking-[0.15em] transition-colors"
        >
          <Pencil className="w-3 h-3" strokeWidth={1.75} /> Edit
        </button>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[4px] bg-[#1A1A1A] text-[#F7F6F3] hover:bg-black mono text-[10px] uppercase tracking-[0.15em] transition-colors"
        >
          Open portal
          <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
