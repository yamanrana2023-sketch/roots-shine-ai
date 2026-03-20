import { useState, useEffect } from "react";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { SiteContent } from "@/lib/siteContent";
import { signIn, signOut, getSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft, Save, Eye, Loader2, LayoutDashboard, Type, FileText,
  Phone as PhoneIcon, Image as ImageIcon, Link, LogOut, ImagePlus, Trash2, Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { Session } from "@supabase/supabase-js";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const { content, loading, updateContent } = useSiteContent();
  const [form, setForm] = useState<SiteContent>(content);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });
    getSession().then((s) => {
      setSession(s);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) setForm(content);
  }, [loading, content]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      await signIn(email, pass);
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setSession(null);
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await updateContent(form);
    setSaving(false);
    ok ? toast.success("Changes saved!") : toast.error("Failed to save.");
  };

  const update = (key: keyof SiteContent, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addPoster = () => {
    update("posters", [...form.posters, ""]);
  };

  const updatePoster = (index: number, value: string) => {
    const posters = [...form.posters];
    posters[index] = value;
    update("posters", posters);
  };

  const removePoster = (index: number) => {
    update("posters", form.posters.filter((_, i) => i !== index));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <form onSubmit={handleLogin} className="bg-card rounded-2xl shadow-xl p-8 w-full max-w-sm border border-border">
          <div className="flex items-center justify-center mb-6">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="h-7 w-7 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-1 text-center">Admin Panel</h2>
          <p className="text-sm text-muted-foreground mb-6 text-center">Sign in to manage your website</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 mb-3 transition-shadow"
          />
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Password"
            className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4 transition-shadow"
          />
          <button
            type="submit"
            disabled={loginLoading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 active:scale-[0.97] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loginLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loginLoading ? "Signing in..." : "Sign In"}
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
            <button onClick={() => navigate("/")} className="p-2 rounded-xl hover:bg-muted active:scale-95 transition-all">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-display font-bold text-foreground">Site Manager</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-muted-foreground truncate max-w-[160px]">{session.user.email}</span>
            <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-muted active:scale-95 transition-all text-muted-foreground hover:text-foreground" title="Logout">
              <LogOut className="h-4 w-4" />
            </button>
            <a href="/" target="_blank" className="hidden sm:inline-flex items-center gap-2 border border-border px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors">
              <Eye className="h-4 w-4" /> Preview
            </a>
            <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition-all disabled:opacity-60">
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
          <Field label="Background Image URL (leave empty for default)" value={form.heroBgUrl} onChange={(v) => update("heroBgUrl", v)} />
          {form.heroBgUrl && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-2">Preview:</p>
              <img src={form.heroBgUrl} alt="Hero BG" className="h-24 w-40 rounded-xl object-cover border border-border" />
            </div>
          )}
        </Section>

        {/* Registration */}
        <Section title="Registration Form" icon={<Link className="h-5 w-5 text-primary" />}>
          <Field label="Google Form URL" value={form.registrationFormUrl} onChange={(v) => update("registrationFormUrl", v)} />
        </Section>

        {/* About */}
        <Section title="About Section" icon={<FileText className="h-5 w-5 text-primary" />}>
          <Field label="Section Title" value={form.aboutTitle} onChange={(v) => update("aboutTitle", v)} />
          <Field label="Description" value={form.aboutText} onChange={(v) => update("aboutText", v)} textarea />
          <Field label="Image URL" value={form.aboutImageUrl} onChange={(v) => update("aboutImageUrl", v)} />
          <Field label="Video URL (optional, replaces image)" value={form.aboutVideoUrl} onChange={(v) => update("aboutVideoUrl", v)} />
          {form.aboutImageUrl && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-2">Preview:</p>
              <img src={form.aboutImageUrl} alt="About" className="h-24 w-32 rounded-xl object-cover border border-border" />
            </div>
          )}
        </Section>

        {/* Course Posters */}
        <Section title="Course Posters" icon={<ImagePlus className="h-5 w-5 text-primary" />}>
          <p className="text-xs text-muted-foreground mb-3">Add poster image URLs. These will show as a scrollable gallery on the website.</p>
          <div className="space-y-3">
            {form.posters.map((url, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex-1">
                  <input
                    value={url}
                    onChange={(e) => updatePoster(i, e.target.value)}
                    placeholder={`Poster ${i + 1} URL`}
                    className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                  {url && (
                    <img src={url} alt={`Poster ${i + 1}`} className="mt-2 h-20 rounded-lg object-cover border border-border" />
                  )}
                </div>
                <button
                  onClick={() => removePoster(i)}
                  className="mt-2 p-2 rounded-lg hover:bg-destructive/10 text-destructive/70 hover:text-destructive transition-colors"
                  title="Remove poster"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addPoster}
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Poster
          </button>
        </Section>

        {/* Contact */}
        <Section title="Contact Info" icon={<PhoneIcon className="h-5 w-5 text-primary" />}>
          <Field label="Phone Number" value={form.contactPhone} onChange={(v) => update("contactPhone", v)} />
          <Field label="Address" value={form.contactAddress} onChange={(v) => update("contactAddress", v)} textarea />
          <Field label="Google Maps Link" value={form.googleMapUrl} onChange={(v) => update("googleMapUrl", v)} />
        </Section>

        {/* Branding */}
        <Section title="Branding" icon={<ImageIcon className="h-5 w-5 text-primary" />}>
          <Field label="Logo URL" value={form.logoUrl} onChange={(v) => update("logoUrl", v)} />
          {form.logoUrl && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-2">Logo Preview:</p>
              <img src={form.logoUrl} alt="Logo" className="h-16 w-16 rounded-xl object-cover border border-border" />
            </div>
          )}
        </Section>

        <div className="text-center text-xs text-muted-foreground pb-8 pt-4">
          Changes reflect immediately after save.
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

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  const cls = "w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all";
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
