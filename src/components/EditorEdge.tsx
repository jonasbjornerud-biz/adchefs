import { Eye, Gauge, Headphones, Repeat } from "lucide-react";

const principles = [
  {
    icon: Eye,
    title: "Trained on your KPIs",
    body: "Editors read your dashboard, not your brief. They cut for hook rate, hold rate and BEROAS — and iterate based on what the numbers say.",
    stat: "HOOK 47%",
  },
  {
    icon: Gauge,
    title: "Output that actually ships",
    body: "6–10 cuts per editor per week. 48–72h on first drafts. Same-day revisions. Built for the volume real media buyers need.",
    stat: "48–72H TURNAROUND",
  },
  {
    icon: Headphones,
    title: "Direct line, no PM layer",
    body: "Slack, Notion or whatever you already use. You brief the editor directly. No account manager translating, no agency bottleneck.",
    stat: "1 EDITOR · 1 SLACK",
  },
  {
    icon: Repeat,
    title: "Pay per delivered video",
    body: "Flat rate per cut that ships and is approved. No retainer, no minimum, no contract. You scale up the months you need volume and pause the months you don't.",
    stat: "FROM €100 / VIDEO",
  },
];

const EditorEdge = () => {
  return (
    <section className="py-24 sm:py-32 bg-foreground text-background">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow" style={{ background: "transparent", borderColor: "hsl(var(--background) / 0.2)", color: "hsl(var(--background))" }}>
            What sets us apart
          </span>
          <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em]">
            We ship video. <em style={{ color: "hsl(var(--accent))" }}>We don't talk about it.</em>
          </h2>
          <p className="mt-5 text-[15px] text-background/60 leading-relaxed">
            Built for hook rate, hold rate, BEROAS. Designed for media buyers who measure creative in delivered cuts, not in deliverables decks.
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
      </div>
    </section>
  );
};

export default EditorEdge;