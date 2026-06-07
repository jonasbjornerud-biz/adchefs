import { Eye, Gauge, LineChart, Wallet, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const principles = [
  {
    icon: Eye,
    title: "Trained on your KPIs",
    body: "Your editor studies your hook rates, hold curves, CPA and ROAS every week. They learn what your winners share, then engineer more of them. Creative informed by data, not taste.",
    stat: "HOOK · HOLD · ROAS",
  },
  {
    icon: Gauge,
    title: "Delivery you can track",
    body: "See exactly how many videos were delivered and approved per editor, week by week. No more chasing status updates or wondering what's in the pipeline.",
    stat: "WEEKLY DELIVERY",
  },
  {
    icon: LineChart,
    title: "Live KPI Dashboard",
    body: "ROAS front and centre. CPA, CTR, hook rate and hold rate streaming alongside. One live view of what every editor on your account is moving.",
    stat: "INCLUDED FREE",
  },
  {
    icon: Wallet,
    title: "You only pay per video",
    body: "No retainers. No minimums. No long contracts. You pay for videos delivered, nothing else. The dashboard, the oversight, the editor management is on me.",
    stat: "FROM €100 / VIDEO",
  },
];

const EditorEdge = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 sm:py-32 bg-foreground text-background">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow" style={{ background: "transparent", borderColor: "hsl(var(--accent))", color: "hsl(var(--accent))" }}>
            See how it works
          </span>
          <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] whitespace-nowrap">
            Editors who understand <em style={{ color: "hsl(var(--accent))" }}>why ads work.</em>
          </h2>
          <p className="mt-5 text-[15px] text-background/60 leading-relaxed">
            Every brand gets a private performance dashboard, free. Hook rate, hold curve, ROAS, CPA, delivery, all in one place, updated in real time. Your editor sees the same numbers you do, so creative decisions are driven by data, not guesses.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-background/10 border border-background/10 rounded-[4px] overflow-hidden">
          {principles.map((p) => (
            <div key={p.title} className="bg-foreground p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <p.icon className="w-5 h-5 text-accent" />
                <span className="mono text-[10px] uppercase tracking-[0.18em] text-accent">{p.stat}</span>
              </div>
              <h3 className="font-display text-[22px] leading-tight tracking-tight mb-3">{p.title}</h3>
              <p className="text-[14px] text-background/60 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Button
            size="lg"
            onClick={() => navigate('/mock')}
            className="bg-background text-foreground hover:bg-background/90 rounded-[4px]"
          >
            See how it works
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EditorEdge;