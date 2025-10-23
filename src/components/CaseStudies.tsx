import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const caseStudies = [
  {
    brand: "Urban Threads",
    category: "Fashion E-commerce",
    result: "300% increase in video ad engagement",
    metric: "+185% ROAS",
    description: "Scaled from 5 to 50+ videos per month while maintaining brand quality and reducing production costs by 60%.",
  },
  {
    brand: "PureGlow Beauty",
    category: "Cosmetics Brand",
    result: "Cut production time by 80%",
    metric: "2.5x conversions",
    description: "Launched 12 product campaigns in Q1 with AI-assisted editing, achieving record-breaking engagement rates.",
  },
  {
    brand: "TechNest Home",
    category: "Smart Home Tech",
    result: "500+ videos delivered in 6 months",
    metric: "+220% reach",
    description: "Automated tutorial and demo video production, enabling rapid expansion across multiple product lines.",
  },
];

const CaseStudies = () => {
  return (
    <section id="case-studies" className="py-24 bg-neutral-950/80">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Results That Matter</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how leading e-commerce brands are scaling with AdChefs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {caseStudies.map((study, index) => (
            <Card 
              key={index}
              className="bg-card/50 backdrop-blur-sm border border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardContent className="p-8">
                <div className="mb-4">
                  <span className="text-sm font-medium text-accent uppercase tracking-wide">
                    {study.category}
                  </span>
                  <h3 className="text-2xl font-bold mt-2 mb-4">{study.brand}</h3>
                </div>
                
                <div className="mb-6 p-4 bg-accent/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    <span className="font-bold text-lg">{study.metric}</span>
                  </div>
                  <p className="text-sm font-medium">{study.result}</p>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  {study.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
