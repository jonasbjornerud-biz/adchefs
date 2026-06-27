import { Check } from "lucide-react";

type Props = {
  eyebrow: string;
  title: string;
  items: string[];
};

const ServiceIncludes = ({ eyebrow, title, items }: Props) => {
  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="max-w-[680px]">
          <span
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#75726B",
            }}
          >
            {eyebrow}
          </span>
          <h2
            className="mt-4 text-[30px] md:text-[42px] leading-[1.05] tracking-[-0.02em] font-semibold"
            style={{ fontFamily: "'Inter Tight', sans-serif", color: "#1A1A1A" }}
          >
            {title}
          </h2>
        </div>

        <ul className="mt-12 grid sm:grid-cols-2 gap-x-10 gap-y-5">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-4 pb-5 border-b border-foreground/10"
            >
              <span
                className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                style={{ background: "#9ED8F5", color: "#1A1A1A" }}
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
              <span
                className="text-[15px] leading-snug"
                style={{ color: "#1A1A1A" }}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ServiceIncludes;