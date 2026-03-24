import { useState } from "react";
import { Key, Mail, MessageSquare, Save, Info } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettings() {
  const [razorpay, setRazorpay] = useState({ keyId: "", keySecret: "" });
  const [email, setEmail] = useState({ smtpHost: "", smtpPort: "", smtpUser: "", smtpPass: "" });
  const [sms, setSms] = useState({ provider: "", apiKey: "", senderId: "" });

  const handleSave = (section: string) => {
    toast.info(`${section} settings saved locally. Backend integration coming soon.`);
  };

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">Configuration Settings</p>
          <p className="text-xs text-muted-foreground mt-1">
            These settings will be used for Razorpay payments, email notifications, and SMS alerts. Backend integration is under development.
          </p>
        </div>
      </div>

      {/* Razorpay */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
          <Key className="h-5 w-5 text-primary" />
          <h3 className="font-display font-bold text-foreground text-lg">Razorpay Integration</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Key ID</label>
            <input value={razorpay.keyId} onChange={(e) => setRazorpay({ ...razorpay, keyId: e.target.value })} placeholder="rzp_live_..." className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Key Secret</label>
            <input type="password" value={razorpay.keySecret} onChange={(e) => setRazorpay({ ...razorpay, keySecret: e.target.value })} placeholder="••••••••" className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
          <button onClick={() => handleSave("Razorpay")} className="inline-flex items-center gap-2 gradient-bg text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition-all">
            <Save className="h-4 w-4" /> Save Razorpay Config
          </button>
        </div>
      </div>

      {/* Email */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="font-display font-bold text-foreground text-lg">Email Configuration</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">SMTP Host</label>
            <input value={email.smtpHost} onChange={(e) => setEmail({ ...email, smtpHost: e.target.value })} placeholder="smtp.gmail.com" className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">SMTP Port</label>
            <input value={email.smtpPort} onChange={(e) => setEmail({ ...email, smtpPort: e.target.value })} placeholder="587" className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Username</label>
            <input value={email.smtpUser} onChange={(e) => setEmail({ ...email, smtpUser: e.target.value })} placeholder="user@gmail.com" className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Password</label>
            <input type="password" value={email.smtpPass} onChange={(e) => setEmail({ ...email, smtpPass: e.target.value })} placeholder="••••••••" className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
        </div>
        <button onClick={() => handleSave("Email")} className="mt-4 inline-flex items-center gap-2 gradient-bg text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition-all">
          <Save className="h-4 w-4" /> Save Email Config
        </button>
      </div>

      {/* SMS */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="font-display font-bold text-foreground text-lg">SMS Configuration</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">SMS Provider</label>
            <select value={sms.provider} onChange={(e) => setSms({ ...sms, provider: e.target.value })} className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all">
              <option value="">Select provider...</option>
              <option value="twilio">Twilio</option>
              <option value="msg91">MSG91</option>
              <option value="textlocal">TextLocal</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">API Key</label>
            <input value={sms.apiKey} onChange={(e) => setSms({ ...sms, apiKey: e.target.value })} placeholder="Your API key" className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Sender ID</label>
            <input value={sms.senderId} onChange={(e) => setSms({ ...sms, senderId: e.target.value })} placeholder="ROOTSF" className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
          <button onClick={() => handleSave("SMS")} className="inline-flex items-center gap-2 gradient-bg text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition-all">
            <Save className="h-4 w-4" /> Save SMS Config
          </button>
        </div>
      </div>
    </div>
  );
}
