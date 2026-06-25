import { Eye, Film, LineChart, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AnimationPlaceholder from "./AnimationPlaceholder";

const principles = [
  {
    icon: Eye,
    title: "Angles from the numbers",
    body: "I read hook rate, hold curve, ROAS and CPA every week, then build the next angles from what your winners share.",
    stat: "HOOK · HOLD · ROAS",
  },
  {
    icon: Film,
    title: "Briefs with an editing eye",
    body: "Editors get more than a script. They get direction on how to cut it, because I have spent years in the timeline myself.",
    stat: "SHOT BY SHOT",
  },
  {
    icon: LineChart,
    title: "Live KPI dashboard",
    body: "ROAS front and centre. CPA, CTR, hook rate and hold rate alongside. One live view of what every video is moving.",
    stat: "INCLUDED FREE",
  },
  {
    icon: CheckCircle2,
    title: "Produced and shipped",
    body: "Cut, reviewed against the brief, and pushed live. You see exactly what shipped and what it moved.",
    stat: "REVIEWED",
  },
];

const EditorEdge = () => {
  const navigate = useNavigate();
  return (
    <section className="py-16 sm:py-32 bg-foreground text-background">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow" style={{ background: "transparent", borderColor: "hsl(var(--accent))", color: "hsl(var(--accent))" }}>
            CREATIVE DIRECTION · SEE HOW IT WORKS
          </span>
          <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em]">
            Creative decisions driven by <em style={{ color: "hsl(var(--accent))" }}>data</em>, not taste.
          </h2>
          <p className="mt-5 text-[15px] text-background/60 leading-relaxed">
            Every account gets a private performance dashboard, free. Hook rate, hold curve, ROAS, CPA, and delivery in one place, updated in real time. I direct the creative off the same numbers you see.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-background/10 border border-background/10 rounded-[4px] overflow-hidden">
          {principles.map((p, idx) => (
            <div key={p.title} className="bg-foreground p-8 md:p-10">
              <AnimationPlaceholder label={`ANIMATION 0${idx + 4}`} className="mb-7" />
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
            View demo dashboard
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EditorEdge;