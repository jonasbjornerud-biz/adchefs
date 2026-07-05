import { useState } from "react";

const FAQS = [
  { q: "What's the difference between placement and direction?", a: "Placement gives you a dedicated editor who runs your briefs. Direction means I own the creative end to end: research, angles, briefs, performance, and the videos shipped. Placement is the entry point, direction is the full engine." },
  { q: "Can you just direct, or do you produce too?", a: "Both. Direction includes the produced videos. If you only need hands, placement covers that on its own." },
  { q: "How does the pay-per-video model work?", a: "You brief your editor, they deliver, you approve, you pay. From $100 per delivered video. No retainer, no minimum volume, no contract length. Ship ten videos one month and two the next, that's what you pay for." },
  { q: "What's included in the price?", a: "The editor, their management, every license. Higgsfield, ElevenLabs and the professional editing subscriptions are on me. The performance dashboard is free. The only thing you pay for is delivered videos." },
  { q: "How fast is turnaround?", a: "24 to 48 hours standard per video. Anything bigger or longer form gets scoped on the call." },
  { q: "Can you match our existing brand style?", a: "Yes. Your editor goes through your brand folder, your past winners and your ad account before the first cut. Matching the style is part of onboarding, not a line item." },
  { q: "Who owns the footage and final videos?", a: "You do. Everything delivered belongs to your brand. AdChefs is video editing only." },
  { q: "What if I don't click with the editor?", a: "Tell me and I swap them. I run the recruiting funnel continuously, so a replacement is matched fast and onboards from your existing brand docs, not from zero." },
  { q: "What tools do your editors use?", a: "Premiere Pro, CapCut or DaVinci Resolve depending on the format, plus Higgsfield and ElevenLabs where they lift performance. All licenses are on me." },
  { q: "Do you sign NDAs?", a: "Yes, standard practice. Your data, footage and numbers stay inside your account." },
];

const Row = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: "1px solid var(--es-frame)",
        borderLeft: open ? "2px solid var(--es-playhead)" : "2px solid transparent",
        transition: "border-color 150ms ease",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-left py-5 pl-5 pr-3"
        style={{ color: "var(--es-ink)", fontFamily: "Archivo, sans-serif", fontSize: 15, fontWeight: 500 }}
      >
        <span>{q}</span>
        <span
          aria-hidden
          className="es-mono"
          style={{ color: open ? "var(--es-playhead)" : "var(--es-graphite)", fontSize: 18 }}
        >
          {open ? "–" : "+"}
        </span>
      </button>
      {open && (
        <div
          className="pl-5 pr-3 pb-5 text-[14px] leading-relaxed"
          style={{ color: "var(--es-graphite)", fontFamily: "Archivo, sans-serif" }}
        >
          {a}
        </div>
      )}
    </div>
  );
};

const EditFaq = () => {
  return (
    <section id="faq" className="es-section" style={{ background: "var(--es-studio)" }}>
      <div className="es-container">
        <div className="grid md:grid-cols-[1fr_1.6fr] gap-12">
          <div>
            <span className="es-timecode-label">08 · FAQ</span>
            <h2
              className="mt-6 es-display text-[36px] md:text-[44px] leading-[1.02]"
              style={{ color: "var(--es-ink)" }}
            >
              Questions before you book.
            </h2>
            <p className="mt-5 text-[15px]" style={{ color: "var(--es-graphite)", fontFamily: "Archivo, sans-serif" }}>
              If you're not ready to book yet, these usually cover what's left.
            </p>
          </div>

          <div style={{ borderTop: "1px solid var(--es-frame)" }}>
            {FAQS.map((f, i) => <Row key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditFaq;