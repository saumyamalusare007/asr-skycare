import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import BookingConfirmation from "./pages/BookingConfirmation";
import AdminPage from "./pages/AdminPage";
import ServicesPage from "./pages/ServicesPage";
import FleetPage from "./pages/FleetPage";
import NotFound from "./pages/NotFound";
import { WhatsAppButton } from "./components/WhatsAppButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/fleet" element={<FleetPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WhatsAppButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
