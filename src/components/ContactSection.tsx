import { Phone, MapPin, MessageCircle } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSiteContent } from "@/contexts/SiteContentContext";

export default function ContactSection() {
  const { content } = useSiteContent();
  const sectionRef = useScrollReveal<HTMLElement>();

  const cards = [
    {
      icon: Phone,
      title: "Call Us",
      text: content.contactPhone,
      href: `tel:${content.contactPhone}`,
      color: "bg-primary/10 text-primary",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      text: content.contactAddress,
      href: content.googleMapUrl,
      external: true,
      color: "bg-accent/10 text-accent",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      text: "Chat with us instantly",
      href: `https://wa.me/${content.contactPhone.replace(/[^0-9]/g, "")}`,
      external: true,
      color: "bg-green-500/10 text-green-600",
    },
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-20 md:py-28 section-alt opacity-0">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-sm font-bold text-accent uppercase tracking-widest mb-3">
            Get In Touch
          </p>
          <h2 className="text-foreground text-balance">Contact Us</h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto text-pretty">
            Have questions? Reach out to us through any of these channels.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {cards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              target={card.external ? "_blank" : undefined}
              rel={card.external ? "noopener noreferrer" : undefined}
              className="group flex flex-col items-center bg-card rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 text-center hover:-translate-y-1"
            >
              <div className={`h-14 w-14 rounded-2xl ${card.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-foreground text-lg">{card.title}</h3>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{card.text}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
