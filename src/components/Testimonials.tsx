import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "AdChefs transformed our content strategy. We went from struggling to produce 5 videos a month to confidently delivering 50+ high-quality ads. The ROI has been incredible.",
    author: "Sarah Chen",
    role: "CMO, Urban Threads",
    rating: 5,
  },
  {
    quote: "The combination of AI efficiency and human creativity is unmatched. Our team finally has the bandwidth to focus on strategy while AdChefs handles the execution.",
    author: "Michael Rodriguez",
    role: "Growth Director, PureGlow Beauty",
    rating: 5,
  },
  {
    quote: "Game-changer for our brand. Production quality rivals our in-house work, but at a fraction of the time and cost. The editor team truly understands our vision.",
    author: "Emily Foster",
    role: "VP Marketing, TechNest Home",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Trusted by Leading Brands</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what our clients say about working with AdChefs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="border-2 hover:shadow-lg transition-shadow animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardContent className="p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                
                <p className="text-foreground leading-relaxed mb-6 text-lg">
                  "{testimonial.quote}"
                </p>
                
                <div>
                  <div className="font-bold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
