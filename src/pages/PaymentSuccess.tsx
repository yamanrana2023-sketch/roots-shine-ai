import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Clock, Home, Download, Printer } from "lucide-react";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const info = state as {
    studentName?: string;
    phone?: string;
    course?: string;
    amount?: number;
    status?: string;
  } | null;

  const isPending = info?.status === "pending";
  const date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const invoiceNo = `INV-${Date.now().toString(36).toUpperCase()}`;

  const downloadInvoice = () => {
    const text = `
═══════════════════════════════════════
          PAYMENT INVOICE
═══════════════════════════════════════

Invoice No:  ${invoiceNo}
Date:        ${date}

Student:     ${info?.studentName || "—"}
Phone:       ${info?.phone || "—"}
Course:      ${info?.course || "—"}

Amount:      ₹${info?.amount?.toLocaleString("en-IN") || "0"}
Status:      ${isPending ? "PENDING" : "PAID"}

═══════════════════════════════════════
       Thank you for your payment!
═══════════════════════════════════════
`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${invoiceNo}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="bg-card rounded-2xl border border-border p-8 max-w-md w-full shadow-xl text-center gradient-border relative">
        {/* Success icon with animation */}
        <div className={`h-20 w-20 rounded-full ${isPending ? "bg-accent/10" : "gradient-bg glow-primary"} flex items-center justify-center mx-auto mb-6 animate-check-bounce`}>
          {isPending ? (
            <Clock className="h-10 w-10 text-accent" />
          ) : (
            <CheckCircle className="h-10 w-10 text-primary-foreground" />
          )}
        </div>

        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          {isPending ? "Payment Pending" : "Payment Successful!"}
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          {isPending
            ? "Your enrollment has been recorded. Payment will be confirmed shortly."
            : "Thank you! Your payment has been received."}
        </p>

        {info && (
          <div className="bg-muted/50 rounded-xl p-5 mb-6 text-left space-y-3" id="invoice-content">
            <div className="text-xs text-muted-foreground mb-2">Invoice: {invoiceNo}</div>
            {[
              { label: "Student", value: info.studentName },
              { label: "Phone", value: info.phone },
              { label: "Course", value: info.course },
              { label: "Date", value: date },
            ].map((row) => (
              <div key={row.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium text-foreground">{row.value}</span>
              </div>
            ))}
            <div className="border-t border-border pt-3 flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-bold gradient-text text-lg">
                ₹{info.amount?.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className={`font-semibold ${isPending ? "text-accent" : "text-primary"}`}>
                {isPending ? "Pending" : "Paid"}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-3 no-print">
          <button
            onClick={() => navigate("/")}
            className="flex-1 inline-flex items-center justify-center gap-2 border border-border px-4 py-3 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
          >
            <Home className="h-4 w-4" /> Home
          </button>
          <button
            onClick={downloadInvoice}
            className="flex-1 inline-flex items-center justify-center gap-2 border border-border px-4 py-3 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
          >
            <Download className="h-4 w-4" /> Download
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 inline-flex items-center justify-center gap-2 gradient-bg text-primary-foreground px-4 py-3 rounded-xl text-sm font-semibold hover:brightness-110 transition-all"
          >
            <Printer className="h-4 w-4" /> Print
          </button>
        </div>
      </div>
    </div>
  );
}
