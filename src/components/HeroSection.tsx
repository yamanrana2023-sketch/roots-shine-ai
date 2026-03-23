import { ArrowRight, Users, Award, BookOpen, Star, CreditCard } from "lucide-react";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

export default function HeroSection() {
  const { content } = useSiteContent();
  const navigate = useNavigate();
  const bgImage = content.heroBgUrl || heroBg;

  const stats = [
    { icon: Users, value: "500+", label: "Students Enrolled" },
    { icon: Award, value: "95%", label: "Pass Rate" },
    { icon: BookOpen, value: "6–12", label: "Classes Covered" },
    { icon: Star, value: "7+", label: "Years of Trust" },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0">
        <img src={bgImage} alt="" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/65 to-foreground/80" />
      </div>

      <div className="relative container mx-auto px-4 py-24 md:py-36">
        <div className="max-w-3xl">
          <div className="animate-reveal-up inline-flex items-center gap-2 bg-accent/20 border border-accent/30 text-accent-foreground px-5 py-2 rounded-full text-sm font-semibold mb-8 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            Admissions Open 2026-27
          </div>

          <h1 className="animate-reveal-up delay-100 text-primary-foreground text-balance leading-[1.05]" style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)" }}>
            {content.heroTitle}
          </h1>

          <p className="animate-reveal-up delay-200 mt-7 text-lg md:text-xl text-primary-foreground/75 max-w-2xl text-pretty leading-relaxed">
            {content.heroSubtitle}
          </p>

          <div className="animate-reveal-up delay-300 mt-10 flex flex-wrap gap-4">
            <a
              href={content.registrationFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-4 rounded-xl text-base font-bold hover:brightness-110 active:scale-[0.97] transition-all duration-200 shadow-xl shadow-accent/30"
            >
              Register Now
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground px-7 py-4 rounded-xl text-base font-semibold hover:bg-primary-foreground/15 active:scale-[0.97] transition-all duration-200 backdrop-blur-sm"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="animate-reveal-up delay-400 mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl">
          {stats.map((s) => (
            <div key={s.label} className="bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-xl px-4 py-5 text-center">
              <s.icon className="h-5 w-5 text-accent mx-auto mb-2.5" />
              <div className="text-2xl font-bold text-primary-foreground font-display tabular-nums">{s.value}</div>
              <div className="text-xs text-primary-foreground/50 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
