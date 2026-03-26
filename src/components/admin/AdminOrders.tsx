import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Clock, Loader2, ShoppingBag, Search } from "lucide-react";
import { fetchOrders, updateOrderStatus, Order } from "@/lib/products";
import { toast } from "sonner";

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    fetchOrders().then(setOrders).catch(() => toast.error("Failed to load")).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      await updateOrderStatus(id, status);
      toast.success(`Order ${status}`);
      load();
    } catch {
      toast.error("Failed to update");
    }
  };

  const filtered = orders.filter((o) => {
    const matchFilter = filter === "all" || o.status === filter;
    const matchSearch = !search || o.customer_name.toLowerCase().includes(search.toLowerCase()) || o.customer_phone.includes(search) || o.utr_number.includes(search);
    return matchFilter && matchSearch;
  });

  const statusBadge = (s: string) => {
    if (s === "approved") return "bg-green-100 text-green-700";
    if (s === "rejected") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700";
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="font-display font-bold text-foreground text-lg">Orders ({orders.length})</h3>
        <div className="flex gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? "gradient-bg text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, phone, or UTR..." className="w-full pl-10 pr-4 py-3 border border-input rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <div key={o.id} className="bg-card rounded-xl border border-border p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-medium text-foreground text-sm">{o.customer_name}</p>
                  <p className="text-xs text-muted-foreground">{o.customer_phone}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge(o.status)}`}>{o.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <span className="text-muted-foreground">Product:</span>
                  <p className="font-medium text-foreground">{o.product_title || "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Amount:</span>
                  <p className="font-medium text-foreground">₹{o.amount}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">UTR:</span>
                  <p className="font-medium text-foreground font-mono">{o.utr_number}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <p className="font-medium text-foreground">{new Date(o.created_at).toLocaleDateString("en-IN")}</p>
                </div>
              </div>
              {o.status === "pending" && (
                <div className="flex gap-2 pt-3 border-t border-border">
                  <button onClick={() => handleStatus(o.id, "approved")} className="flex-1 inline-flex items-center justify-center gap-1.5 bg-green-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-green-700 transition-all">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button onClick={() => handleStatus(o.id, "rejected")} className="flex-1 inline-flex items-center justify-center gap-1.5 bg-red-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-red-700 transition-all">
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
