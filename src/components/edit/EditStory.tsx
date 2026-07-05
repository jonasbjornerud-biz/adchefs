import jonasPhoto from "@/assets/jonas.jpg";
import jonasSignature from "@/assets/jonas-signature.png";

const EditStory = () => {
  return (
    <section id="method-story" className="es-section" style={{ background: "var(--es-studio)" }}>
      <div className="mx-auto px-6" style={{ maxWidth: 680 }}>
        <div style={{ border: "1px solid var(--es-ink)" }}>
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{
              borderBottom: "1px solid var(--es-frame)",
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--es-graphite)",
            }}
          >
            <span style={{ color: "var(--es-ink)" }}>SESSION NOTES · HOW IT STARTED</span>
            <span>FILE 01</span>
          </div>

          <div className="p-8 md:p-12">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 overflow-hidden shrink-0" style={{ border: "1px solid var(--es-frame)" }}>
                <img src={jonasPhoto} alt="Jonas Bjørnerud" className="w-full h-full object-cover grayscale" />
              </div>
              <h2
                className="es-display text-[26px] md:text-[34px] leading-[1.05]"
                style={{ color: "var(--es-ink)" }}
              >
                Built by an operator, not an agency.
              </h2>
            </div>

            <div
              className="mt-8 space-y-5 text-[15px] leading-[1.75]"
              style={{ color: "var(--es-graphite)", fontFamily: "Archivo, sans-serif" }}
            >
              <p>
                I'm Jonas. I spent years cutting direct response ads for e-com brands, then more years running a video department and living inside the performance data. Long enough to know what makes someone stop, watch, and actually buy.
              </p>
              <p>
                Every brand I worked with kept hitting the same wall. Freelancers who relearn the brand from zero every quarter. Retainers that bill whether anything ships or not. Briefs filtered through a project manager who has never opened a timeline. So I built AdChefs to strip all of that out.
              </p>
              <p>
                Now I direct the creative and manage the editors myself. I read the numbers, build the angles, and brief shot by shot. When an ad underperforms I know why, and we fix it the same week.
              </p>
            </div>

            <div className="mt-10 flex items-end gap-4">
              <img
                src={jonasSignature}
                alt="Jonas Bjørnerud signature"
                className="h-12 w-auto opacity-90"
                style={{ mixBlendMode: "multiply" }}
              />
              <div className="pb-1">
                <p className="text-[13px] font-medium" style={{ color: "var(--es-ink)" }}>Jonas Bjørnerud</p>
                <p className="es-mono text-[10px] uppercase tracking-[0.18em] mt-0.5" style={{ color: "var(--es-graphite)" }}>
                  JONAS BJØRNERUD · OPERATOR · TRONDHEIM NO
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditStory;