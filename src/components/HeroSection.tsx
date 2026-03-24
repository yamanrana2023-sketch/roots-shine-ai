import { ArrowRight, Users, Award, BookOpen, Star, CreditCard, Sparkles } from "lucide-react";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const { content } = useSiteContent();
  const navigate = useNavigate();

  const stats = [
    { icon: Users, value: "500+", label: "Students Enrolled" },
    { icon: Award, value: "95%", label: "Pass Rate" },
    { icon: BookOpen, value: "6–12", label: "Classes Covered" },
    { icon: Star, value: "7+", label: "Years of Trust" },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-foreground">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[100px] animate-float delay-200" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative container mx-auto px-4 py-24 md:py-36">
        <div className="max-w-3xl">
          <div className="animate-reveal-up inline-flex items-center gap-2 glass px-5 py-2 rounded-full text-sm font-semibold mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="gradient-text">Admissions Open 2026-27</span>
          </div>

          <h1 className="animate-reveal-up delay-100 text-primary-foreground text-balance leading-[1.05]" style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)" }}>
            Upgrade Your Future with{" "}
            <span className="gradient-text">Expert Coaching</span>
          </h1>

          <p className="animate-reveal-up delay-200 mt-7 text-lg md:text-xl text-primary-foreground/60 max-w-2xl text-pretty leading-relaxed">
            {content.heroSubtitle}
          </p>

          <div className="animate-reveal-up delay-300 mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/pay-fees")}
              className="inline-flex items-center gap-2 gradient-bg text-primary-foreground px-8 py-4 rounded-2xl text-base font-bold hover:brightness-110 active:scale-[0.97] transition-all duration-200 glow-primary animate-gradient"
            >
              <CreditCard className="h-5 w-5" />
              Pay Fees
            </button>
            <button
              onClick={() => navigate("/courses")}
              className="inline-flex items-center gap-2 glass text-primary-foreground px-8 py-4 rounded-2xl text-base font-semibold hover:bg-primary-foreground/10 active:scale-[0.97] transition-all duration-200"
            >
              View Courses
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="animate-reveal-up delay-400 mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl px-4 py-5 text-center glow-card">
              <s.icon className="h-5 w-5 text-primary mx-auto mb-2.5" />
              <div className="text-2xl font-bold text-primary-foreground font-display tabular-nums">{s.value}</div>
              <div className="text-xs text-primary-foreground/40 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
