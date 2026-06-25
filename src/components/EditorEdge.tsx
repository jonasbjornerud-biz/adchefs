import { Eye, Film, LineChart, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AnimationPlaceholder from "./AnimationPlaceholder";

const steps = [
  {
    step: "01",
    icon: LineChart,
    title: "Read the numbers",
    body: "Every decision starts in your live dashboard. Hook rate, hold curve, ROAS, CPA and delivery, front and centre. No spreadsheets.",
    stat: "INCLUDED FREE",
    animLabel: "ANIMATION 04",
  },
  {
    step: "02",
    icon: Eye,
    title: "Build the angle",
    body: "I read what your winners share, then build the next angles from the patterns in the data, not from taste.",
    stat: "HOOK · HOLD · ROAS",
    animLabel: "ANIMATION 05",
  },
  {
    step: "03",
    icon: Film,
    title: "Brief it like an editor",
    body: "Editors get more than a script. They get shot by shot direction, because I have spent years in the timeline myself.",
    stat: "SHOT BY SHOT",
    animLabel: "ANIMATION 06",
  },
  {
    step: "04",
    icon: CheckCircle2,
    title: "Ship and measure",
    body: "Cut, reviewed against the brief, and pushed live. The results land back in the dashboard, and the loop starts again.",
    stat: "REVIEWED",
    animLabel: "ANIMATION 07",
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
            Creative built on <em style={{ color: "hsl(var(--accent))" }}>data</em>, not taste.
          </h2>
          <p className="mt-5 text-[15px] text-background/60 leading-relaxed">
            Every account gets a private dashboard, free. Hook rate, hold curve, ROAS, CPA and delivery in one place, updated live. I direct the creative off the same numbers you see, so we are always working from one source of truth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-background/10 border border-background/10 rounded-[4px] overflow-hidden">
          {steps.map((p) => (
            <div key={p.title} className="bg-foreground p-8 md:p-10">
              <AnimationPlaceholder label={p.animLabel} className="mb-7" />
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent/70">STEP {p.step}</span>
                  <p.icon className="w-5 h-5 text-accent" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">{p.stat}</span>
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
