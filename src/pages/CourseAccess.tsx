import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, Lock, Unlock, BookOpen, ArrowLeft, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function CourseAccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const phoneParam = params.get("phone") || "";
  const [phone, setPhone] = useState(phoneParam);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [checked, setChecked] = useState(!!phoneParam);

  useEffect(() => {
    if (phoneParam) checkAccess(phoneParam);
  }, []);

  const checkAccess = async (ph: string) => {
    setLoading(true);
    setCourses([]);
    try {
      const { data } = await supabase
        .from("access")
        .select("*, courses(name, description)")
        .eq("phone", ph)
        .eq("access_status", "active");
      setCourses(data || []);
    } catch {}
    setChecked(true);
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) checkAccess(phone.trim());
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="glass sticky top-0 z-10 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 rounded-xl hover:bg-muted active:scale-95 transition-all">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Unlock className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-display font-bold text-foreground">Course Access</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-lg">
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm gradient-border">
          <div className="text-center mb-8">
            <div className="h-16 w-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 glow-primary">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Access Your Courses</h2>
            <p className="text-sm text-muted-foreground mt-1">Enter your registered phone number</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit phone number"
                maxLength={10}
                className="w-full border border-input rounded-xl pl-11 pr-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !phone.trim()}
              className="w-full gradient-bg text-primary-foreground py-3.5 rounded-xl font-semibold hover:brightness-110 active:scale-[0.97] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unlock className="h-4 w-4" />}
              Check Access
            </button>
          </form>

          {checked && !loading && (
            courses.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm font-medium text-primary">✅ You have access to {courses.length} course(s):</p>
                {courses.map((a: any) => (
                  <div key={a.id} className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <h4 className="font-display font-bold text-foreground">{a.courses?.name || "Course"}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{a.courses?.description || ""}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Lock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No active course access found for this phone number.</p>
                <button
                  onClick={() => navigate("/pay-fees")}
                  className="mt-4 inline-flex items-center gap-2 gradient-bg text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition-all"
                >
                  Enroll Now
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
