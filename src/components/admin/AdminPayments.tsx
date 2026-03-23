import { useState, useEffect } from "react";
import { Loader2, Filter } from "lucide-react";
import { fetchPayments, updatePaymentStatus, Payment } from "@/lib/students";
import { toast } from "sonner";

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = () => {
    setLoading(true);
    fetchPayments()
      .then(setPayments)
      .catch(() => toast.error("Failed to load payments"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id: string, status: "success" | "failed" | "pending") => {
    try {
      await updatePaymentStatus(id, status);
      toast.success("Payment status updated");
      load();
    } catch {
      toast.error("Failed to update");
    }
  };

  const filtered = filter === "all" ? payments : payments.filter((p) => p.status === filter);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-input rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">All Payments</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No payments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 text-muted-foreground font-medium">Student</th>
                <th className="pb-3 text-muted-foreground font-medium">Amount</th>
                <th className="pb-3 text-muted-foreground font-medium">Status</th>
                <th className="pb-3 text-muted-foreground font-medium">Date</th>
                <th className="pb-3 text-muted-foreground font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border/50">
                  <td className="py-3">
                    <div className="text-foreground font-medium">{p.student_name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{p.student_phone || ""}</div>
                  </td>
                  <td className="py-3 font-semibold">₹{p.amount?.toLocaleString("en-IN")}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.status === "success" ? "bg-primary/10 text-primary" : p.status === "pending" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">{new Date(p.date).toLocaleDateString("en-IN")}</td>
                  <td className="py-3">
                    <select
                      value={p.status}
                      onChange={(e) => handleStatusChange(p.id, e.target.value as any)}
                      className="border border-input rounded-lg px-2 py-1 text-xs bg-background"
                    >
                      <option value="success">Success</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
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
