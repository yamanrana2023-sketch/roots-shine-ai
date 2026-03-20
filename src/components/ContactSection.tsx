import { Phone, MapPin, ExternalLink } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSiteContent } from "@/contexts/SiteContentContext";

export default function ContactSection() {
  const { content } = useSiteContent();
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section id="contact" ref={sectionRef} className="section-padding section-alt opacity-0">
      <div className="container mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-3">
            Get In Touch
          </p>
          <h2 className="text-foreground text-balance">Contact Us</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <a
            href={`tel:${content.contactPhone}`}
            className="group flex flex-col items-center bg-card rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-border/50 text-center"
          >
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display font-bold text-foreground">Call Us</h3>
            <p className="mt-2 text-muted-foreground text-sm">{content.contactPhone}</p>
          </a>

          <a
            href={content.googleMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center bg-card rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-border/50 text-center"
          >
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display font-bold text-foreground">Visit Us</h3>
            <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
              {content.contactAddress}
            </p>
          </a>

          <a
            href={`https://wa.me/${content.contactPhone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center bg-card rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-border/50 text-center"
          >
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <ExternalLink className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display font-bold text-foreground">WhatsApp</h3>
            <p className="mt-2 text-muted-foreground text-sm">Message us on WhatsApp</p>
          </a>
        </div>
      </div>
    </section>
  );
}
