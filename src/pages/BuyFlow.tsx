import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Phone, QrCode, FileText, Loader2, CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";
import { fetchProductById, Product, createOrder } from "@/lib/products";
import { toast } from "sonner";

type Step = "info" | "qr" | "utr" | "done";

export default function BuyFlow() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>("info");
  const [form, setForm] = useState({ name: "", phone: "" });
  const [utr, setUtr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchProductById(id)
      .then(setProduct)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const WHATSAPP_NUMBER = "918285262890";
  const QR_IMAGE = "https://i.ibb.co/placeholder-qr"; // Admin will set this via settings

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    setStep("qr");
  };

  const handleUtrSubmit = async () => {
    if (!utr.trim()) {
      toast.error("Please enter the UTR number");
      return;
    }
    if (!product) return;

    setSubmitting(true);
    try {
      await createOrder({
        product_id: product.id,
        customer_name: form.name.trim(),
        customer_phone: form.phone.trim(),
        amount: product.price,
        utr_number: utr.trim(),
      });
      setStep("done");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit order");
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const msg = encodeURIComponent(
      `Hi, I have made a payment of ₹${product?.price} for "${product?.title}".\n\nName: ${form.name}\nPhone: ${form.phone}\nUTR: ${utr}\n\nPlease verify and approve my order.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground">Product not found</p>
        <button onClick={() => navigate("/store")} className="text-primary text-sm font-medium">← Back to Store</button>
      </div>
    );
  }

  const steps = [
    { key: "info", label: "Details", icon: User },
    { key: "qr", label: "Pay", icon: QrCode },
    { key: "utr", label: "UTR", icon: FileText },
    { key: "done", label: "Done", icon: CheckCircle2 },
  ];
  const currentIdx = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="glass border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <button onClick={() => step === "info" ? navigate(`/store/${id}`) : setStep(step === "qr" ? "info" : step === "utr" ? "qr" : "info")} className="p-2 rounded-xl hover:bg-muted active:scale-95 transition-all">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-display font-bold text-foreground">Purchase: {product.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-lg relative">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i <= currentIdx ? "gradient-bg text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${i < currentIdx ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm gradient-border">
          {/* Step 1: Info */}
          {step === "info" && (
            <form onSubmit={handleInfoSubmit} className="space-y-5">
              <div className="text-center mb-6">
                <User className="h-10 w-10 mx-auto text-primary mb-2" />
                <h2 className="text-xl font-display font-bold text-foreground">Your Details</h2>
                <p className="text-sm text-muted-foreground">Enter your information to proceed</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-1.5">
                  <User className="h-4 w-4 text-muted-foreground" /> Full Name
                </label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter your name" className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-1.5">
                  <Phone className="h-4 w-4 text-muted-foreground" /> Phone Number
                </label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="10-digit phone number" maxLength={10} className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="gradient-bg rounded-xl p-4 text-center">
                <p className="text-sm text-primary-foreground/70">Amount to Pay</p>
                <p className="text-3xl font-display font-bold text-primary-foreground">₹{product.price}</p>
              </div>
              <button type="submit" className="w-full gradient-bg text-primary-foreground py-3.5 rounded-xl font-semibold hover:brightness-110 active:scale-[0.97] transition-all flex items-center justify-center gap-2 glow-primary">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* Step 2: QR Code */}
          {step === "qr" && (
            <div className="space-y-5 text-center">
              <QrCode className="h-10 w-10 mx-auto text-primary mb-2" />
              <h2 className="text-xl font-display font-bold text-foreground">Scan & Pay</h2>
              <p className="text-sm text-muted-foreground">Scan the QR code using any UPI app and pay ₹{product.price}</p>
              <div className="bg-background rounded-2xl border border-border p-6 inline-block mx-auto">
                <div className="w-48 h-48 bg-muted rounded-xl flex items-center justify-center">
                  <QrCode className="h-20 w-20 text-muted-foreground/30" />
                </div>
                <p className="text-xs text-muted-foreground mt-3">UPI QR Code</p>
              </div>
              <div className="gradient-bg rounded-xl p-3 text-sm text-primary-foreground font-medium">
                Pay ₹{product.price} via UPI
              </div>
              <button
                onClick={() => setStep("utr")}
                className="w-full gradient-bg text-primary-foreground py-3.5 rounded-xl font-semibold hover:brightness-110 active:scale-[0.97] transition-all flex items-center justify-center gap-2 glow-primary"
              >
                I've Made the Payment <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 3: UTR Number */}
          {step === "utr" && (
            <div className="space-y-5">
              <div className="text-center">
                <FileText className="h-10 w-10 mx-auto text-primary mb-2" />
                <h2 className="text-xl font-display font-bold text-foreground">Enter UTR Number</h2>
                <p className="text-sm text-muted-foreground">Enter the transaction reference number from your UPI app</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">UTR / Transaction ID</label>
                <input
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="e.g. 1234567890123"
                  className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <button
                onClick={handleUtrSubmit}
                disabled={submitting}
                className="w-full gradient-bg text-primary-foreground py-3.5 rounded-xl font-semibold hover:brightness-110 active:scale-[0.97] transition-all disabled:opacity-50 flex items-center justify-center gap-2 glow-primary"
              >
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <>Submit Order <ArrowRight className="h-4 w-4" /></>}
              </button>
            </div>
          )}

          {/* Step 4: Done */}
          {step === "done" && (
            <div className="space-y-5 text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-green-600 animate-check-bounce" />
              </div>
              <h2 className="text-xl font-display font-bold text-foreground">Order Submitted!</h2>
              <p className="text-sm text-muted-foreground">
                Your order has been recorded. Please send the payment screenshot on WhatsApp for faster verification.
              </p>
              <div className="bg-muted/50 rounded-xl p-4 text-left text-sm space-y-1">
                <p><span className="text-muted-foreground">Name:</span> <span className="font-medium text-foreground">{form.name}</span></p>
                <p><span className="text-muted-foreground">Phone:</span> <span className="font-medium text-foreground">{form.phone}</span></p>
                <p><span className="text-muted-foreground">Product:</span> <span className="font-medium text-foreground">{product.title}</span></p>
                <p><span className="text-muted-foreground">Amount:</span> <span className="font-medium text-foreground">₹{product.price}</span></p>
                <p><span className="text-muted-foreground">UTR:</span> <span className="font-medium text-foreground">{utr}</span></p>
              </div>
              <button
                onClick={handleWhatsAppRedirect}
                className="w-full bg-green-600 text-white py-3.5 rounded-xl font-semibold hover:bg-green-700 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Send Screenshot on WhatsApp
              </button>
              <button
                onClick={() => navigate("/my-purchases")}
                className="w-full border border-border text-foreground py-3 rounded-xl font-medium hover:bg-muted transition-all"
              >
                View My Purchases
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
