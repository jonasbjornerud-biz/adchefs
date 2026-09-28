import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { getAttribution } from "@/lib/attribution";
import { ArrowRight, Check, Mail, Phone } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import HeroBackground from "@/components/HeroBackground";
import jonasPhoto from "@/assets/jonas.jpg";

const PHONE_DISPLAY = "+47 942 58 751";
const PHONE_HREF = "tel:+4794258751";

const BUDGET_OPTIONS = [
  "Under 20 000 kr/mnd",
  "20 000 til 50 000 kr/mnd",
  "Over 50 000 kr/mnd",
  "Engangsprosjekt",
];

const HEARD_OPTIONS = [
  "Google",
  "LinkedIn",
  "Instagram",
  "Facebook",
  "Anbefaling",
  "Annet",
];

const inputClass =
  "rounded-[4px] border-foreground/20 bg-background text-[14px] h-11 placeholder:text-foreground/40 focus-visible:ring-accent/60";

const emptyForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  website: "",
  message: "",
  budget: "",
  how_did_you_hear: "",
  consent: false,
};

const Contact = () => {
  const [formData, setFormData] = useState(emptyForm);
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

    const honeypot =
      (e.currentTarget.elements.namedItem("company_fax") as HTMLInputElement)?.value ?? "";

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
    const { consent: _c, ...fields } = formData;
    const body = {
      ...Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, String(v).trim()])),
      ...getAttribution(),
      company_fax: honeypot,
    };
    try {
      await supabase.functions.invoke("contact-intake", { body });
    } catch {
      // Server queues failures for retry; visitor always sees thank-you.
    }
    // Keep the email notification to Jonas as before (best effort).
    if (!honeypot) {
      supabase.functions
        .invoke("send-transactional-email", {
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
        })
        .catch(() => {});
    }
    setSent(true);
    setFormData(emptyForm);
    setSubmitting(false);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-clip">
      <SEO
        title="Contact — AdChefs"
        description="Get in touch with AdChefs. Email or message Jonas directly — creative strategy and production for 7–8 figure DTC brands."
        path="/contact"
      />

      {/* Hero blue gradient as the page background */}
      <div className="absolute inset-0 z-0" aria-hidden>
        <HeroBackground />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navigation />

        <main className="flex-1">
          <section className="pt-36 md:pt-44 pb-20 sm:pb-28">
            <div className="mx-auto max-w-[1200px] px-6">
              <div className="grid lg:grid-cols-[1fr_1.1fr] gap-14 lg:gap-20 items-start">
                {/* LEFT: intro + direct contact */}
                <div>
                  <h1 className="font-display text-[36px] md:text-[48px] leading-[1.05] tracking-[-0.02em] text-foreground">
                    Let's see if we're a <em>fit</em>.
                  </h1>
                  <p className="mt-5 text-[15px] text-foreground/80 leading-relaxed max-w-md">
                    On the first call I get a clear picture of your creative situation, run a quick audit of what you're currently running, and understand your goals, then we decide if we're a fit.
                  </p>

                  <div className="mt-10">
                    <p className="mono text-[11px] uppercase tracking-[0.15em] text-foreground/70 mb-3">
                      Reach out if
                    </p>
                    <ul className="space-y-2.5 text-[14px] text-foreground/85">
                      <li className="flex items-start gap-3">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        You spend $5K+ a month on ads and your winners fatigue faster than you can replace them
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        You want strategy and production owned by one person, not split across an agency
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        You care about what converts, not just what gets delivered
                      </li>
                    </ul>
                  </div>

                  <div className="mt-10 pt-8 border-t border-foreground/10 space-y-3">
                    <p className="mono text-[11px] uppercase tracking-[0.15em] text-foreground/70">
                      Direct
                    </p>
                    <a
                      href="mailto:jonas@adchefs.com"
                      className="flex items-center gap-3 text-[15px] text-foreground hover:text-foreground/60 transition-colors w-fit"
                    >
                      <Mail className="h-4 w-4 text-foreground/60" />
                      jonas@adchefs.com
                    </a>
                    <a
                      href={PHONE_HREF}
                      className="flex items-center gap-3 text-[15px] text-foreground hover:text-foreground/60 transition-colors w-fit"
                    >
                      <Phone className="h-4 w-4 text-foreground/60" />
                      {PHONE_DISPLAY}
                    </a>
                    <div className="pt-6">
                      <div className="w-24 h-24 rounded-full overflow-hidden border border-foreground/15">
                        <img
                          src={jonasPhoto}
                          alt="Jonas Bjørnerud"
                          className="w-full h-full object-cover grayscale"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: form */}
                <div className="rounded-[4px] border border-foreground/15 bg-background/80 backdrop-blur-sm p-6 sm:p-10">
                  {sent ? (
                    <div className="flex flex-col items-center justify-center text-center py-16">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                        <Check className="h-6 w-6 text-foreground" />
                      </span>
                      <h2 className="mt-6 font-display text-[24px] tracking-[-0.02em] text-foreground">
                        Message sent.
                      </h2>
                      <p className="mt-3 text-[14px] text-foreground/70 max-w-sm">
                        Thanks for reaching out. I'll read it and reply within one working day.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        className="hidden"
                        aria-hidden="true"
                      />

                      <Input
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full name *"
                        aria-label="Full name"
                        className={inputClass}
                      />
                      <Input
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Company"
                        aria-label="Company"
                        className={inputClass}
                      />
                      <Input
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email *"
                        aria-label="Email"
                        className={inputClass}
                      />
                      <Textarea
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="What do you need help with? *"
                        aria-label="What do you need help with?"
                        className="min-h-[130px] resize-none rounded-[4px] border-foreground/20 bg-background text-[14px] placeholder:text-foreground/40 focus-visible:ring-accent/60"
                      />

                      <label
                        htmlFor="contact-consent"
                        className="flex items-start gap-3 text-[13px] text-foreground/70 cursor-pointer"
                      >
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
                        <Button
                          type="submit"
                          variant="cta"
                          size="lg"
                          disabled={submitting}
                          className="gap-[10px] px-7"
                        >
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
        </main>

        <Footer variant="dark" />
      </div>
    </div>
  );
};

export default Contact;
