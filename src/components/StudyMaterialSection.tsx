import { useState, useEffect } from "react";
import { fetchMaterials, StudyMaterial } from "@/lib/studyMaterials";
import { BookOpen, FileText, Download, Loader2, Search, GraduationCap } from "lucide-react";

const CLASSES = ["Class 5", "Class 6", "Class 7", "Class 9", "Class 10", "Class 11", "Class 12"];

export default function StudyMaterialSection() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeClass, setActiveClass] = useState("Class 5");
  const [activeType, setActiveType] = useState<"All" | "Notes" | "Homework">("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMaterials()
      .then(setMaterials)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = materials.filter((m) => {
    if (m.class !== activeClass) return false;
    if (activeType !== "All" && m.type !== activeType) return false;
    if (searchQuery && !m.title.toLowerCase().includes(searchQuery.toLowerCase()) && !m.subject.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const subjects = [...new Set(materials.filter((m) => m.class === activeClass).map((m) => m.subject))];

  return (
    <section id="study-material" className="section-padding section-alt">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <GraduationCap className="h-4 w-4" />
            Study Material
          </div>
          <h2 className="text-foreground mb-3">Notes & Homework</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Access class-wise notes and homework PDFs. Download and study anytime, anywhere.
          </p>
        </div>

        {/* Class Tabs */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {CLASSES.map((cls) => (
            <button
              key={cls}
              onClick={() => { setActiveClass(cls); setActiveType("All"); setSearchQuery(""); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeClass === cls
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-card text-muted-foreground hover:bg-muted border border-border"
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* Type Filter + Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8 max-w-2xl mx-auto">
          <div className="flex gap-2">
            {(["All", "Notes", "Homework"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeType === t
                    ? "bg-accent text-accent-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted border border-border"
                }`}
              >
                {t === "Notes" && <BookOpen className="h-3 w-3 inline mr-1" />}
                {t === "Homework" && <FileText className="h-3 w-3 inline mr-1" />}
                {t}
              </button>
            ))}
          </div>
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or subject..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Subject Pills */}
        {subjects.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {subjects.map((s) => (
              <button
                key={s}
                onClick={() => setSearchQuery(searchQuery === s ? "" : s)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  searchQuery === s
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "bg-card text-muted-foreground border border-border hover:border-primary/30"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No material available for {activeClass}</p>
            <p className="text-sm text-muted-foreground mt-1">Check back later for updates</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filtered.map((m) => (
              <MaterialCard key={m.id} material={m} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function MaterialCard({ material }: { material: StudyMaterial }) {
  const isNotes = material.type === "Notes";
  return (
    <div className="bg-card rounded-xl border border-border p-3 sm:p-4 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group flex flex-col">
      <div className="flex items-start gap-2 mb-2">
        <div className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg flex items-center justify-center shrink-0 ${
          isNotes ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
        }`}>
          {isNotes ? <BookOpen className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          isNotes ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
        }`}>
          {material.type}
        </span>
      </div>
      <h4 className="font-semibold text-foreground text-sm sm:text-base leading-tight mb-1 line-clamp-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {material.title}
      </h4>
      <p className="text-xs text-muted-foreground mb-1">{material.subject}</p>
      <p className="text-[10px] text-muted-foreground mb-3">
        {new Date(material.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
      </p>
      <div className="mt-auto">
        <a
          href={material.pdf_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 w-full bg-primary text-primary-foreground px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition-all"
        >
          <Download className="h-3.5 w-3.5" />
          GET
        </a>
      </div>
    </div>
  );
}
