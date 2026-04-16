import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$2,000",
    period: "/mo",
    description: "20 videos per month",
    features: [
      "Matched & trained editor",
      "Full brand onboarding",
      "KPI performance training",
      "Performance dashboard access",
      "Free editor replacement",
    ],
    cta: "Book a Call",
    featured: true,
  },
  {
    name: "Scale",
    price: "Custom",
    period: "",
    description: "Custom volume for high-growth brands",
    features: [
      "Everything in Starter",
      "Multiple editors",
      "Priority turnaround",
      "Dedicated account manager",
      "Custom reporting",
    ],
    cta: "Book a Call",
    featured: false,
  },
];

const Pricing = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4 text-center">
          Pay for what you get.
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-lg mx-auto">
          No retainers, no hidden fees. Simple per-video pricing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 transition-all duration-200 ${
                plan.featured
                  ? "border-foreground bg-foreground text-white"
                  : "border-border bg-white hover:border-foreground/20"
              }`}
            >
              <h3 className={`text-lg font-bold mb-1 ${plan.featured ? "text-white" : "text-foreground"}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-6 ${plan.featured ? "text-white/60" : "text-muted-foreground"}`}>
                {plan.description}
              </p>
              <div className="mb-6">
                <span className={`text-4xl font-extrabold ${plan.featured ? "text-white" : "text-foreground"}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.featured ? "text-white/50" : "text-muted-foreground"}`}>
                  {plan.period}
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.featured ? "text-white/60" : "text-foreground/40"}`} />
                    <span className={`text-sm ${plan.featured ? "text-white/80" : "text-muted-foreground"}`}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => scrollToSection("book-a-call")}
                className={`w-full cursor-pointer transition-all duration-200 ${
                  plan.featured
                    ? "bg-white text-foreground hover:bg-white/90"
                    : ""
                }`}
                variant={plan.featured ? "secondary" : "default"}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
