import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CreditCard, Loader2, User, Phone, BookOpen } from "lucide-react";
import { fetchCourses, Course } from "@/lib/courses";
import { addStudent, addPayment } from "@/lib/students";
import { toast } from "sonner";

export default function PayFees() {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedCourseId = (location.state as any)?.courseId || "";
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", courseId: preselectedCourseId });

  useEffect(() => {
    fetchCourses()
      .then((c) => {
        setCourses(c);
        if (preselectedCourseId) setForm((f) => ({ ...f, courseId: preselectedCourseId }));
      })
      .catch(() => toast.error("Failed to load courses"))
      .finally(() => setLoading(false));
  }, []);

  const selectedCourse = courses.find((c) => c.id === form.courseId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.courseId) {
      toast.error("Please fill all fields");
      return;
    }
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    setSubmitting(true);
    try {
      const student = await addStudent({
        name: form.name.trim(),
        phone: form.phone.trim(),
        course: selectedCourse?.name || "",
        payment_status: "pending",
      });

      await addPayment({
        student_id: student.id,
        amount: selectedCourse?.price || 0,
        status: "pending",
        razorpay_payment_id: null,
        date: new Date().toISOString(),
      });

      toast.info("Razorpay integration coming soon! Payment recorded as pending.");
      navigate("/payment-success", {
        state: {
          studentName: form.name,
          phone: form.phone,
          course: selectedCourse?.name,
          amount: selectedCourse?.price,
          status: "pending",
        },
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="glass border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 rounded-xl hover:bg-muted active:scale-95 transition-all">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <CreditCard className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-display font-bold text-foreground">Pay Tuition Fees</h1>
        </div>
      </div>

      <div className="relative container mx-auto px-4 py-10 max-w-lg">
        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm gradient-border">
          <div className="text-center mb-8">
            <div className="h-16 w-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 glow-primary">
              <CreditCard className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Fee Payment</h2>
            <p className="text-sm text-muted-foreground mt-1">Fill in your details to proceed</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-1.5">
                  <User className="h-4 w-4 text-muted-foreground" /> Student Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-1.5">
                  <Phone className="h-4 w-4 text-muted-foreground" /> Phone Number
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-digit phone number"
                  maxLength={10}
                  className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-1.5">
                  <BookOpen className="h-4 w-4 text-muted-foreground" /> Select Course
                </label>
                <select
                  value={form.courseId}
                  onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                  className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                >
                  <option value="">Choose a course...</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — ₹{c.price.toLocaleString("en-IN")}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCourse && (
                <div className="gradient-bg rounded-xl p-4 text-center">
                  <p className="text-sm text-primary-foreground/70">Amount to Pay</p>
                  <p className="text-3xl font-display font-bold text-primary-foreground mt-1">
                    ₹{selectedCourse.price.toLocaleString("en-IN")}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !form.courseId}
                className="w-full gradient-bg text-primary-foreground py-3.5 rounded-xl font-semibold hover:brightness-110 active:scale-[0.97] transition-all disabled:opacity-50 flex items-center justify-center gap-2 glow-primary"
              >
                {submitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                ) : (
                  <><CreditCard className="h-4 w-4" /> Proceed to Pay</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
