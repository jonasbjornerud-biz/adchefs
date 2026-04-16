import { AdMetric } from "@/data/mockAds";
import { useState } from "react";
import { Play, Eye, MousePointerClick, DollarSign, TrendingUp, ArrowUpDown, ExternalLink } from "lucide-react";

interface AdGridProps {
  ads: AdMetric[];
  onSelect: (ad: AdMetric) => void;
}

type SortKey = "name" | "spend" | "roas" | "ctr" | "hookRate";

function getRoasColor(roas: number) {
  if (roas === 0) return "text-red-400";
  if (roas < 1.5) return "text-amber-400";
  return "text-emerald-400";
}

const statusConfig: Record<string, { dot: string; pill: string }> = {
  active: { dot: "bg-emerald-400", pill: "bg-emerald-500/10 text-emerald-400" },
  paused: { dot: "bg-amber-400", pill: "bg-amber-500/10 text-amber-400" },
  ended: { dot: "bg-red-400", pill: "bg-red-500/10 text-red-400" },
};

export function AdGrid({ ads, onSelect }: AdGridProps) {
  const [sortKey, setSortKey] = useState<SortKey>("spend");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = [...ads].sort((a, b) => {
    const av = a[sortKey] as number | string;
    const bv = b[sortKey] as number | string;
    if (typeof av === "string") return sortAsc ? (av as string).localeCompare(bv as string) : (bv as string).localeCompare(av as string);
    return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  if (ads.length === 0) {
    return (
      <div className="bg-[#111118] rounded-2xl flex items-center justify-center py-20" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.4)' }}>
        <p className="text-white/30 text-sm">No ads found for this date range</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sort bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] uppercase tracking-widest text-white/30 font-medium mr-1">Sort by</span>
        {([
          { key: "spend" as SortKey, label: "Spend" },
          { key: "roas" as SortKey, label: "ROAS" },
          { key: "ctr" as SortKey, label: "CTR" },
          { key: "hookRate" as SortKey, label: "Hook Rate" },
          { key: "name" as SortKey, label: "Name" },
        ]).map(s => (
          <button
            key={s.key}
            onClick={() => toggleSort(s.key)}
            className={`h-7 px-3 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-all duration-200 cursor-pointer ${
              sortKey === s.key
                ? 'bg-[#a855f7]/15 text-[#a855f7] border border-[#a855f7]/30'
                : 'bg-[#111118] text-white/40 border border-white/[0.06] hover:text-white/60'
            }`}
          >
            {s.label}
            {sortKey === s.key && <ArrowUpDown className="w-2.5 h-2.5" />}
          </button>
        ))}
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sorted.map((ad, i) => (
          <button
            key={ad.id}
            onClick={() => onSelect(ad)}
            className="group text-left cursor-pointer bg-[#111118] rounded-2xl overflow-hidden transition-all duration-300 animate-card-enter"
            style={{
              boxShadow: '0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.4)',
              animationDelay: `${i * 50}ms`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 0 0 1px rgba(168,85,247,0.3) inset, 0 0 30px rgba(168,85,247,0.1), 0 4px 24px rgba(0,0,0,0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.4)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Video thumbnail area */}
            <div className="relative aspect-[9/16] max-h-[280px] bg-[#0a0a12] overflow-hidden">
              {ad.videoUrl ? (
                <video
                  src={ad.videoUrl}
                  poster={ad.thumbnail || undefined}
                  muted
                  playsInline
                  preload="none"
                  controls
                  className="w-full h-full object-cover"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : ad.thumbnail ? (
                <img src={ad.thumbnail} alt={ad.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play className="w-10 h-10 text-white/10" />
                </div>
              )}

              {/* Play overlay — for non-video ads, link to Ads Manager */}
              {!ad.videoUrl && ad.adManagerUrl && (
                <a
                  href={ad.adManagerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center border border-white/20">
                    <ExternalLink className="w-5 h-5 text-white" />
                  </div>
                </a>
              )}

              {/* Status pill */}
              <div className="absolute top-2.5 left-2.5">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusConfig[ad.status]?.pill}`} style={{ backdropFilter: 'none', background: ad.status === 'active' ? 'rgba(16,185,129,0.15)' : ad.status === 'paused' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)' }}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[ad.status]?.dot}`} />
                  {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                </span>
              </div>

              {/* ROAS badge */}
              <div className="absolute top-2.5 right-2.5">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${getRoasColor(ad.roas)}`} style={{ background: 'rgba(0,0,0,0.5)' }}>
                  {ad.roas}x
                </span>
              </div>
            </div>

            {/* Card content */}
            <div className="p-3.5">
              <h3 className="text-xs font-semibold text-white truncate mb-0.5">{ad.name}</h3>
              <p className="text-[10px] text-white/30 truncate mb-3">{ad.campaignName}</p>

              {/* Metrics row */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-white/30 mb-0.5">Spend</p>
                  <p className="text-xs font-black text-white">${ad.spend >= 1000 ? `${(ad.spend / 1000).toFixed(1)}k` : ad.spend.toFixed(0)}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-white/30 mb-0.5">CTR</p>
                  <p className="text-xs font-black text-white">{ad.ctr}%</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-white/30 mb-0.5">Hook</p>
                  <p className="text-xs font-black text-white">{ad.hookRate}%</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
