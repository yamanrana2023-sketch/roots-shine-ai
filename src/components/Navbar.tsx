import { useState, useEffect } from "react";
import { Menu, X, Phone, CreditCard } from "lucide-react";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { content } = useSiteContent();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Courses", href: "#courses" },
    { label: "Store", href: "/store", isRoute: true },
    { label: "Study Material", href: "#study-material" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass shadow-sm" : "bg-transparent"}`}>
      <div className="container mx-auto flex items-center justify-between h-16 md:h-18 px-4">
        <a href="#home" className="flex items-center gap-3">
          {content.logoUrl && (
            <img src={content.logoUrl} alt="Logo" className="h-10 w-10 rounded-lg object-cover" />
          )}
          <span className={`font-display text-lg font-bold hidden sm:block transition-colors duration-300 ${scrolled ? "text-foreground" : "text-primary-foreground"}`}>
            The Roots Foundation
          </span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            (l as any).isRoute ? (
              <button key={l.href} onClick={() => navigate(l.href)} className={`text-sm font-medium transition-colors duration-200 ${scrolled ? "text-muted-foreground hover:text-primary" : "text-primary-foreground/70 hover:text-primary-foreground"}`}>
                {l.label}
              </button>
            ) : (
              <a key={l.href} href={l.href} className={`text-sm font-medium transition-colors duration-200 ${scrolled ? "text-muted-foreground hover:text-primary" : "text-primary-foreground/70 hover:text-primary-foreground"}`}>
                {l.label}
              </a>
            )
          ))}
          <button
            onClick={() => navigate("/pay-fees")}
            className="inline-flex items-center gap-2 gradient-bg text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 active:scale-[0.97] transition-all duration-200 glow-primary"
          >
            <CreditCard className="h-4 w-4" />
            Pay Fees
          </button>
          <a
            href={`tel:${content.contactPhone}`}
            className={`inline-flex items-center gap-2 border px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${scrolled ? "border-border text-foreground hover:bg-muted" : "border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"}`}
          >
            <Phone className="h-4 w-4" />
            Call Now
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden p-2 rounded-lg active:scale-95 transition-all ${scrolled ? "hover:bg-muted text-foreground" : "text-primary-foreground hover:bg-primary-foreground/10"}`}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass px-4 pb-4 shadow-lg animate-reveal-up">
          {links.map((l) => (
            (l as any).isRoute ? (
              <button key={l.href} onClick={() => { setOpen(false); navigate(l.href); }} className="block py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors w-full text-left">
                {l.label}
              </button>
            ) : (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {l.label}
              </a>
            )
          ))}
          <button
            onClick={() => { setOpen(false); navigate("/pay-fees"); }}
            className="inline-flex items-center gap-2 mt-2 gradient-bg text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold w-full justify-center"
          >
            <CreditCard className="h-4 w-4" />
            Pay Fees
          </button>
          <a
            href={`tel:${content.contactPhone}`}
            className="inline-flex items-center gap-2 mt-2 border border-border text-foreground px-5 py-2.5 rounded-xl text-sm font-semibold w-full justify-center"
          >
            <Phone className="h-4 w-4" />
            Call Now
          </a>
        </div>
      )}
    </nav>
  );
}
