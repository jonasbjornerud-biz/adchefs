import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUp, CheckCircle2, CircleAlert, Clapperboard, UserRound } from "lucide-react";
import adchefsLogoLight from "@/assets/adchefs-logo-light.png.asset.json";
import { z } from "zod";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import CountryCombobox from "@/components/jobs/CountryCombobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const requiredText = (label: string, max = 2000) => z.string().trim().min(1, `${label} is required`).max(max, `${label} is too long`);
const schema = z.object({
  first_name: requiredText("First name", 80),
  last_name: requiredText("Last name", 80),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email").max(255),
  country: requiredText("Country", 100),
  age: z.coerce.number().int().min(18, "You must be at least 18").max(100, "Enter a valid age"),
  city: requiredText("City", 100),
  referral_source: z.enum(["LinkedIn", "OnlineJobs", "YTJobs", "Indeed", "Other"], { required_error: "Select where you heard about the job" }),
  software: requiredText("Editing software", 80),
  capacity_hours: z.number().int().min(5).max(60),
  years_experience: z.number().int().min(0).max(10),
  weekly_video_capacity: z.number().int().min(1).max(15),
  gpu: requiredText("Graphics card", 120),
  cpu: requiredText("Processor", 120),
  ram: requiredText("RAM", 80),
  internet_mbps: z.coerce.number().int().min(1, "Internet speed is required").max(100000, "Enter a valid internet speed"),
  ai_tools_usage: requiredText("AI tools answer"),
  ad_quality_answer: requiredText("Ad quality answer"),
  portfolio_url: z.string().trim().min(1, "Portfolio link is required").url("Enter a valid portfolio URL").max(500),
  about_self: requiredText("About you"),
  start_timing: z.enum(["As soon as possible", "Within a week", "Within two weeks", "Within a month", "More than a month"], { required_error: "Select when you can start" }),
  best_ad_url: z.string().trim().min(1, "Best ad link is required").url("Enter a valid ad URL").max(500),
});

type FormState = {
  first_name: string; last_name: string; email: string; country: string; age: string; city: string;
  referral_source: "LinkedIn" | "OnlineJobs" | "YTJobs" | "Indeed" | "Other" | undefined;
  software: string; capacity_hours: number; years_experience: number; weekly_video_capacity: number;
  gpu: string; cpu: string; ram: string; internet_mbps: string; ai_tools_usage: string;
  ad_quality_answer: string; portfolio_url: string; about_self: string;
  start_timing: "As soon as possible" | "Within a week" | "Within two weeks" | "Within a month" | "More than a month" | undefined;
  best_ad_url: string;
};
type ErrorState = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  first_name: "", last_name: "", email: "", country: "", age: "", city: "", referral_source: undefined,
  software: "", capacity_hours: 40, years_experience: 5, weekly_video_capacity: 8,
  gpu: "", cpu: "", ram: "", internet_mbps: "", ai_tools_usage: "", ad_quality_answer: "",
  portfolio_url: "", about_self: "", start_timing: undefined, best_ad_url: "",
};

interface Posting {
  id: string;
  title: string;
  description: string;
  junior_pay: string | null;
  senior_pay: string | null;
  created_at?: string | null;
  expires_at?: string | null;
}

const JOB_REELS = [
  { id: "AC1_r0bbjh", label: "Ad example one" },
  { id: "AC3_wa3d0v", label: "Ad example two" },
  { id: "AC5_v65ofr", label: "Ad example three" },
].map((reel) => ({
  ...reel,
  video: `https://res.cloudinary.com/dqnifzwda/video/upload/so_0,eo_8,w_480,q_auto,f_auto,ac_none/${reel.id}.mp4`,
  poster: `https://res.cloudinary.com/dqnifzwda/video/upload/so_1,w_480,q_auto,f_auto/${reel.id}.jpg`,
}));

// Editable hero data-card values
const HERO_STATS = {
  hookRate: { label: "Hook rate", value: "38%" },
  ctr: { label: "CTR", value: "2.4%", sparkline: [1.2, 1.5, 1.4, 1.9, 1.7, 2.1, 2.4] },
};

