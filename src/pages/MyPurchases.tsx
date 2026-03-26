import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Search, Download, Clock, CheckCircle2, XCircle, Loader2, ShoppingBag } from "lucide-react";
import { fetchOrdersByPhone, Order } from "@/lib/products";
import { toast } from "sonner";

export default function MyPurchases() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<(Order & { pdf_url?: string })[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    setLoading(true);
    try {
      const data = await fetchOrdersByPhone(phone.trim());
      setOrders(data as any);
      setSearched(true);
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const statusIcon = (s: string) => {
    if (s === "approved") return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (s === "rejected") return <XCircle className="h-4 w-4 text-destructive" />;
    return <Clock className="h-4 w-4 text-amber-500" />;
  };

  const statusBadge = (s: string) => {
    if (s === "approved") return "bg-green-100 text-green-700";
    if (s === "rejected") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="glass border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 rounded-xl hover:bg-muted active:scale-95 transition-all">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <ShoppingBag className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-display font-bold text-foreground">My Purchases</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-lg">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm gradient-border mb-6">
          <div className="text-center mb-5">
            <Phone className="h-10 w-10 mx-auto text-primary mb-2" />
            <h2 className="text-xl font-display font-bold text-foreground">Find Your Orders</h2>
            <p className="text-sm text-muted-foreground">Enter your phone number to view purchases</p>
          </div>
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit phone number"
              maxLength={10}
              className="flex-1 border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button type="submit" disabled={loading} className="gradient-bg text-primary-foreground px-5 py-3 rounded-xl font-semibold hover:brightness-110 active:scale-[0.97] transition-all disabled:opacity-50">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </button>
          </form>
        </div>

        {searched && orders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">No orders found for this number</p>
          </div>
        )}

        {orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="bg-card rounded-2xl border border-border p-5 shadow-sm glow-card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-bold text-foreground">{o.product_title || "Product"}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge(o.status)}`}>
                    {statusIcon(o.status)}
                    {o.status}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="font-bold text-primary">₹{o.amount}</span>
                  {o.status === "approved" && (o as any).pdf_url && (
                    <a
                      href={(o as any).pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 gradient-bg text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:brightness-110 transition-all"
                    >
                      <Download className="h-3 w-3" /> Download PDF
                    </a>
                  )}
                  {o.status === "pending" && (
                    <span className="text-xs text-muted-foreground">Verification pending...</span>
                  )}
                  {o.status === "rejected" && (
                    <span className="text-xs text-destructive">Payment not verified</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
