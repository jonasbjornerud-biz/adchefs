import { ArrowRight } from "lucide-react";

const roles = [
  "Creative strategist",
  "Researcher",
  "Brief writer",
  "Editor manager",
  "Performance analyst",
  "Creative producer",
];

const CSMath = () => {
  return (
    <section className="py-24 sm:py-32" style={{ background: "#F7F6F3" }}>
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="text-center max-w-[720px] mx-auto">
          <span className="eyebrow">THE MATH</span>
          <h2
            className="mt-5 text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.05] tracking-[-0.025em] font-semibold"
            style={{ fontFamily: "'Inter Tight', sans-serif", color: "#1A1A1A" }}
          >
            What one operator{" "}
            <em
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 }}
            >
              replaces
            </em>
            .
          </h2>
          <p
            className="mt-5 text-[16px] leading-relaxed max-w-[560px] mx-auto"
            style={{ color: "#75726B" }}
          >
            The roles a brand usually splits across an in house team or an ad hoc roster, collapsed into one seat owning the number.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_auto_1fr] items-stretch">
          {/* Roles list */}
          <div
            className="rounded-[4px] p-6 sm:p-8"
            style={{ background: "#EEEDE8", border: "1px solid rgba(26,26,26,0.06)" }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#75726B",
              }}
            >
              Usually six seats
            </span>
            <ul className="mt-5 flex flex-col">
              {roles.map((r, i) => (
                <li
                  key={r}
                  className="flex items-center justify-between py-3 text-[15px]"
                  style={{
                    color: "#1A1A1A",
                    borderTop: i === 0 ? "none" : "1px solid rgba(26,26,26,0.08)",
                  }}
                >
                  <span>{r}</span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      color: "#75726B",
                    }}
                  >
                    0{i + 1}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <div
              className="flex flex-col items-center gap-2 px-4"
              style={{ color: "#75726B" }}
            >
              <span
                className="hidden lg:flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: "#EEEDE8", border: "1px solid rgba(26,26,26,0.08)" }}
              >
                <ArrowRight className="h-4 w-4" />
              </span>
              <span
                className="lg:hidden h-px w-24"
                style={{ background: "rgba(26,26,26,0.15)" }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                }}
              >
                Collapses into
              </span>
            </div>
          </div>

          {/* ONE OPERATOR card */}
          <div
            className="relative overflow-hidden rounded-[4px] p-8 sm:p-10 flex flex-col justify-between"
            style={{ background: "#1A1A1A", color: "#F7F6F3", minHeight: 360 }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 80% 0%, rgba(158,216,245,0.18) 0%, transparent 55%)",
              }}
            />
            <div className="relative">
              <span
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#9ED8F5",
                }}
              >
                One operator
              </span>
              <h3
                className="mt-5 text-[36px] sm:text-[44px] leading-[1.02] tracking-[-0.02em] font-semibold"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                One seat.{" "}
                <em
                  style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 }}
                >
                  One number.
                </em>
              </h3>
              <p
                className="mt-5 text-[15px] leading-relaxed"
                style={{ color: "rgba(247,246,243,0.72)" }}
              >
                Research, angles, briefs, produced video, and the weekly read on what is actually moving. Owned end to end.
              </p>
            </div>

            <div className="relative mt-8 grid grid-cols-3 gap-3">
              {["Hook", "Hold", "ROAS"].map((k) => (
                <div
                  key={k}
                  className="rounded-[4px] p-3"
                  style={{
                    background: "rgba(247,246,243,0.05)",
                    border: "1px solid rgba(247,246,243,0.08)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                      fontSize: 9,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "rgba(247,246,243,0.55)",
                    }}
                  >
                    {k}
                  </span>
                  <div
                    className="mt-2 h-1.5 w-full rounded-full overflow-hidden"
                    style={{ background: "rgba(247,246,243,0.08)" }}
                  >
                    <div
                      className="h-full"
                      style={{ background: "#9ED8F5", width: "62%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CSMath;