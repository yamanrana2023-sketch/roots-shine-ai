import { useState, useEffect } from "react";
import { Search, Loader2, UserCheck, Clock } from "lucide-react";
import { fetchStudents, updateStudentPayment, Student } from "@/lib/students";
import { toast } from "sonner";

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    fetchStudents()
      .then(setStudents)
      .catch(() => toast.error("Failed to load students"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleStatus = async (id: string, current: string) => {
    const newStatus = current === "paid" ? "pending" : "paid";
    try {
      await updateStudentPayment(id, newStatus as "paid" | "pending");
      toast.success(`Status updated to ${newStatus}`);
      load();
    } catch {
      toast.error("Failed to update");
    }
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search) ||
      s.course.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, or course..."
          className="w-full border border-input rounded-xl pl-10 pr-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No students found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 text-muted-foreground font-medium">Name</th>
                <th className="pb-3 text-muted-foreground font-medium">Phone</th>
                <th className="pb-3 text-muted-foreground font-medium">Course</th>
                <th className="pb-3 text-muted-foreground font-medium">Status</th>
                <th className="pb-3 text-muted-foreground font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-border/50">
                  <td className="py-3 text-foreground font-medium">{s.name}</td>
                  <td className="py-3 text-muted-foreground">{s.phone}</td>
                  <td className="py-3 text-muted-foreground">{s.course}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${s.payment_status === "paid" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                      {s.payment_status === "paid" ? <UserCheck className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {s.payment_status}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => toggleStatus(s.id, s.payment_status)}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Mark {s.payment_status === "paid" ? "Pending" : "Paid"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
