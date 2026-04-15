import { AdMetric } from "@/data/mockAds";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";

interface AdTableProps {
  ads: AdMetric[];
  onSelect: (ad: AdMetric) => void;
}

type SortKey = "name" | "ctr" | "cpa" | "roas" | "hookRate" | "holdRate" | "spend";

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

  const columns: { key: SortKey; label: string; format: (v: AdMetric) => string }[] = [
    { key: "name", label: "Ad Name", format: (v) => v.name },
    { key: "spend", label: "Spend", format: (v) => `$${v.spend.toLocaleString()}` },
    { key: "ctr", label: "CTR", format: (v) => `${v.ctr}%` },
    { key: "cpa", label: "CPA", format: (v) => `$${v.cpa}` },
    { key: "roas", label: "ROAS", format: (v) => `${v.roas}x` },
    { key: "hookRate", label: "Hook Rate", format: (v) => `${v.hookRate}%` },
    { key: "holdRate", label: "Hold Rate", format: (v) => `${v.holdRate}%` },
  ];

  const statusStyles: Record<string, string> = {
    active: "bg-[rgba(16,185,129,0.12)] text-[#10B981] border border-[rgba(16,185,129,0.2)]",
    paused: "bg-[rgba(245,158,11,0.12)] text-[#F59E0B] border border-[rgba(245,158,11,0.2)]",
    ended: "bg-[rgba(239,68,68,0.12)] text-[#EF4444] border border-[rgba(239,68,68,0.2)]",
  };

  return (
    <div className="bg-card-surface border border-purple rounded-[16px] shadow-card overflow-hidden animate-card-enter" style={{ animationDelay: "400ms" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stat-box">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="px-4 py-3 text-left text-xs uppercase tracking-[0.15em] font-medium text-muted-readable cursor-pointer hover:text-[#8B5CF6] transition-colors whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.15em] font-medium text-muted-readable">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((ad, i) => (
              <tr
                key={ad.id}
                onClick={() => onSelect(ad)}
                className={`cursor-pointer transition-colors duration-200 hover:bg-[rgba(139,92,246,0.04)] border-b border-[rgba(255,255,255,0.03)] ${i % 2 === 0 ? "bg-[rgba(255,255,255,0.01)]" : ""}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 whitespace-nowrap ${col.key === "name" ? "text-primary-readable font-medium" : "font-mono text-secondary-readable"}`}>
                    {col.format(ad)}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusStyles[ad.status]}`}>
                    {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}