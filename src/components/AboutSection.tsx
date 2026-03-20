import { CheckCircle2, ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSiteContent } from "@/contexts/SiteContentContext";
import aboutImg from "@/assets/about-img.jpg";

export default function AboutSection() {
  const { content } = useSiteContent();
  const sectionRef = useScrollReveal<HTMLElement>();

  const highlights = [
    "Experienced & Dedicated Faculty",
    "Regular Tests & Assessments",
    "Doubt Clearing Sessions",
    "Small Batch Sizes for Personal Attention",
  ];

  const imageUrl = content.aboutImageUrl || aboutImg;

  return (
    <section id="about" ref={sectionRef} className="py-20 md:py-28 section-alt opacity-0">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-14 lg:gap-20 items-center">
          <div className="relative order-2 md:order-1">
            {content.aboutVideoUrl ? (
              <video
                src={content.aboutVideoUrl}
                controls
                className="w-full rounded-2xl shadow-2xl"
                poster={imageUrl}
              />
            ) : (
              <div className="relative">
                <div className="absolute -inset-3 bg-primary/10 rounded-3xl -z-10" />
                <img
                  src={imageUrl}
                  alt="About The Roots Foundation"
                  className="w-full rounded-2xl shadow-2xl object-cover aspect-[4/3]"
                />
                <div className="absolute -bottom-5 -right-3 md:-right-5 bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg font-display font-bold text-lg border-4 border-background">
                  Since 2018
                </div>
              </div>
            )}
          </div>

          <div className="order-1 md:order-2">
            <p className="text-sm font-bold text-accent uppercase tracking-widest mb-3">
              Who We Are
            </p>
            <h2 className="text-foreground text-balance">{content.aboutTitle}</h2>
            <p className="mt-6 text-muted-foreground leading-relaxed text-pretty text-base">
              {content.aboutText}
            </p>

            <ul className="mt-8 space-y-4">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="font-medium text-sm">{h}</span>
                </li>
              ))}
            </ul>

            <a
              href={content.registrationFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 active:scale-[0.97] transition-all duration-200"
            >
              Join Us <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
