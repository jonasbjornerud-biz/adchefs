import { ArrowRight, TrendingUp, MousePointerClick, DollarSign, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const BROWSER_DOTS = (
  <div className="flex items-center gap-1.5" aria-hidden="true">
    <span className="w-2.5 h-2.5 rounded-full bg-[#EEEDE8]" />
    <span className="w-2.5 h-2.5 rounded-full bg-[#EEEDE8]" />
    <span className="w-2.5 h-2.5 rounded-full bg-[#EEEDE8]" />
  </div>
);

const tileBase = "rounded-[4px] border border-[#E2E0D9] bg-white p-5 transition-colors hover:border-[#1A1A1A]/30";
const labelMono = "font-mono text-[9px] uppercase tracking-[0.18em] text-[#75726B]";

const KpiTile = ({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  icon: typeof TrendingUp;
  accent?: boolean;
}) => (
  <div className={tileBase}>
    <div className="flex items-center justify-between mb-4">
      <span className={labelMono}>{label}</span>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${accent ? "bg-[#9ED8F5]/25" : "bg-[#EEEDE8]"}`}>
        <Icon className={`w-3.5 h-3.5 ${accent ? "text-[#3B86A8]" : "text-[#75726B]"}`} strokeWidth={1.5} />
      </div>
    </div>
    <div className="font-display text-[28px] md:text-[32px] leading-none tracking-tight text-[#1A1A1A]">
      {value}
    </div>
    <div className={`mt-2 font-mono text-[10px] uppercase tracking-[0.12em] ${accent ? "text-[#3B86A8]" : "text-[#75726B]"}`}>
      {sub}
    </div>
  </div>
);

const MiniChart = () => {
  const bars = [38, 52, 44, 68, 56, 82, 74, 92, 78, 88];
  return (
    <div className={tileBase}>
      <div className="flex items-center justify-between mb-4">
        <span className={labelMono}>SPEND · LAST 14D</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#3B86A8]">LIVE</span>
      </div>
      <div className="flex items-end gap-1.5 h-24">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-[2px] bg-[#1A1A1A]/10 hover:bg-[#9ED8F5]/60 transition-colors"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.12em] text-[#75726B]">
        <span>Jun 12</span>
        <span>Jun 25</span>
      </div>
    </div>
  );
};

const AdRow = ({ name, roas, ctr, spend }: { name: string; roas: string; ctr: string; spend: string }) => (
  <div className="flex items-center justify-between py-3 border-b border-[#E2E0D9] last:border-b-0">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-[4px] bg-[#EEEDE8] flex items-center justify-center text-[10px] font-mono text-[#75726B]">
        AD
      </div>
      <span className="text-[13px] font-medium text-[#1A1A1A] truncate max-w-[140px]">{name}</span>
    </div>
    <div className="flex items-center gap-4 md:gap-6 text-[11px] font-mono text-[#75726B]">
      <span className="text-[#1A1A1A] font-semibold">{roas} ROAS</span>
      <span className="hidden sm:inline">{ctr} CTR</span>
      <span className="hidden md:inline">{spend}</span>
    </div>
  </div>
);

const DashboardMock = () => (
  <div className="relative rounded-[8px] bg-[#F7F6F3] border border-[#E2E0D9] shadow-[0_32px_80px_-24px_rgba(26,26,26,0.25)] overflow-hidden">
    {/* Browser chrome */}
    <div className="h-10 px-4 flex items-center justify-between border-b border-[#E2E0D9] bg-white">
      {BROWSER_DOTS}
      <div className="flex-1 mx-4">
        <div className="h-6 max-w-[220px] mx-auto rounded-[4px] bg-[#F7F6F3] border border-[#E2E0D9] flex items-center px-3">
          <span className="text-[10px] font-mono text-[#75726B] truncate">adchefs.com/dashboard/rituel</span>
        </div>
      </div>
      <div className="w-12" />
    </div>

    <div className="p-5 md:p-6 space-y-5">
      {/* Header strip */}
      <div className="flex items-center justify-between">
        <div>
          <span className="eyebrow eyebrow-accent">RITUEL · LIVE META DATA</span>
          <h4 className="mt-2 font-display text-[20px] md:text-[24px] leading-tight tracking-tight text-[#1A1A1A]">
            Account <em>performance</em>.
          </h4>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.12em] text-[#75726B]">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-[#9ED8F5] animate-ping opacity-60" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-[#9ED8F5]" />
          </span>
          Synced
        </div>
      </div>

      {/* KPI bento */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KpiTile label="ROAS" value="2.52x" sub="+0.18 vs last 7d" icon={TrendingUp} accent />
        <KpiTile label="CTR" value="4.20%" sub="+0.42 vs last 7d" icon={MousePointerClick} />
        <KpiTile label="Spend" value="$17,420" sub="Last 14 days" icon={DollarSign} />
        <KpiTile label="Purchases" value="848" sub="Attributed" icon={ShoppingCart} accent />
      </div>

      {/* Chart + ad rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <MiniChart />
        <div className={tileBase}>
          <div className="flex items-center justify-between mb-3">
            <span className={labelMono}>TOP ADS</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#3B86A8]">7D</span>
          </div>
          <div className="space-y-0">
            <AdRow name="Hook A — UGC price" roas="3.1" ctr="5.2%" spend="$4,210" />
            <AdRow name="Hook B — product" roas="2.4" ctr="4.1%" spend="$3,850" />
            <AdRow name="Hook C — founder" roas="2.8" ctr="3.8%" spend="$2,940" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const LiveDashboard = () => {
  const navigate = useNavigate();
  return (
    <section id="dashboard" className="py-16 sm:py-32 bg-background overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid lg:grid-cols-[420px_1fr] gap-12 lg:gap-16 items-center">
          {/* Left column */}
          <div className="max-w-md">
            <span className="eyebrow">THE DASHBOARD · INCLUDED FREE</span>
            <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
              One <em>source</em> of truth.
            </h2>
            <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
              Every account gets a private dashboard, free. It pulls live Meta data so you see the same numbers I direct creative off: ROAS, CTR, spend, purchases, hook and hold rate. No spreadsheets, no guessing, no extra tab.
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                onClick={() => navigate('/mock')}
                className="bg-foreground text-background hover:bg-foreground/90 rounded-[4px]"
              >
                View live demo
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right column: browser mock bleeding off right edge */}
          <div className="relative lg:translate-x-[10%] xl:translate-x-[14%] min-w-[320px] md:min-w-[560px]">
            <DashboardMock />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDashboard;
