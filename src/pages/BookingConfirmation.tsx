import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, Download, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { SuccessAnimation } from "@/components/confirmation/SuccessAnimation";
import { BookingDetailsCard } from "@/components/confirmation/BookingDetailsCard";
import { MissionTimeline } from "@/components/confirmation/MissionTimeline";
import { NextStepsGrid } from "@/components/confirmation/NextStepsGrid";

interface ConfirmedBooking {
  bookingId: string;
  patientName: string;
  originCity: { name: string; code: string };
  destinationCity: { name: string; code: string };
  flightDate: string;
  quotedPrice: number;
  selectedService: { title: string; aircraft?: string };
  ambulancePickup?: boolean;
  ambulanceDropoff?: boolean;
}

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<ConfirmedBooking | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const stored = localStorage.getItem("confirmedBooking");
    if (stored) {
      setBooking(JSON.parse(stored));
      // Animate timeline progression
      const timer = setTimeout(() => setCurrentStep(2), 3000);
      return () => clearTimeout(timer);
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />
      <main className="pt-20 lg:pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            {/* Success Animation Header */}
            <SuccessAnimation 
              title="Booking Confirmed!"
              subtitle="Your air ambulance mission is now active. Our operations team will contact you shortly with pickup details."
            />

            {/* Booking Details Card */}
            <BookingDetailsCard
              bookingId={booking.bookingId}
              patientName={booking.patientName}
              originCity={booking.originCity}
              destinationCity={booking.destinationCity}
              flightDate={booking.flightDate}
              quotedPrice={booking.quotedPrice}
              selectedService={booking.selectedService}
              ambulancePickup={booking.ambulancePickup}
              ambulanceDropoff={booking.ambulanceDropoff}
            />

            {/* Live Mission Timeline */}
            <MissionTimeline currentStep={currentStep} />

            {/* Next Steps Bento Grid */}
            <NextStepsGrid />

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <Button variant="outline" className="gap-2 min-h-[48px]">
                <Download className="h-4 w-4" />
                Download Receipt
              </Button>
              <Link to="/">
                <Button variant="aviation" className="gap-2 w-full sm:w-auto min-h-[48px]">
                  Return to Home
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            {/* Emergency Contact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center pt-8 border-t border-border"
            >
              <p className="text-sm text-muted-foreground mb-2 flex items-center justify-center gap-2">
                <Shield className="h-4 w-4" />
                Need immediate assistance?
              </p>
              <a href="tel:1800-ASR-HELP" className="inline-flex items-center gap-2 text-aviation-red font-semibold hover:underline min-h-[48px]">
                <Phone className="h-5 w-5" />
                1800-ASR-HELP (24/7)
              </a>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
