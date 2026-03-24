import { useState, useEffect } from "react";
import { fetchAccess, grantAccess, revokeAccess, CourseAccess } from "@/lib/students";
import { fetchCourses, Course } from "@/lib/courses";
import { Loader2, Shield, ShieldOff, Plus, Search } from "lucide-react";
import { toast } from "sonner";

export default function AdminAccessControl() {
  const [accesses, setAccesses] = useState<CourseAccess[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showGrant, setShowGrant] = useState(false);
  const [grantForm, setGrantForm] = useState({ phone: "", courseId: "" });

  const load = () => {
    setLoading(true);
    Promise.all([fetchAccess(), fetchCourses()])
      .then(([a, c]) => { setAccesses(a); setCourses(c); })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleGrant = async () => {
    if (!grantForm.phone || !grantForm.courseId) return;
    try {
      await grantAccess(grantForm.phone, grantForm.courseId);
      toast.success("Access granted");
      setShowGrant(false);
      setGrantForm({ phone: "", courseId: "" });
      load();
    } catch { toast.error("Failed to grant access"); }
  };

  const handleRevoke = async (id: string) => {
    try {
      await revokeAccess(id);
      toast.success("Access revoked");
      load();
    } catch { toast.error("Failed"); }
  };

  const filtered = accesses.filter((a) => a.phone.includes(search));

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by phone..."
            className="w-full border border-input rounded-xl pl-10 pr-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button onClick={() => setShowGrant(!showGrant)} className="inline-flex items-center gap-2 gradient-bg text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition-all">
          <Plus className="h-4 w-4" /> Grant Access
        </button>
      </div>

      {showGrant && (
        <div className="bg-card rounded-xl border border-border p-5 space-y-3">
          <input value={grantForm.phone} onChange={(e) => setGrantForm({ ...grantForm, phone: e.target.value })} placeholder="Phone number" className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <select value={grantForm.courseId} onChange={(e) => setGrantForm({ ...grantForm, courseId: e.target.value })} className="w-full border border-input rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="">Select course...</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button onClick={handleGrant} disabled={!grantForm.phone || !grantForm.courseId} className="gradient-bg text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 disabled:opacity-50 transition-all">
            Confirm Grant
          </button>
        </div>
      )}

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-4 font-medium text-muted-foreground">Phone</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Course</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No access records found</td></tr>
            ) : filtered.map((a) => (
              <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="p-4 font-mono text-foreground">{a.phone}</td>
                <td className="p-4 text-foreground">{a.course_name || a.course_id}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${a.access_status === "active" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                    {a.access_status === "active" ? <Shield className="h-3 w-3" /> : <ShieldOff className="h-3 w-3" />}
                    {a.access_status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {a.access_status === "active" && (
                    <button onClick={() => handleRevoke(a.id)} className="text-destructive hover:text-destructive/80 text-xs font-medium">
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
