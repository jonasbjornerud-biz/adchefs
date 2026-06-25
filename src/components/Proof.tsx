const rows: { ad: string; roas: string; ctr: string; hook: string; results: string; cpr: string; spend: string }[] = [
  // REPLACE WITH CONFIRMED NUMBERS
  {
    ad: "SE.80",
    roas: "2.52",
    ctr: "4.20%",
    hook: "—",
    results: "848 purchases",
    cpr: "$—",
    spend: "~$17,000",
  },
];

const Proof = () => {
  return (
    <section className="py-16 sm:py-32 bg-background">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl mb-12">
          <span className="eyebrow">PROOF</span>
          <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
            Real spend, real <em>results</em>.
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
            One account, the full picture. More as they clear for publishing.
          </p>
        </div>

        {/* Case study card — leave room for 2 to 3 more rows or sibling cards */}
        <div className="rounded-[4px] border border-foreground/10 bg-card overflow-hidden">
          <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-foreground/10">
            <div className="flex items-center gap-3">
              <span className="eyebrow eyebrow-accent">CASE STUDY</span>
              <span className="mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                DTC Wellness Brand
              </span>
            </div>
            <span className="mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              Pending publish
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-foreground/10">
                  {[
                    "Ad name",
                    "ROAS",
                    "CTR",
                    "Hook Rate",
                    "Results",
                    "Cost per result",
                    "Amount spent",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 md:px-8 py-4 mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-normal whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr
                    key={i}
                    className="border-b border-foreground/5 last:border-b-0"
                  >
                    <td className="px-6 md:px-8 py-5 text-[14px] font-medium text-foreground whitespace-nowrap">
                      {r.ad}
                    </td>
                    <td className="px-6 md:px-8 py-5 text-[14px] text-foreground tabular-nums">{r.roas}</td>
                    <td className="px-6 md:px-8 py-5 text-[14px] text-foreground tabular-nums">{r.ctr}</td>
                    <td className="px-6 md:px-8 py-5 text-[14px] text-foreground tabular-nums">{r.hook}</td>
                    <td className="px-6 md:px-8 py-5 text-[14px] text-foreground whitespace-nowrap">{r.results}</td>
                    <td className="px-6 md:px-8 py-5 text-[14px] text-foreground tabular-nums">{r.cpr}</td>
                    <td className="px-6 md:px-8 py-5 text-[14px] text-foreground tabular-nums whitespace-nowrap">{r.spend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Proof;