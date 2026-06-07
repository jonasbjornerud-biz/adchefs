import { AdMetric } from "@/data/mockAds";
import { ArrowUpDown, ExternalLink, Search } from "lucide-react";
import { useMemo, useState } from "react";

interface AdTableProps {
  ads: AdMetric[];
  onSelect: (ad: AdMetric) => void;
}

type SortKey = "name" | "ctr" | "cpa" | "roas" | "hookRate" | "holdRate" | "spend";

function getRoasColor(roas: number) {
  if (roas === 0) return "text-destructive";
  if (roas < 1.5) return "text-foreground";
  return "text-accent";
}

function adLibraryUrl(name: string) {
  const q = encodeURIComponent(name);
  return `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&q=${q}&search_type=keyword_unordered&media_type=all`;
}

function InlineBar({ value, max = 100 }: { value: number; max?: number; color?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-[#1A1A1A] tabular-nums w-10 text-right">{value}%</span>
      <div className="flex-1 h-[3px] rounded-full bg-[#E2E0D9] overflow-hidden">
        <div className="h-full rounded-full bg-[#1A1A1A] transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function AdTable({ ads, onSelect }: AdTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("spend");
  const [sortAsc, setSortAsc] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ads;
    return ads.filter(a => a.name.toLowerCase().includes(q) || a.campaignName?.toLowerCase().includes(q));
  }, [ads, query]);

  const sorted = [...filtered].sort((a, b) => {
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
    active: { dot: "bg-[#9ED8F5]", pill: "bg-[#9ED8F5]/25 text-[#1A1A1A] border border-[#9ED8F5]" },
    paused: { dot: "bg-[#75726B]", pill: "bg-[#F7F6F3] text-[#75726B] border border-[#E2E0D9]" },
    ended: { dot: "bg-destructive", pill: "bg-destructive/10 text-destructive border border-destructive/30" },
  };

  const isEmpty = sorted.length === 0;

  return (
    <div
      className="relative rounded-[4px] overflow-hidden animate-card-enter bg-white border border-[#E2E0D9]"
      style={{ animationDelay: "400ms" }}
    >
      <span className="absolute top-0 left-0 h-px w-16 bg-[#9ED8F5]" />
      {/* Search bar */}
      <div className="px-4 py-3 border-b border-[#E2E0D9] flex items-center gap-2 relative">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-[#75726B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.5} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ad name or campaign…"
            className="w-full h-9 pl-9 pr-3 rounded-[4px] bg-[#F7F6F3] border border-[#E2E0D9] text-sm text-[#1A1A1A] placeholder:text-[#75726B] focus:outline-none focus:border-[#1A1A1A] transition-colors"
          />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B] ml-auto">{sorted.length} {sorted.length === 1 ? 'ad' : 'ads'}</span>
      </div>

      {isEmpty ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-[#75726B] text-sm">{query ? `No ads match "${query}"` : 'No ads found for this date range'}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F7F6F3]">
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
                    className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B] cursor-pointer hover:text-[#1A1A1A] transition-colors whitespace-nowrap"
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">Status</th>
                <th className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-[0.15em] text-[#75726B]">Watch</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((ad) => (
                <tr
                  key={ad.id}
                  onClick={() => onSelect(ad)}
                  className="cursor-pointer transition-colors duration-200 hover:bg-[#F7F6F3] border-b border-[#E2E0D9] last:border-b-0"
                >
                  <td className="px-4 py-5 whitespace-nowrap text-[#1A1A1A] font-medium">{ad.name}</td>
                  <td className="px-4 py-5 whitespace-nowrap font-semibold text-[#1A1A1A] tabular-nums">${ad.spend.toLocaleString()}</td>
                  <td className="px-4 py-5 whitespace-nowrap text-[#75726B] tabular-nums">{ad.ctr}%</td>
                  <td className="px-4 py-5 whitespace-nowrap text-[#75726B] tabular-nums">${ad.cpa}</td>
                  <td className={`px-4 py-5 whitespace-nowrap font-semibold tabular-nums ${ad.roas === 0 ? 'text-destructive' : ad.roas < 1.5 ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]'}`}>{ad.roas}x</td>
                  <td className="px-4 py-5 whitespace-nowrap min-w-[140px]">
                    <InlineBar value={ad.hookRate} />
                  </td>
                  <td className="px-4 py-5 whitespace-nowrap min-w-[140px]">
                    <InlineBar value={ad.holdRate} />
                  </td>
                  <td className="px-4 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase tracking-[0.1em] ${statusConfig[ad.status]?.pill}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[ad.status]?.dot}`} />
                      {ad.status}
                    </span>
                  </td>
                  <td className="px-4 py-5">
                    <a
                      href={adLibraryUrl(ad.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title="Open in Meta Ad Library"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] text-[10px] font-mono uppercase tracking-[0.1em] text-[#1A1A1A] bg-[#F7F6F3] hover:bg-[#9ED8F5]/30 border border-[#E2E0D9] hover:border-[#1A1A1A] transition-all"
                    >
                      <ExternalLink className="w-3 h-3" strokeWidth={1.5} /> Library
                    </a>
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
