const WhatSeparates = () => {
  return (
    <section id="what-separates" className="py-24 bg-[#0f0f0f] text-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-center text-white">
          Not just editors. Performance-trained operators.
        </h2>
        <p className="text-center text-white/50 mb-20 max-w-2xl mx-auto text-base">
          Every editor we place understands the numbers behind what makes a video convert.
        </p>

        {/* Block A */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="order-2 lg:order-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3 block">
              Built-in Performance Intelligence
            </span>
            <h3 className="text-2xl font-bold text-white mb-4 leading-snug">
              Your editor knows what a 4% CTR looks like. And what it takes to get there.
            </h3>
            <p className="text-white/50 leading-relaxed text-sm">
              Every AdChefs editor trains on a custom KPI dashboard built for e-commerce video. They learn what drives scroll-stops, holds attention past 3 seconds, and pushes viewers to click. Most editors guess. Ours are trained.
            </p>
          </div>
          <div className="order-1 lg:order-2">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center aspect-[4/3] text-white/20 text-sm">
              [ KPI Dashboard screenshot — to be added ]
            </div>
          </div>
        </div>

        {/* Block B */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center aspect-[4/3] text-white/20 text-sm">
              [ Editor Performance Dashboard screenshot — to be added ]
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3 block">
              Full Visibility, Zero Guesswork
            </span>
            <h3 className="text-2xl font-bold text-white mb-4 leading-snug">
              Track output, flag underperformance, and request a replacement — in one place.
            </h3>
            <p className="text-white/50 leading-relaxed text-sm">
              You get access to an editor performance dashboard that logs every video delivered, tracks key metrics over time, and makes it dead simple to spot when something's off. If an editor underperforms, you request a free replacement. No awkward conversations. No lost time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatSeparates;