function useCanPlayVideo() {
  const [canPlay, setCanPlay] = useState(false);
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setCanPlay(!mobile.matches && !reducedMotion.matches);
    update();
    mobile.addEventListener("change", update);
    reducedMotion.addEventListener("change", update);
    return () => {
      mobile.removeEventListener("change", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, []);
  return canPlay;
}

function JobReel({ reel, position, videoRef }: { reel: typeof JOB_REELS[number]; position: "left" | "center" | "right"; videoRef?: (el: HTMLVideoElement | null) => void }) {
  const showVideo = useCanPlayVideo();
  return (
    <div className={cn("job-phone-wrap", { left: "job-phone-wrap-left", center: "job-phone-wrap-center", right: "job-phone-wrap-right" }[position])}>
      <figure className="job-phone">
        <img src={reel.poster} alt={reel.label} loading={position === "center" ? "eager" : "lazy"} className="h-full w-full object-cover" />
        {showVideo ? (
          <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" poster={reel.poster} muted autoPlay loop playsInline preload="none" aria-label={reel.label}>
            <source src={reel.video} type="video/mp4" />
          </video>
        ) : null}
        <span aria-hidden="true" className="job-phone-island" />
      </figure>
    </div>
  );
}

function Sparkline({ points }: { points: number[] }) {
  const min = Math.min(...points), max = Math.max(...points);
  const d = points.map((v, i) => `${i ? "L" : "M"}${(i / (points.length - 1)) * 56},${18 - ((v - min) / (max - min || 1)) * 16}`).join(" ");
  return <svg viewBox="0 0 56 20" className="job-spark h-5 w-14" aria-hidden="true"><path d={d} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}


function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1.5 text-xs text-destructive">{message}</p> : null;
}

