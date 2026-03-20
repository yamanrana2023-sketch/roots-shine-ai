import { useSiteContent } from "@/contexts/SiteContentContext";
import { Phone, MapPin } from "lucide-react";

export default function Footer() {
  const { content } = useSiteContent();

  return (
    <footer className="bg-foreground text-primary-foreground/80">
      <div className="container mx-auto px-4 py-14">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={content.logoUrl} alt="Logo" className="h-12 w-12 rounded-xl object-cover border-2 border-primary-foreground/10" />
              <div>
                <span className="font-display font-bold text-primary-foreground text-lg block leading-tight">
                  The Roots Foundation
                </span>
                <span className="text-xs text-primary-foreground/40">Coaching Classes</span>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/50 leading-relaxed max-w-xs">
              Nurturing minds and building futures since 2018.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-primary-foreground mb-4 text-base">Quick Links</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Home", href: "#home" },
                { label: "About", href: "#about" },
                { label: "Courses", href: "#courses" },
                { label: "Contact", href: "#contact" },
              ].map((l) => (
                <a key={l.href} href={l.href} className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors duration-200">
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-primary-foreground mb-4 text-base">Contact</h4>
            <div className="space-y-3">
              <a href={`tel:${content.contactPhone}`} className="flex items-center gap-2.5 text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                <Phone className="h-4 w-4 flex-shrink-0" />
                {content.contactPhone}
              </a>
              <a href={content.googleMapUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{content.contactAddress}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-5 text-center text-xs text-primary-foreground/30">
          © {new Date().getFullYear()} The Roots Foundation Coaching Classes. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
