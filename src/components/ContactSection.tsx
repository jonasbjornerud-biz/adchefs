import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Check } from "lucide-react";

const inputClass =
  "rounded-[4px] border-foreground/20 bg-background text-[14px] h-11 focus-visible:ring-accent/60";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    message: "",
    consent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const honeypot = (e.currentTarget.elements.namedItem("website") as HTMLInputElement)?.value;
    if (honeypot) return;

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please fill in your name, email, and message.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!formData.consent) {
      setError("Please accept that AdChefs may store your details to reply.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: fnError } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "contact-notification",
          recipientEmail: "jonas@adchefs.com",
          idempotencyKey: `contact-${crypto.randomUUID()}`,
          templateData: {
            name: formData.name.trim(),
            company: formData.company.trim(),
            email: formData.email.trim(),
            message: formData.message.trim(),
          },
        },
      });
      if (fnError) throw fnError;
      setSent(true);
      setFormData({ name: "", company: "", email: "", message: "", consent: false });
    } catch {
      setError("Something went wrong. Email me directly at jonas@adchefs.com.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-32 bg-secondary border-y border-foreground/10">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
          <div>
            <span className="eyebrow eyebrow-accent">Contact</span>
            <h2 className="mt-5 font-display text-[32px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
              Let's see if we're a fit.
            </h2>
            <p className="mt-5 text-[15px] text-foreground/80 leading-relaxed max-w-md">
              I take on 1 to 2 new brands a month. When the slots are gone, they're gone. Send a message and I'll get back to you within one working day.
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <p className="mono text-[11px] uppercase tracking-[0.15em] text-foreground/70 mb-3">Reach out if</p>
                <ul className="space-y-2 text-[14px] text-foreground/85">
                  <li>· You spend $5K+ a month on ads and your winners fatigue faster than you can replace them</li>
                  <li>· You want strategy and production owned by one person, not split across an agency</li>
                  <li>· You care about what converts, not just what gets delivered</li>
                </ul>
              </div>

              <div>
                <p className="mono text-[11px] uppercase tracking-[0.15em] text-foreground/70 mb-3">What happens next</p>
                <ul className="space-y-2 text-[14px] text-foreground/85">
                  <li>· I read your message and reply within one working day</li>
                  <li>· If we are a fit, we scope a Sprint on a short call</li>
                  <li>· If not, I point you somewhere better</li>
                </ul>
              </div>

              <p className="text-[13px] text-foreground/60 italic">
                Prefer email? Reach me directly at{" "}
                <a href="mailto:jonas@adchefs.com" className="underline underline-offset-2 hover:text-foreground transition-colors">
                  jonas@adchefs.com
                </a>
                . No pitch deck.
              </p>
            </div>
          </div>

          <div className="rounded-[4px] border border-foreground/15 bg-background p-6 sm:p-10">
            {sent ? (
              <div className="flex flex-col items-center justify-center text-center py-16">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                  <Check className="h-6 w-6 text-foreground" />
                </span>
                <h3 className="mt-6 font-display text-[24px] tracking-[-0.02em] text-foreground">Message sent.</h3>
                <p className="mt-3 text-[14px] text-foreground/70 max-w-sm">
                  Thanks for reaching out. I'll read it and reply within one working day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className="mono text-[11px] uppercase tracking-[0.15em] text-foreground/70">
                      Full name *
                    </label>
                    <Input
                      id="contact-name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-company" className="mono text-[11px] uppercase tracking-[0.15em] text-foreground/70">
                      Company
                    </label>
                    <Input
                      id="contact-company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your brand"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-email" className="mono text-[11px] uppercase tracking-[0.15em] text-foreground/70">
                    Email *
                  </label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@brand.com"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-message" className="mono text-[11px] uppercase tracking-[0.15em] text-foreground/70">
                    What do you need help with? *
                  </label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your current ad spend, what's fatiguing, and what you want shipped."
                    className="min-h-[130px] resize-none rounded-[4px] border-foreground/20 bg-background text-[14px] focus-visible:ring-accent/60"
                  />
                </div>

                <label htmlFor="contact-consent" className="flex items-start gap-3 text-[13px] text-foreground/70 cursor-pointer">
                  <input
                    id="contact-consent"
                    name="consent"
                    type="checkbox"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 rounded-[4px] border-foreground/30 accent-[#9ED8F5]"
                  />
                  I accept that AdChefs stores my details to respond to this message.
                </label>

                {error && <p className="text-[13px] text-red-600">{error}</p>}

                <div className="pt-1">
                  <Button type="submit" variant="cta" size="lg" disabled={submitting} className="gap-[10px] px-7">
                    {submitting ? "Sending..." : "Send message"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <p className="mt-4 text-[12px] text-foreground/50">
                    I normally reply within one working day.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
