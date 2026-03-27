import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Save } from "lucide-react";
import { fetchCourses, addCourse, updateCourse, deleteCourse, Course, NewCourse } from "@/lib/courses";
import { toast } from "sonner";

const CLASSES = ["Class 5", "Class 6", "Class 7", "Class 9", "Class 10", "Class 11", "Class 12"];

const emptyForm: NewCourse = { title: "", fees: 0, description: "", class: "Class 9", duration: "1 Year" };

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<NewCourse>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    fetchCourses()
      .then(setCourses)
      .catch(() => toast.error("Failed to load courses"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.title.trim() || !form.fees) {
      toast.error("Name and fees are required");
      return;
    }
    try {
      if (editId) {
        await updateCourse(editId, form);
        toast.success("Course updated");
      } else {
        await addCourse(form);
        toast.success("Course added");
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      load();
    } catch {
      toast.error("Failed to save");
    }
  };

  const handleEdit = (c: Course) => {
    setForm({ title: c.title, fees: c.fees, description: c.description, class: c.class, duration: c.duration });
    setEditId(c.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    try {
      await deleteCourse(id);
      toast.success("Course deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-4">
      {showForm && (
        <div className="bg-muted/50 rounded-xl p-5 space-y-3 border border-border">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-foreground">{editId ? "Edit Course" : "Add Course"}</h4>
            <button onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }} className="p-1 hover:bg-muted rounded-lg">
              <X className="h-4 w-4" />
            </button>
          </div>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Course Name" className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={form.fees || ""} onChange={(e) => setForm({ ...form, fees: Number(e.target.value) })} placeholder="Fees (₹)" className="border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} className="border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
              {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="Duration (e.g. 1 Year)" className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <button onClick={handleSave} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition-all">
            <Save className="h-4 w-4" /> {editId ? "Update" : "Add"} Course
          </button>
        </div>
      )}

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          <Plus className="h-4 w-4" /> Add New Course
        </button>
      )}

      {courses.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No courses yet. Add your first course above.</p>
      ) : (
        <div className="space-y-3">
          {courses.map((c) => (
            <div key={c.id} className="flex items-center justify-between bg-background rounded-xl border border-border p-4">
              <div>
                <p className="font-medium text-foreground">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.class} • {c.duration} • ₹{(c.fees ?? 0).toLocaleString("en-IN")}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(c)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive/70 hover:text-destructive transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
