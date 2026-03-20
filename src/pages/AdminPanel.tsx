import { useState, useEffect } from "react";
import { getSiteContent, saveSiteContent, SiteContent } from "@/lib/siteContent";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ADMIN_PASSWORD = "roots@2025";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [content, setContent] = useState<SiteContent>(getSiteContent());

  useEffect(() => {
    const s = sessionStorage.getItem("roots-admin");
    if (s === "true") setAuthed(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem("roots-admin", "true");
    } else {
      toast.error("Incorrect password");
    }
  };

  const handleSave = () => {
    saveSiteContent(content);
    toast.success("Changes saved! Refresh homepage to see updates.");
  };

  const update = (key: keyof SiteContent, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <form onSubmit={handleLogin} className="bg-card rounded-2xl shadow-lg p-8 w-full max-w-sm border border-border">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Admin Login</h2>
          <p className="text-sm text-muted-foreground mb-6">Enter admin password to continue</p>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Password"
            className="w-full border border-input rounded-lg px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring mb-4"
          />
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold hover:opacity-90 active:scale-[0.97] transition-all"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-lg hover:bg-muted active:scale-95 transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-display font-bold text-foreground">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              <Eye className="h-4 w-4" />
              Preview
            </a>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition-all"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
        {/* Hero Section */}
        <Section title="Hero Section">
          <Field label="Hero Title" value={content.heroTitle} onChange={(v) => update("heroTitle", v)} />
          <Field label="Hero Subtitle" value={content.heroSubtitle} onChange={(v) => update("heroSubtitle", v)} textarea />
        </Section>

        {/* Registration */}
        <Section title="Registration Form">
          <Field label="Google Form URL" value={content.registrationFormUrl} onChange={(v) => update("registrationFormUrl", v)} />
        </Section>

        {/* About */}
        <Section title="About Section">
          <Field label="Title" value={content.aboutTitle} onChange={(v) => update("aboutTitle", v)} />
          <Field label="Description" value={content.aboutText} onChange={(v) => update("aboutText", v)} textarea />
          <Field label="About Image URL (leave empty for default)" value={content.aboutImageUrl} onChange={(v) => update("aboutImageUrl", v)} />
          <Field label="About Video URL (optional, overrides image)" value={content.aboutVideoUrl} onChange={(v) => update("aboutVideoUrl", v)} />
        </Section>

        {/* Contact */}
        <Section title="Contact Info">
          <Field label="Phone Number" value={content.contactPhone} onChange={(v) => update("contactPhone", v)} />
          <Field label="Address" value={content.contactAddress} onChange={(v) => update("contactAddress", v)} textarea />
          <Field label="Google Maps Link" value={content.googleMapUrl} onChange={(v) => update("googleMapUrl", v)} />
        </Section>

        {/* Logo */}
        <Section title="Branding">
          <Field label="Logo URL" value={content.logoUrl} onChange={(v) => update("logoUrl", v)} />
          {content.logoUrl && (
            <img src={content.logoUrl} alt="Logo preview" className="h-16 w-16 rounded-xl object-cover mt-2 border border-border" />
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <h3 className="font-display font-bold text-foreground text-lg mb-5 pb-3 border-b border-border">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  const cls =
    "w-full border border-input rounded-lg px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";
  return (
    <div>
      <label className="text-sm font-medium text-foreground block mb-1.5">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} className={cls} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </div>
  );
}
