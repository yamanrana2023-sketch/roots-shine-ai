import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CoursesSection from "@/components/CoursesSection";
import StudyMaterialSection from "@/components/StudyMaterialSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import LeadCaptureForm from "@/components/LeadCaptureForm";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <CoursesSection />

      {/* Lead Capture */}
      <section className="section-padding section-alt">
        <div className="container mx-auto max-w-md text-center">
          <h2 className="text-foreground mb-2">Get in Touch</h2>
          <p className="text-muted-foreground text-sm mb-6">Leave your details and we'll contact you</p>
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm gradient-border">
            <LeadCaptureForm />
          </div>
        </div>
      </section>

      <StudyMaterialSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
