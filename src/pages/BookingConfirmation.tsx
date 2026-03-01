import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Plane, Calendar, MapPin, Phone, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface ConfirmedBooking {
  bookingId: string;
  patientName: string;
  originCity: { name: string; code: string };
  destinationCity: { name: string; code: string };
  flightDate: string;
  quotedPrice: number;
  selectedService: { title: string };
}

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<ConfirmedBooking | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("confirmedBooking");
    if (stored) {
      setBooking(JSON.parse(stored));
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center"
            >
              <CheckCircle className="h-10 w-10 text-success" />
            </motion.div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your air ambulance has been successfully booked. Our operations team will contact you shortly.
            </p>

            <div className="bento-card text-left mb-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="text-xl font-bold text-foreground">{booking.bookingId}</p>
                </div>
                <span className="px-4 py-2 rounded-full bg-success/10 text-success font-semibold">
                  Confirmed
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Patient</p>
                  <p className="font-medium">{booking.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Service</p>
                  <p className="font-medium">{booking.selectedService?.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Route
                  </p>
                  <p className="font-medium">
                    {booking.originCity?.name} → {booking.destinationCity?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Date
                  </p>
                  <p className="font-medium">{booking.flightDate}</p>
                </div>
              </div>
            </div>

            <div className="bento-card text-left mb-8">
              <h3 className="font-semibold mb-4">What's Next?</h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0">1</span>
                  <p className="text-sm text-muted-foreground">Our operations team will call you within <strong className="text-foreground">15 minutes</strong> to confirm details</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0">2</span>
                  <p className="text-sm text-muted-foreground">Medical crew and aircraft will be <strong className="text-foreground">dispatched to your location</strong></p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0">3</span>
                  <p className="text-sm text-muted-foreground">Track your mission status in <strong className="text-foreground">real-time via SMS updates</strong></p>
                </li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Receipt
              </Button>
              <Link to="/">
                <Button variant="aviation" className="gap-2">
                  Return to Home
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">
                Need immediate assistance?
              </p>
              <a href="tel:9829538079" className="inline-flex items-center gap-2 text-aviation-red font-semibold hover:underline">
                <Phone className="h-5 w-5" />
                9829538079 (24/7)
              </a>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
