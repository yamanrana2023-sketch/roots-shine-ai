import { useState, useEffect } from "react";
import {
  fetchMaterials, addMaterial, updateMaterial, deleteMaterial,
  StudyMaterial, NewStudyMaterial,
} from "@/lib/studyMaterials";
import {
  Plus, Pencil, Trash2, Loader2, X, Check, BookOpen, FileText, Search,
} from "lucide-react";
import { toast } from "sonner";

const CLASSES = ["Class 9", "Class 10", "Class 11", "Class 12"];
const TYPES: ("Notes" | "Homework")[] = ["Notes", "Homework"];

const emptyForm: NewStudyMaterial = { title: "", type: "Notes", class: "Class 9", subject: "", pdf_link: "" };

export default function AdminStudyMaterial() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterClass, setFilterClass] = useState("All");
  const [search, setSearch] = useState("");

  // form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NewStudyMaterial>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    fetchMaterials().then(setMaterials).catch(() => toast.error("Failed to load")).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = materials.filter((m) => {
    if (filterClass !== "All" && m.class !== filterClass) return false;
    if (search && !m.title.toLowerCase().includes(search.toLowerCase()) && !m.subject.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (m: StudyMaterial) => {
    setEditingId(m.id);
    setForm({ title: m.title, type: m.type, class: m.class, subject: m.subject, pdf_link: m.pdf_link });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); };

  const handleSubmit = async () => {
    if (!form.title || !form.subject || !form.pdf_link) {
      toast.error("Please fill all fields"); return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        await updateMaterial(editingId, form);
        toast.success("Material updated!");
      } else {
        await addMaterial(form);
        toast.success("Material added!");
      }
      closeForm();
      load();
    } catch {
      toast.error("Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this material?")) return;
    try {
      await deleteMaterial(id);
      toast.success("Deleted!");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterClass("All")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterClass === "All" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >All</button>
          {CLASSES.map((c) => (
            <button
              key={c}
              onClick={() => setFilterClass(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterClass === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >{c}</button>
          ))}
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition-all">
          <Plus className="h-4 w-4" /> Add Material
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search materials..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-muted/50 rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-foreground text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {editingId ? "Edit Material" : "Add New Material"}
            </h4>
            <button onClick={closeForm} className="p-1 rounded-lg hover:bg-muted"><X className="h-4 w-4" /></button>
          </div>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} className="border border-input rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} className="border border-input rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
              {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject (e.g. Mathematics)" className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <input value={form.pdf_link} onChange={(e) => setForm({ ...form, pdf_link: e.target.value })} placeholder="PDF Link (Google Drive, etc.)" className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <button onClick={handleSubmit} disabled={submitting} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition-all disabled:opacity-60">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {editingId ? "Update" : "Add"}
          </button>
        </div>
      )}

      {/* Materials List */}
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">No materials found</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((m) => (
            <div key={m.id} className="flex items-center gap-3 bg-background rounded-xl border border-border px-4 py-3 hover:border-primary/20 transition-all group">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${m.type === "Notes" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                {m.type === "Notes" ? <BookOpen className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{m.title}</p>
                <p className="text-xs text-muted-foreground">{m.class} · {m.subject} · {m.type}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(m)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(m.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
