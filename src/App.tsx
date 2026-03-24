import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteContentProvider } from "@/contexts/SiteContentContext";
import Index from "./pages/Index.tsx";
import AdminPanel from "./pages/AdminPanel.tsx";
import PayFees from "./pages/PayFees.tsx";
import PaymentSuccess from "./pages/PaymentSuccess.tsx";
import Courses from "./pages/Courses.tsx";
import CourseAccess from "./pages/CourseAccess.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SiteContentProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/pay-fees" element={<PayFees />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course-access" element={<CourseAccess />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SiteContentProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
