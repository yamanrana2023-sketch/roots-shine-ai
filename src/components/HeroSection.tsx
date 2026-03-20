import { ArrowRight, Users, Award, BookOpen } from "lucide-react";
import { useSiteContent } from "@/contexts/SiteContentContext";
import heroBg from "@/assets/hero-bg.jpg";

export default function HeroSection() {
  const { content } = useSiteContent();
  const bgImage = content.heroBgUrl || heroBg;

  const stats = [
    { icon: Users, value: "500+", label: "Students" },
    { icon: Award, value: "95%", label: "Results" },
    { icon: BookOpen, value: "6-12", label: "Classes" },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0">
        <img src={bgImage} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/70" />
      </div>

      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl">
          <div className="animate-reveal-up inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            Admissions Open 2025-26
          </div>

          <h1 className="animate-reveal-up delay-100 text-primary-foreground text-balance">
            {content.heroTitle}
          </h1>

          <p className="animate-reveal-up delay-200 mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-2xl text-pretty leading-relaxed">
            {content.heroSubtitle}
          </p>

          <div className="animate-reveal-up delay-300 mt-10 flex flex-wrap gap-4">
            <a
              href={content.registrationFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3.5 rounded-xl text-base font-semibold hover:opacity-90 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-accent/25"
            >
              Register Now
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-2 border border-primary-foreground/30 text-primary-foreground px-6 py-3.5 rounded-xl text-base font-semibold hover:bg-primary-foreground/10 active:scale-[0.97] transition-all duration-200 backdrop-blur-sm"
            >
              Learn More
            </a>
          </div>

          <div className="animate-reveal-up delay-400 mt-16 flex gap-8 md:gap-12">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <s.icon className="h-5 w-5 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary-foreground font-display tabular-nums">
                  {s.value}
                </div>
                <div className="text-sm text-primary-foreground/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
