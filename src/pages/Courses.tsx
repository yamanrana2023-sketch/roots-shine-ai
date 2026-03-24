import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Loader2, ArrowRight } from "lucide-react";
import { fetchCourses, Course } from "@/lib/courses";

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses()
      .then(setCourses)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass sticky top-0 z-10 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 rounded-xl hover:bg-muted active:scale-95 transition-all">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <BookOpen className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-display font-bold text-foreground">Our Courses</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">What We Offer</p>
          <h2 className="text-foreground">Choose Your <span className="gradient-text">Course</span></h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Comprehensive coaching programs designed for every stage of your academic journey.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No courses available yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-card rounded-2xl border border-border p-6 glow-card gradient-border"
              >
                <div className="h-12 w-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-display font-bold text-foreground mb-2">{course.name}</h3>
                {course.class && (
                  <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
                    Class {course.class}
                  </span>
                )}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{course.description}</p>
                {course.duration && (
                  <p className="text-xs text-muted-foreground mb-4">Duration: {course.duration}</p>
                )}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <span className="text-2xl font-bold gradient-text font-display">
                    ₹{course.price.toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={() => navigate("/pay-fees", { state: { courseId: course.id } })}
                    className="inline-flex items-center gap-1.5 gradient-bg text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 active:scale-[0.97] transition-all"
                  >
                    Enroll <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
