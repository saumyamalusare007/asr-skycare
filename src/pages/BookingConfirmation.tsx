import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircle, Plane, Calendar, MapPin, Phone, Download, ArrowRight,
  Ambulance, Building2, FileCheck, Clock, Shield, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { formatINR } from "@/lib/data";

interface ConfirmedBooking {
  bookingId: string;
  patientName: string;
  originCity: { name: string; code: string };
  destinationCity: { name: string; code: string };
  flightDate: string;
  quotedPrice: number;
  selectedService: { title: string };
  ambulancePickup?: boolean;
  ambulanceDropoff?: boolean;
}

const timelineSteps = [
  { step: 1, label: "Payment Confirmed", icon: CheckCircle, completed: true },
  { step: 2, label: "Aircraft Prep", icon: Plane, completed: false },
  { step: 3, label: "Ground Ambulance", icon: Ambulance, completed: false },
  { step: 4, label: "Mission Active", icon: Activity, completed: false },
];

const nextStepServices = [
  { 
    icon: Ambulance, 
    title: "Ground Ambulance Coordination",
    description: "Our team is coordinating road transport",
    status: "In Progress"
  },
  { 
    icon: Building2, 
    title: "Hospital Bed Reservation",
    description: "Confirming ICU/bed availability",
    status: "Pending Confirmation"
  },
  { 
    icon: FileCheck, 
    title: "Insurance Paperwork",
    description: "Processing your insurance claim",
    status: "Submitted"
  },
];

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<ConfirmedBooking | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const stored = localStorage.getItem("confirmedBooking");
    if (stored) {
      setBooking(JSON.parse(stored));
      // Animate timeline
      const timer = setTimeout(() => setCurrentStep(2), 2000);
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
          >
            {/* Success Animation */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <CheckCircle className="h-12 w-12 text-success" />
                </motion.div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4"
              >
                Booking Confirmed!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-muted-foreground"
              >
                Your air ambulance mission is now active. Our operations team will contact you shortly.
              </motion.p>
            </div>

            {/* Booking Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bento-card mb-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-border gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="text-xl font-bold text-foreground font-mono">{booking.bookingId}</p>
                </div>
                <span className="self-start sm:self-auto px-4 py-2 rounded-full bg-success/10 text-success font-semibold text-sm flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  Mission Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Patient</p>
                  <p className="font-medium text-foreground">{booking.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Service</p>
                  <p className="font-medium text-foreground">{booking.selectedService?.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Route
                  </p>
                  <p className="font-medium text-foreground">
                    {booking.originCity?.name} → {booking.destinationCity?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Date
                  </p>
                  <p className="font-medium text-foreground">{booking.flightDate}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-aviation-red/5 border border-aviation-red/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Paid</span>
                  <span className="text-2xl font-bold text-aviation-red">{formatINR(booking.quotedPrice)}</span>
                </div>
              </div>
            </motion.div>

            {/* Live Mission Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bento-card mb-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Activity className="h-5 w-5 text-aviation-red" />
                <h3 className="font-semibold text-foreground">Mission Timeline</h3>
                <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  Live
                </span>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between">
                  {timelineSteps.map((step, index) => {
                    const isCompleted = currentStep > step.step;
                    const isCurrent = currentStep === step.step;
                    return (
                      <div key={step.step} className="flex flex-col items-center relative z-10 flex-1">
                        <motion.div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                            isCompleted
                              ? "bg-success border-success text-white"
                              : isCurrent
                              ? "bg-aviation-red border-aviation-red text-white"
                              : "bg-background border-border text-muted-foreground"
                          }`}
                          animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                          ) : (
                            <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                          )}
                        </motion.div>
                        <span className={`mt-2 text-[10px] sm:text-xs font-medium text-center ${
                          isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* Progress Line */}
                <div className="absolute top-5 sm:top-6 left-[12%] right-[12%] h-0.5 bg-border -z-0">
                  <motion.div
                    className="h-full bg-gradient-to-r from-success to-aviation-red"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((currentStep - 1) / (timelineSteps.length - 1)) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Next Step Services - Bento Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-8"
            >
              <h3 className="font-semibold text-foreground mb-4">Next Steps</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {nextStepServices.map((service, index) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="bento-card p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <service.icon className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <h4 className="font-medium text-sm text-foreground mb-1">{service.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{service.description}</p>
                    <span className="text-xs font-medium text-aviation-red">{service.status}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
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
            </div>

            {/* Emergency Contact */}
            <div className="text-center pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2 flex items-center justify-center gap-2">
                <Shield className="h-4 w-4" />
                Need immediate assistance?
              </p>
              <a href="tel:1800-ASR-HELP" className="inline-flex items-center gap-2 text-aviation-red font-semibold hover:underline min-h-[48px]">
                <Phone className="h-5 w-5" />
                1800-ASR-HELP (24/7)
              </a>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
