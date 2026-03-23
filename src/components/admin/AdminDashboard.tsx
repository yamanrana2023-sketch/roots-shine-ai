import { useState, useEffect } from "react";
import { Users, IndianRupee, TrendingUp, UserCheck, Loader2 } from "lucide-react";
import { fetchDashboardStats } from "@/lib/students";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const cards = [
    { label: "Total Students", value: stats?.totalStudents || 0, icon: Users, color: "text-primary bg-primary/10" },
    { label: "Paid Students", value: stats?.paidStudents || 0, icon: UserCheck, color: "text-green-600 bg-green-100" },
    { label: "Total Revenue", value: `₹${(stats?.totalRevenue || 0).toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-accent bg-accent/10" },
    { label: "Recent Payments", value: stats?.recentPayments?.length || 0, icon: TrendingUp, color: "text-blue-600 bg-blue-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <div className={`h-10 w-10 rounded-xl ${c.color} flex items-center justify-center mb-3`}>
              <c.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{c.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {stats?.recentPayments?.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-display font-bold text-foreground mb-4">Recent Payments</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 text-muted-foreground font-medium">Student</th>
                  <th className="pb-3 text-muted-foreground font-medium">Amount</th>
                  <th className="pb-3 text-muted-foreground font-medium">Status</th>
                  <th className="pb-3 text-muted-foreground font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentPayments.map((p: any) => (
                  <tr key={p.id} className="border-b border-border/50">
                    <td className="py-3 text-foreground">{p.student_name || "—"}</td>
                    <td className="py-3 font-medium">₹{p.amount?.toLocaleString("en-IN")}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.status === "success" ? "bg-primary/10 text-primary" : p.status === "pending" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{new Date(p.date).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
