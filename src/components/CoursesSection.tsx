import { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { useNavigate } from "react-router-dom";

export default function CoursesSection() {
  const { content } = useSiteContent();
  const sectionRef = useScrollReveal<HTMLElement>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            What We Offer
          </p>
          <h2 className="text-foreground text-balance">Our <span className="gradient-text">Courses</span></h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-pretty">
            Comprehensive coaching programs designed for every stage of your academic journey.
          </p>
        </div>
      </div>

      {/* Poster scroll */}
      <div className="relative group">
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full glass shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-card active:scale-95"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>

        <button
          onClick={() => scroll("right")}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full glass shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-card active:scale-95"
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
              className="flex-shrink-0 snap-center w-[280px] sm:w-[320px] md:w-[360px] rounded-2xl overflow-hidden shadow-md glow-card border border-border/40"
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

      <div className="text-center mt-10 flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => navigate("/courses")}
          className="inline-flex items-center gap-2 gradient-bg text-primary-foreground px-7 py-3.5 rounded-xl font-semibold hover:brightness-110 active:scale-[0.97] transition-all duration-200 glow-primary"
        >
          View All Courses <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => navigate("/pay-fees")}
          className="inline-flex items-center gap-2 border border-border text-foreground px-7 py-3.5 rounded-xl font-semibold hover:bg-muted active:scale-[0.97] transition-all duration-200"
        >
          Enroll Now
        </button>
      </div>
    </section>
  );
}
