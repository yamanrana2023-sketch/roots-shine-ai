import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { useSiteContent } from "@/contexts/SiteContentContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { content } = useSiteContent();

  const links = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Courses", href: "#courses" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="#home" className="flex items-center gap-3">
          <img
            src={content.logoUrl}
            alt="The Roots Foundation"
            className="h-10 w-10 rounded-lg object-cover"
          />
          <span className="font-display text-lg font-bold text-foreground hidden sm:block">
            The Roots Foundation
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
          <a
            href={`tel:${content.contactPhone}`}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition-all duration-200"
          >
            <Phone className="h-4 w-4" />
            Call Now
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-muted active:scale-95 transition-all"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-t border-border px-4 pb-4 animate-reveal-up">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href={`tel:${content.contactPhone}`}
            className="inline-flex items-center gap-2 mt-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold"
          >
            <Phone className="h-4 w-4" />
            Call Now
          </a>
        </div>
      )}
    </nav>
  );
}
