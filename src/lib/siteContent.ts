export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  aboutImageUrl: string;
  aboutVideoUrl: string;
  registrationFormUrl: string;
  courses: { title: string; description: string; icon: string }[];
  contactPhone: string;
  contactAddress: string;
  googleMapUrl: string;
  logoUrl: string;
}

export const defaultContent: SiteContent = {
  heroTitle: "Nurturing Minds, Building Futures",
  heroSubtitle: "The Roots Foundation Coaching Classes provides quality education with personalized attention to help every student achieve their academic goals.",
  aboutTitle: "About The Roots Foundation",
  aboutText: "The Roots Foundation Coaching Classes is a premier coaching centre dedicated to providing high-quality education to students. Our experienced faculty, modern teaching methods, and student-centric approach ensure that every learner receives the guidance they need to excel. We believe in nurturing the roots of knowledge so that students can grow into confident, successful individuals. With a strong focus on conceptual clarity, regular assessments, and doubt-clearing sessions, we create an environment where learning thrives.",
  aboutImageUrl: "",
  aboutVideoUrl: "",
  registrationFormUrl: "https://forms.gle/9fruRLUtUhTMhmTRA",
  courses: [
    { title: "Class 6-8 Foundation", description: "Strong foundation building with focus on NCERT concepts, regular tests, and interactive learning for middle school students.", icon: "BookOpen" },
    { title: "Class 9-10 Board Prep", description: "Comprehensive preparation for CBSE board exams with detailed study material, mock tests, and personalized attention.", icon: "GraduationCap" },
    { title: "Class 11-12 Science", description: "Expert coaching for Physics, Chemistry, Mathematics & Biology with competitive exam orientation.", icon: "Atom" },
    { title: "Competitive Exams", description: "Specialized coaching for JEE, NEET, and other competitive examinations with proven strategies.", icon: "Trophy" },
  ],
  contactPhone: "+91 8285262890",
  contactAddress: "Godawari Marg, Shiv Vihar, Block G, Prem Nagar, Najafgarh, New Delhi, Delhi, 110043",
  googleMapUrl: "https://maps.app.goo.gl/H9WNhs6qLhXBNm88A",
  logoUrl: "https://i.ibb.co/HDM1Gv1S/x.jpg",
};
