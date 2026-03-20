import { useSiteContent } from "@/contexts/SiteContentContext";

export default function Footer() {
  const { content } = useSiteContent();

  return (
    <footer className="bg-foreground text-primary-foreground/80 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={content.logoUrl} alt="Logo" className="h-10 w-10 rounded-lg object-cover" />
            <div>
              <span className="font-display font-bold text-primary-foreground text-lg block">
                The Roots Foundation
              </span>
              <span className="text-xs text-primary-foreground/50">Coaching Classes</span>
            </div>
          </div>

          <div className="flex gap-6 text-sm">
            <a href="#home" className="hover:text-primary-foreground transition-colors">Home</a>
            <a href="#about" className="hover:text-primary-foreground transition-colors">About</a>
            <a href="#courses" className="hover:text-primary-foreground transition-colors">Courses</a>
            <a href="#contact" className="hover:text-primary-foreground transition-colors">Contact</a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/40">
          © {new Date().getFullYear()} The Roots Foundation Coaching Classes. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
