import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Clock, ArrowLeft, Download, Home } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border p-8 max-w-md w-full shadow-xl text-center">
        <div className={`h-20 w-20 rounded-full ${isPending ? "bg-accent/10" : "bg-primary/10"} flex items-center justify-center mx-auto mb-6`}>
          {isPending ? (
            <Clock className="h-10 w-10 text-accent" />
          ) : (
            <CheckCircle className="h-10 w-10 text-primary" />
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
          <div className="bg-muted/50 rounded-xl p-5 mb-6 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Student</span>
              <span className="font-medium text-foreground">{info.studentName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium text-foreground">{info.phone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Course</span>
              <span className="font-medium text-foreground">{info.course}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-bold text-primary text-lg">
                ₹{info.amount?.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium text-foreground">{new Date().toLocaleDateString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className={`font-semibold ${isPending ? "text-accent" : "text-primary"}`}>
                {isPending ? "Pending" : "Paid"}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex-1 inline-flex items-center justify-center gap-2 border border-border px-4 py-3 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
          >
            <Home className="h-4 w-4" /> Home
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
          >
            <Download className="h-4 w-4" /> Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
