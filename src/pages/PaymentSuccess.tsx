import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle, Plane, Calendar, MapPin, Phone, ArrowRight,
  Ambulance, MessageCircle, PhoneCall, Clock, Shield, HeartPulse
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";

interface BookingData {
  bookingId: string;
  patientName: string;
  originCity?: { name: string; code: string };
  destinationCity?: { name: string; code: string };
  flightDate: string;
  quotedPrice: number;
  selectedService?: { title: string; aircraft: string };
  ambulancePickup: boolean;
  ambulanceDropoff: boolean;
}

const timelineSteps = [
  { id: 1, label: "Payment Received", icon: CheckCircle, status: "completed" },
  { id: 2, label: "Pilot Assigned", icon: Plane, status: "current" },
  { id: 3, label: "Ambulance Dispatched", icon: Ambulance, status: "upcoming" },
  { id: 4, label: "Airborne", icon: HeartPulse, status: "upcoming" },
];

export default function PaymentSuccess() {
  const [booking, setBooking] = useState<BookingData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("confirmedBooking");
    if (stored) {
      setBooking(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
          >
            {/* Success Animation */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <CheckCircle className="h-12 w-12 text-success" />
                </motion.div>
              </motion.div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                Booking Confirmed!
              </h1>
              <p className="text-muted-foreground text-lg">
                Your air ambulance mission is now active
              </p>
              {booking?.bookingId && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Booking ID: <span className="font-bold text-foreground">{booking.bookingId}</span>
                </p>
              )}
            </div>

            {/* Booking Summary Card */}
            {booking && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bento-card mb-6"
              >
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Patient</p>
                    <p className="text-lg font-bold text-foreground">{booking.patientName}</p>
                  </div>
                  <span className="px-4 py-2 rounded-full bg-success/10 text-success text-sm font-semibold">
                    Confirmed
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Plane className="h-3 w-3" /> Aircraft
                    </p>
                    <p className="text-sm font-medium">{booking.selectedService?.aircraft || "To be assigned"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Route
                    </p>
                    <p className="text-sm font-medium">
                      {booking.originCity?.code || "—"} → {booking.destinationCity?.code || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Date
                    </p>
                    <p className="text-sm font-medium">{booking.flightDate || "TBD"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className="text-sm font-bold text-success">Confirmed</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Animated Mission Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bento-card mb-6"
            >
              <h3 className="font-display font-semibold text-foreground mb-6">Mission Timeline</h3>
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-6">
                  {timelineSteps.map((step, index) => {
                    const isCompleted = step.status === "completed";
                    const isCurrent = step.status === "current";
                    const showAmbulanceHighlight = step.id === 3 && (booking?.ambulancePickup || booking?.ambulanceDropoff);
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.15 }}
                        className="relative flex items-center gap-4 pl-1"
                      >
                        <motion.div
                          className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                            isCompleted
                              ? "bg-success border-success text-white"
                              : isCurrent
                              ? "bg-info border-info text-white animate-pulse-glow"
                              : "bg-card border-border text-muted-foreground"
                          }`}
                          animate={isCurrent ? { boxShadow: ["0 0 0 0 hsla(199, 89%, 48%, 0.4)", "0 0 0 12px hsla(199, 89%, 48%, 0)", "0 0 0 0 hsla(199, 89%, 48%, 0.4)"] } : {}}
                          transition={isCurrent ? { repeat: Infinity, duration: 2 } : {}}
                        >
                          <step.icon className="h-5 w-5" />
                        </motion.div>
                        <div className="flex-1">
                          <p className={`font-medium text-sm ${isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.label}
                          </p>
                          {isCompleted && (
                            <p className="text-xs text-success">Completed</p>
                          )}
                          {isCurrent && (
                            <p className="text-xs text-info font-medium">In Progress...</p>
                          )}
                          {showAmbulanceHighlight && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-warning/10 text-warning text-xs font-medium">
                              <Ambulance className="h-3 w-3" />
                              Ambulance Needed
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Next Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bento-card text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-aviation-red/10 flex items-center justify-center">
                  <Ambulance className="h-6 w-6 text-aviation-red" />
                </div>
                <h4 className="font-semibold text-sm mb-1">Ground Ambulance</h4>
                <p className="text-xs text-muted-foreground">Coordination in progress</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bento-card text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-info/10 flex items-center justify-center">
                  <HeartPulse className="h-6 w-6 text-info" />
                </div>
                <h4 className="font-semibold text-sm mb-1">Hospital Bed</h4>
                <p className="text-xs text-muted-foreground">Reservation confirmed</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="bento-card text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-success/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-success" />
                </div>
                <h4 className="font-semibold text-sm mb-1">Insurance</h4>
                <p className="text-xs text-muted-foreground">Paperwork processing</p>
              </motion.div>
            </div>

            {/* Help & Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="bento-card"
            >
              <h3 className="font-semibold text-foreground mb-4">Help & Support</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href="https://wa.me/919829538079?text=Hi%20ASR%20Aviation%2C%20I%20need%20help%20with%20my%20booking"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-success/5 border border-success/20 hover:bg-success/10 transition-colors min-h-[48px]"
                >
                  <MessageCircle className="h-5 w-5 text-success" />
                  <span className="text-sm font-medium">WhatsApp Support</span>
                </a>
                <a
                  href="tel:9829538079"
                  className="flex items-center gap-3 p-4 rounded-xl bg-aviation-red/5 border border-aviation-red/20 hover:bg-aviation-red/10 transition-colors min-h-[48px]"
                >
                  <PhoneCall className="h-5 w-5 text-aviation-red" />
                  <span className="text-sm font-medium">Call Dispatch</span>
                </a>
                <Link
                  to="/"
                  className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors min-h-[48px]"
                >
                  <ArrowRight className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Return Home</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
