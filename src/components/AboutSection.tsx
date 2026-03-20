import { CheckCircle } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getSiteContent } from "@/lib/siteContent";
import aboutImg from "@/assets/about-img.jpg";

export default function AboutSection() {
  const content = getSiteContent();
  const sectionRef = useScrollReveal<HTMLElement>();

  const highlights = [
    "Experienced & Dedicated Faculty",
    "Regular Tests & Assessments",
    "Doubt Clearing Sessions",
    "Small Batch Sizes for Personal Attention",
  ];

  const imageUrl = content.aboutImageUrl || aboutImg;

  return (
    <section id="about" ref={sectionRef} className="section-padding section-alt opacity-0">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image / Video */}
          <div className="relative">
            {content.aboutVideoUrl ? (
              <video
                src={content.aboutVideoUrl}
                controls
                className="w-full rounded-2xl shadow-xl"
                poster={imageUrl}
              />
            ) : (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="About The Roots Foundation"
                  className="w-full rounded-2xl shadow-xl object-cover aspect-[4/3]"
                />
                <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg font-display font-bold text-lg">
                  Since 2018
                </div>
              </div>
            )}
          </div>

          {/* Text */}
          <div>
            <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-3">
              Who We Are
            </p>
            <h2 className="text-foreground text-balance">{content.aboutTitle}</h2>
            <p className="mt-6 text-muted-foreground leading-relaxed text-pretty">
              {content.aboutText}
            </p>

            <ul className="mt-8 space-y-3">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-foreground">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="font-medium">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
