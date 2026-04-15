import { AdMetric } from "@/data/mockAds";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";

interface AdTableProps {
  ads: AdMetric[];
  onSelect: (ad: AdMetric) => void;
}

type SortKey = "name" | "ctr" | "cpa" | "roas" | "hookRate" | "holdRate" | "spend";

function getRoasColor(roas: number) {
  if (roas === 0) return "text-red-400";
  if (roas < 1.5) return "text-amber-400";
  return "text-emerald-400";
}

function InlineBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-white/80 w-10 text-right">{value}%</span>
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export function AdTable({ ads, onSelect }: AdTableProps) {
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

  const statusConfig: Record<string, { dot: string; pill: string }> = {
    active: { dot: "bg-emerald-400", pill: "bg-emerald-500/10 text-emerald-400" },
    paused: { dot: "bg-amber-400", pill: "bg-amber-500/10 text-amber-400" },
    ended: { dot: "bg-red-400", pill: "bg-red-500/10 text-red-400" },
  };

  const isEmpty = ads.length === 0;

  return (
    <div
      className="bg-[#111118] rounded-2xl overflow-hidden animate-card-enter"
      style={{
        boxShadow: '0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.4)',
        animationDelay: "400ms",
      }}
    >
      {isEmpty ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-white/30 text-sm">No ads found for this date range</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderTop: '1px solid rgba(168,85,247,0.2)' }}>
                {([
                  { key: "name" as SortKey, label: "Ad Name" },
                  { key: "spend" as SortKey, label: "Spend" },
                  { key: "ctr" as SortKey, label: "CTR" },
                  { key: "cpa" as SortKey, label: "CPA" },
                  { key: "roas" as SortKey, label: "ROAS" },
                  { key: "hookRate" as SortKey, label: "Hook Rate" },
                  { key: "holdRate" as SortKey, label: "Hold Rate" },
                ]).map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium text-white/40 cursor-pointer hover:text-[#a855f7] transition-colors whitespace-nowrap"
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium text-white/40">Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((ad) => (
                <tr
                  key={ad.id}
                  onClick={() => onSelect(ad)}
                  className="cursor-pointer transition-all duration-200 hover:bg-white/[0.03] border-b border-white/[0.03]"
                >
                  <td className="px-4 py-5 whitespace-nowrap text-white font-medium">{ad.name}</td>
                  <td className="px-4 py-5 whitespace-nowrap font-black text-white/80">${ad.spend.toLocaleString()}</td>
                  <td className="px-4 py-5 whitespace-nowrap text-white/60">{ad.ctr}%</td>
                  <td className="px-4 py-5 whitespace-nowrap text-white/60">${ad.cpa}</td>
                  <td className={`px-4 py-5 whitespace-nowrap font-bold ${getRoasColor(ad.roas)}`}>{ad.roas}x</td>
                  <td className="px-4 py-5 whitespace-nowrap min-w-[140px]">
                    <InlineBar value={ad.hookRate} color="#34d399" />
                  </td>
                  <td className="px-4 py-5 whitespace-nowrap min-w-[140px]">
                    <InlineBar value={ad.holdRate} color="#a855f7" />
                  </td>
                  <td className="px-4 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[ad.status]?.pill}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[ad.status]?.dot}`} />
                      {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
