import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const BookACall = () => {
  return (
    <section id="book-a-call" className="py-24 bg-secondary/40">
      <div className="container mx-auto px-6 max-w-2xl text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
          Ready to upgrade your creative?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Book a free call to see how AdChefs can place a performance-trained editor with your brand.
        </p>
        <Button
          size="lg"
          className="text-base px-8 py-5 h-auto group cursor-pointer rounded-xl transition-all duration-200 hover:shadow-lg"
          asChild
        >
          <a href="#book-a-call">
            Book a Free Call
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </Button>
      </div>
    </section>
  );
};

export default BookACall;
