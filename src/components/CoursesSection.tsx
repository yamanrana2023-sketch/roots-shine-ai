import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSiteContent } from "@/contexts/SiteContentContext";

export default function CoursesSection() {
  const { content } = useSiteContent();
  const sectionRef = useScrollReveal<HTMLElement>();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.7;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (!content.posters || content.posters.length === 0) return null;

  return (
    <section id="courses" ref={sectionRef} className="py-20 md:py-28 opacity-0">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-3">
            What We Offer
          </p>
          <h2 className="text-foreground text-balance">Our Courses</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-pretty">
            Comprehensive coaching programs designed for every stage of your academic journey.
          </p>
        </div>
      </div>

      {/* Poster scroll */}
      <div className="relative group">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full bg-card/90 border border-border shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-card active:scale-95"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full bg-card/90 border border-border shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-card active:scale-95"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth px-4 md:px-8 pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          {content.posters.map((url, i) => (
            <div
              key={i}
              className="flex-shrink-0 snap-center w-[280px] sm:w-[320px] md:w-[360px] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-border/40"
            >
              <img
                src={url}
                alt={`Course poster ${i + 1}`}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-10">
        <a
          href={content.registrationFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl font-semibold hover:opacity-90 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-primary/20"
        >
          Enroll Now
        </a>
      </div>
    </section>
  );
}
