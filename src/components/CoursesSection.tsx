import { BookOpen, GraduationCap, Atom, Trophy } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSiteContent } from "@/contexts/SiteContentContext";

const iconMap: Record<string, React.ElementType> = {
  BookOpen, GraduationCap, Atom, Trophy,
};

export default function CoursesSection() {
  const { content } = useSiteContent();
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section id="courses" ref={sectionRef} className="section-padding opacity-0">
      <div className="container mx-auto text-center">
        <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-3">
          What We Offer
        </p>
        <h2 className="text-foreground text-balance">Our Courses</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-pretty">
          Comprehensive coaching programs designed for every stage of your academic journey.
        </p>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.courses.map((course, i) => {
            const Icon = iconMap[course.icon] || BookOpen;
            return (
              <div
                key={course.title}
                className="group bg-card rounded-2xl p-6 text-left shadow-sm hover:shadow-lg transition-shadow duration-300 border border-border/50"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-display font-bold text-foreground">
                  {course.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {course.description}
                </p>
              </div>
            );
          })}
        </div>

        <a
          href={content.registrationFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-12 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 active:scale-[0.97] transition-all duration-200"
        >
          Enroll Now
        </a>
      </div>
    </section>
  );
}
