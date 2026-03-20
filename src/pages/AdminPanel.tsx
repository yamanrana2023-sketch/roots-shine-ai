import { useState, useEffect } from "react";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { SiteContent } from "@/lib/siteContent";
import { ArrowLeft, Save, Eye, Loader2, LayoutDashboard, Type, FileText, Phone as PhoneIcon, Image, Link } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ADMIN_PASSWORD = "roots@2025";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const { content, loading, updateContent } = useSiteContent();
  const [form, setForm] = useState<SiteContent>(content);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const s = sessionStorage.getItem("roots-admin");
    if (s === "true") setAuthed(true);
  }, []);

  useEffect(() => {
    if (!loading) setForm(content);
  }, [loading, content]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem("roots-admin", "true");
    } else {
      toast.error("Incorrect password");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await updateContent(form);
    setSaving(false);
    if (ok) {
      toast.success("Changes saved to database!");
    } else {
      toast.error("Failed to save. Check Supabase connection.");
    }
  };

  const update = (key: keyof SiteContent, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <form onSubmit={handleLogin} className="bg-card rounded-2xl shadow-xl p-8 w-full max-w-sm border border-border">
          <div className="flex items-center justify-center mb-6">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="h-7 w-7 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-1 text-center">Admin Panel</h2>
          <p className="text-sm text-muted-foreground mb-6 text-center">Enter password to manage your website</p>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Password"
            className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4 transition-shadow"
          />
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 active:scale-[0.97] transition-all"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-xl hover:bg-muted active:scale-95 transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-display font-bold text-foreground">Site Manager</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-2 border border-border px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
            >
              <Eye className="h-4 w-4" />
              Preview
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition-all disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        {/* Hero */}
        <Section title="Hero Section" icon={<Type className="h-5 w-5 text-primary" />}>
          <Field label="Main Headline" value={form.heroTitle} onChange={(v) => update("heroTitle", v)} />
          <Field label="Subtitle" value={form.heroSubtitle} onChange={(v) => update("heroSubtitle", v)} textarea />
        </Section>

        {/* Registration */}
        <Section title="Registration Form" icon={<Link className="h-5 w-5 text-primary" />}>
          <Field label="Google Form URL" value={form.registrationFormUrl} onChange={(v) => update("registrationFormUrl", v)} />
        </Section>

        {/* About */}
        <Section title="About Section" icon={<FileText className="h-5 w-5 text-primary" />}>
          <Field label="Section Title" value={form.aboutTitle} onChange={(v) => update("aboutTitle", v)} />
          <Field label="Description" value={form.aboutText} onChange={(v) => update("aboutText", v)} textarea />
          <Field label="Image URL (leave empty for default)" value={form.aboutImageUrl} onChange={(v) => update("aboutImageUrl", v)} />
          <Field label="Video URL (optional, replaces image)" value={form.aboutVideoUrl} onChange={(v) => update("aboutVideoUrl", v)} />
          {form.aboutImageUrl && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-2">Preview:</p>
              <img src={form.aboutImageUrl} alt="Preview" className="h-24 w-32 rounded-xl object-cover border border-border" />
            </div>
          )}
        </Section>

        {/* Contact */}
        <Section title="Contact Info" icon={<PhoneIcon className="h-5 w-5 text-primary" />}>
          <Field label="Phone Number" value={form.contactPhone} onChange={(v) => update("contactPhone", v)} />
          <Field label="Address" value={form.contactAddress} onChange={(v) => update("contactAddress", v)} textarea />
          <Field label="Google Maps Link" value={form.googleMapUrl} onChange={(v) => update("googleMapUrl", v)} />
        </Section>

        {/* Branding */}
        <Section title="Branding" icon={<Image className="h-5 w-5 text-primary" />}>
          <Field label="Logo URL" value={form.logoUrl} onChange={(v) => update("logoUrl", v)} />
          {form.logoUrl && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-2">Logo Preview:</p>
              <img src={form.logoUrl} alt="Logo" className="h-16 w-16 rounded-xl object-cover border border-border" />
            </div>
          )}
        </Section>

        <div className="text-center text-xs text-muted-foreground pb-8 pt-4">
          Data is stored in Supabase. Changes reflect immediately after save.
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
        {icon}
        <h3 className="font-display font-bold text-foreground text-lg">{title}</h3>
      </div>
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
    "w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all";
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