function SectionHeading({ number, title, description, icon: Icon }: { number: string; title: string; description: string; icon: typeof UserRound }) {
  return (
    <div className="mb-8 flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border border-accent-deep/25 bg-accent/35 text-accent-deep">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className="mono text-[10px] uppercase text-muted-foreground">{number}</span>
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function RangeField({ label, value, min, max, suffix, onChange }: { label: string; value: number; min: number; max: number; suffix: string; onChange: (value: number) => void }) {
  return (
    <div className="space-y-4">
      <Label>{label} *</Label>
      <div className="flex items-center gap-4">
        <Slider value={[value]} min={min} max={max} step={1} onValueChange={(next) => onChange(next[0] ?? value)} aria-label={label} className="flex-1" />
        <output className="flex h-11 min-w-[92px] items-center justify-center rounded-[4px] border border-border bg-secondary px-3 text-sm font-semibold">
          {value} {suffix}
        </output>
      </div>
    </div>
  );
}

export default function JobDetail() {
  const { slug } = useParams();
  const [posting, setPosting] = useState<Posting | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<ErrorState>({});

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    void (async () => {
      const { data } = await supabase.rpc("get_active_job_posting", { _slug: slug });
      const row = Array.isArray(data) ? data[0] : data;
      setPosting((row as Posting | undefined) ?? null);
      setLoading(false);
    })();
  }, [slug]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: ErrorState = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof FormState | undefined;
        if (key && !nextErrors[key]) nextErrors[key] = issue.message;
      });
      setErrors(nextErrors);
      toast.error("Please complete every required field");
      const firstInvalid = document.querySelector('[aria-invalid="true"]');
      firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!posting) return;
    setSubmitting(true);
    const data = parsed.data;
    const { error } = await supabase.from("applications").insert([{
      job_posting_id: posting.id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      country: data.country,
      age: data.age,
      city: data.city,
      referral_source: data.referral_source,
      software: data.software,
      availability: `${data.capacity_hours} hours per week`,
      capacity_hours: data.capacity_hours,
      years_experience: String(data.years_experience),
      weekly_video_capacity: data.weekly_video_capacity,
      gpu: data.gpu,
      cpu: data.cpu,
      ram: data.ram,
      internet_mbps: data.internet_mbps,
      ai_tools_usage: data.ai_tools_usage,
      ad_quality_answer: data.ad_quality_answer,
      portfolio_url: data.portfolio_url,
      about_self: data.about_self,
      start_timing: data.start_timing,
      best_ad_url: data.best_ad_url,
      additional_info: data.about_self,
    }]);
    setSubmitting(false);
    if (error) { toast.error("Could not submit. Please check your answers and try again."); return; }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background mono text-xs uppercase text-muted-foreground">Loading…</div>;
  if (!posting) return <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">Role not found. <Link to="/jobs" className="ml-2 underline">Back to jobs</Link></div>;
  if (submitted) return (
    <div className="flex min-h-screen items-center justify-center bg-foreground px-6 text-background">
      <div className="max-w-lg text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-[4px] bg-accent text-foreground"><CheckCircle2 className="h-7 w-7" /></div>
        <span className="eyebrow eyebrow-accent">Application received</span>
        <h1 className="mt-5 font-display text-[36px] leading-[1.05] md:text-[44px]">You're <em className="text-accent">in</em> the pool.</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-background/70">Every application gets eyes. If your work fits, you'll hear from us within 48 hours with a paid trial task.</p>
      </div>
    </div>
  );

  const jobJsonLd = { "@context": "https://schema.org", "@type": "JobPosting", title: posting.title, description: posting.description, datePosted: (posting.created_at ?? new Date().toISOString()).slice(0, 10), employmentType: "CONTRACTOR", hiringOrganization: { "@type": "Organization", name: "AdChefs", sameAs: "https://adchefs.com" }, jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "Anywhere" } };
  const inputClass = "h-11 rounded-[4px] bg-card";
  const field = (key: keyof FormState) => ({ "aria-invalid": Boolean(errors[key]), className: cn(inputClass, errors[key] && "border-destructive") });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title={`${posting.title} — Remote Role at AdChefs`} description={(posting.description || "").replace(/\s+/g, " ").trim().slice(0, 155) || `Apply for the ${posting.title} role at AdChefs.`} path={`/jobs/${slug}`} jsonLd={jobJsonLd} />
      <section className="job-hero relative flex flex-col overflow-hidden border-b border-foreground bg-foreground text-background">
        <div className="hero-grain" aria-hidden="true" />
        <div className="relative z-10 mx-auto flex w-full max-w-[1180px] flex-1 flex-col px-5 md:px-8">
          <header className="flex items-center justify-between border-b border-background/10 py-5">
            <Link to="/jobs" className="inline-flex items-center text-sm text-background/60 transition-colors hover:text-background"><ArrowLeft className="mr-2 h-4 w-4" />All roles</Link>
            <Link to="/" aria-label="AdChefs home"><img src={adchefsLogoLight.url} alt="AdChefs" className="h-8 w-auto md:h-9" /></Link>
          </header>
          <div className="grid gap-8 pb-16 pt-12 md:grid-cols-[55fr_45fr] md:items-start md:gap-6 md:pb-20 md:pt-16">
            <div className="relative z-20">
              <div className="flex items-center gap-3 mono text-[10px] uppercase text-background/60">
                <span className="h-2 w-2 bg-accent" />
                <span>AdChefs careers</span>
                <span className="h-px w-9 bg-background/30" />
                <span>Open role</span>
              </div>
              <h1 className="mt-8 max-w-[680px] text-[50px] font-semibold leading-[0.95] text-background md:text-[60px] lg:whitespace-nowrap lg:text-[68px]"><em className="serif-em text-background">{posting.title.split(":")[0]}</em></h1>
              <p className="mt-7 max-w-[560px] text-[16px] leading-relaxed text-background/70 [text-wrap:balance] md:text-lg">Edit performance ads with us and learn from the data behind every cut.</p>
              <div className="mt-7 flex max-w-[620px] flex-wrap gap-2">
                {["Remote", "Pay per video"].map((chip) => <span key={chip} className="rounded-full border border-background/10 bg-background/[0.1] px-3.5 py-2 mono text-[10.5px] uppercase text-background/90">{chip}</span>)}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Button asChild variant="accent" size="lg"><a href="#apply" onClick={(event) => { event.preventDefault(); document.querySelector("#apply")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); }}>Apply now <ArrowRight /></a></Button>
              </div>
            </div>
            <div id="example-ads" className="relative min-w-0 scroll-mt-6" aria-label="Example ads">
              <div className="job-hero-glow" aria-hidden="true" />
              <div className="job-phone-stage">
                <JobReel reel={JOB_REELS[1]} position="left" />
                <JobReel reel={JOB_REELS[2]} position="right" />
                <JobReel reel={JOB_REELS[0]} position="center" />
                <div className="job-stat job-stat-hook">
                  <span className="mono text-[9px] uppercase text-background/60">{HERO_STATS.hookRate.label}</span>
                  <span className="mt-1 flex items-center gap-1.5 font-display text-[28px] font-semibold leading-none text-background">{HERO_STATS.hookRate.value}<ArrowUp className="job-stat-up h-4 w-4" strokeWidth={2.5} /></span>
                </div>
                <div className="job-stat job-stat-ctr">
                  <span className="mono text-[9px] uppercase text-background/60">{HERO_STATS.ctr.label}</span>
                  <span className="mt-1 flex items-end gap-3 font-display text-[22px] font-semibold leading-none text-background">{HERO_STATS.ctr.value}<Sparkline points={HERO_STATS.ctr.sparkline} /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main id="apply" className="mx-auto max-w-[850px] px-5 py-14 md:py-20">
        <div className="mx-auto max-w-[690px] border-b border-border pb-10">
          <p className="font-display text-xl font-semibold leading-snug md:text-2xl">Tell us who you are, show us your work, and we'll get back to you within 48 hours.</p>
          <div className="mt-5 flex gap-3 text-sm leading-relaxed text-muted-foreground"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /><p>Applications sent by email are not considered. We only review applications submitted through this form.</p></div>
        </div>

        <form onSubmit={onSubmit} noValidate className="mt-10 space-y-6">
          <section className="rounded-[4px] border border-border bg-card p-6 md:p-8">
            <SectionHeading number="01" title="About you" description="The basics, so we know who we're talking to." icon={UserRound} />
            <div className="grid gap-5 sm:grid-cols-2">
              <div><Label htmlFor="first_name">First name *</Label><Input id="first_name" maxLength={80} value={form.first_name} onChange={(e) => update("first_name", e.target.value)} {...field("first_name")} /><FieldError message={errors.first_name} /></div>
              <div><Label htmlFor="last_name">Last name *</Label><Input id="last_name" maxLength={80} value={form.last_name} onChange={(e) => update("last_name", e.target.value)} {...field("last_name")} /><FieldError message={errors.last_name} /></div>
              <div><Label htmlFor="email">Email address *</Label><Input id="email" type="email" maxLength={255} value={form.email} onChange={(e) => update("email", e.target.value)} {...field("email")} /><FieldError message={errors.email} /></div>
              <div><Label>Which country are you from? *</Label><div className="mt-2"><CountryCombobox value={form.country} onChange={(value) => update("country", value)} invalid={Boolean(errors.country)} /></div><FieldError message={errors.country} /></div>
              <div><Label htmlFor="age">Age *</Label><Input id="age" type="number" min={18} max={100} value={form.age} onChange={(e) => update("age", e.target.value)} {...field("age")} /><FieldError message={errors.age} /></div>
              <div><Label htmlFor="city">City *</Label><Input id="city" maxLength={100} value={form.city} onChange={(e) => update("city", e.target.value)} {...field("city")} /><FieldError message={errors.city} /></div>
              <div className="sm:col-span-2"><Label>Where did you hear about this job? *</Label><Select value={form.referral_source} onValueChange={(value) => update("referral_source", value as FormState["referral_source"])}><SelectTrigger aria-invalid={Boolean(errors.referral_source)} className={cn("mt-2 h-11 rounded-[4px] bg-card", errors.referral_source && "border-destructive")}><SelectValue placeholder="Select one" /></SelectTrigger><SelectContent>{["LinkedIn", "OnlineJobs", "YTJobs", "Indeed", "Other"].map((source) => <SelectItem key={source} value={source}>{source}</SelectItem>)}</SelectContent></Select><FieldError message={errors.referral_source} /></div>
            </div>
          </section>

          <section className="rounded-[4px] border border-border bg-card p-6 md:p-8">
            <SectionHeading number="02" title="Skills & work" description="Software, capacity and the work you're proud of." icon={Clapperboard} />
            <div className="space-y-7">
              <div><Label>Which editing software do you use? *</Label><Select value={form.software} onValueChange={(value) => update("software", value)}><SelectTrigger aria-invalid={Boolean(errors.software)} className={cn("mt-2 h-11 rounded-[4px] bg-card", errors.software && "border-destructive")}><SelectValue placeholder="Select software" /></SelectTrigger><SelectContent>{["Premiere Pro", "DaVinci Resolve", "Final Cut Pro", "CapCut", "Other"].map((software) => <SelectItem key={software} value={software}>{software}</SelectItem>)}</SelectContent></Select><FieldError message={errors.software} /></div>
              <RangeField label="Capacity (hours per week)" value={form.capacity_hours as number} min={5} max={60} suffix="hours" onChange={(value) => update("capacity_hours", value)} />
              <RangeField label="Years of editing experience" value={form.years_experience as number} min={0} max={10} suffix="years" onChange={(value) => update("years_experience", value)} />
              <RangeField label="How many UGC videos can you edit per week?" value={form.weekly_video_capacity as number} min={1} max={15} suffix="videos" onChange={(value) => update("weekly_video_capacity", value)} />

              <div className="rounded-[4px] border border-border bg-secondary/45 p-5">
                <h3 className="font-display text-lg font-semibold">Computer & internet</h3>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div><Label htmlFor="gpu">Graphics card (GPU) *</Label><Input id="gpu" maxLength={120} value={form.gpu} onChange={(e) => update("gpu", e.target.value)} {...field("gpu")} /><FieldError message={errors.gpu} /></div>
                  <div><Label htmlFor="cpu">Processor (CPU) *</Label><Input id="cpu" maxLength={120} value={form.cpu} onChange={(e) => update("cpu", e.target.value)} {...field("cpu")} /><FieldError message={errors.cpu} /></div>
                  <div><Label htmlFor="ram">RAM (GB) *</Label><Input id="ram" maxLength={80} value={form.ram} onChange={(e) => update("ram", e.target.value)} {...field("ram")} /><FieldError message={errors.ram} /></div>
                  <div><Label htmlFor="internet_mbps">Internet speed (Mbps) *</Label><Input id="internet_mbps" type="number" min={1} max={100000} value={form.internet_mbps} onChange={(e) => update("internet_mbps", e.target.value)} {...field("internet_mbps")} /><FieldError message={errors.internet_mbps} /></div>
                </div>
              </div>

              <div><Label htmlFor="about_self">Tell us a bit about yourself *</Label><Textarea id="about_self" rows={4} maxLength={2000} value={form.about_self} onChange={(e) => update("about_self", e.target.value)} aria-invalid={Boolean(errors.about_self)} className={cn("mt-2 rounded-[4px] bg-card", errors.about_self && "border-destructive")} /><FieldError message={errors.about_self} /></div>
              <div><Label htmlFor="ai_tools_usage">Do you use AI tools in your editing, and what for? *</Label><Textarea id="ai_tools_usage" rows={4} maxLength={2000} value={form.ai_tools_usage} onChange={(e) => update("ai_tools_usage", e.target.value)} aria-invalid={Boolean(errors.ai_tools_usage)} className={cn("mt-2 rounded-[4px] bg-card", errors.ai_tools_usage && "border-destructive")} /><FieldError message={errors.ai_tools_usage} /></div>
              <div><Label htmlFor="ad_quality_answer">What makes an ad good? What do you look for in the first three seconds? *</Label><Textarea id="ad_quality_answer" rows={4} maxLength={2000} value={form.ad_quality_answer} onChange={(e) => update("ad_quality_answer", e.target.value)} aria-invalid={Boolean(errors.ad_quality_answer)} className={cn("mt-2 rounded-[4px] bg-card", errors.ad_quality_answer && "border-destructive")} /><FieldError message={errors.ad_quality_answer} /></div>
              <div><Label htmlFor="portfolio_url">Link to a folder with videos you've edited *</Label><p className="mt-1 text-xs text-muted-foreground">One link only. Make sure anyone with the link can view the folder.</p><Input id="portfolio_url" type="url" maxLength={500} placeholder="https://" value={form.portfolio_url} onChange={(e) => update("portfolio_url", e.target.value)} {...field("portfolio_url")} /><FieldError message={errors.portfolio_url} /></div>
              <div><Label htmlFor="best_ad_url">Link the best ad you've edited *</Label><Input id="best_ad_url" type="url" maxLength={500} placeholder="https://" value={form.best_ad_url} onChange={(e) => update("best_ad_url", e.target.value)} {...field("best_ad_url")} /><FieldError message={errors.best_ad_url} /></div>
              <div><Label>When can you start? *</Label><Select value={form.start_timing} onValueChange={(value) => update("start_timing", value as FormState["start_timing"])}><SelectTrigger aria-invalid={Boolean(errors.start_timing)} className={cn("mt-2 h-11 rounded-[4px] bg-card", errors.start_timing && "border-destructive")}><SelectValue placeholder="Select availability" /></SelectTrigger><SelectContent>{["As soon as possible", "Within a week", "Within two weeks", "Within a month", "More than a month"].map((timing) => <SelectItem key={timing} value={timing}>{timing}</SelectItem>)}</SelectContent></Select><FieldError message={errors.start_timing} /></div>
            </div>
          </section>

          <div className="flex flex-col gap-5 border-t border-border pt-6 sm:flex-row sm:items-center">
            <Button type="submit" disabled={submitting} variant="cta" size="lg" className="min-w-[190px] rounded-[4px]">{submitting ? "Submitting…" : "Submit application"}</Button>
            <p className="text-xs leading-relaxed text-muted-foreground">By submitting, you agree that we may store and process the information you provide to evaluate your application. We never share it with third parties.</p>
          </div>
        </form>
      </main>
    </div>
  );
}
