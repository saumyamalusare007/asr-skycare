import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircle, Plane, Calendar, MapPin, Phone, Download, ArrowRight, 
  MessageCircle, PhoneCall, Ambulance, Building2, FileText, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { MissionTimeline } from "@/components/booking/MissionTimeline";
import { formatINR } from "@/lib/data";
import { createMission } from "@/hooks/useMissions";

interface ConfirmedBooking {
  bookingId: string;
  patientName: string;
  originCity: { name: string; code: string };
  destinationCity: { name: string; code: string };
  flightDate: string;
  quotedPrice: number;
  selectedService: { title: string; aircraft: string };
  ambulancePickup?: boolean;
  ambulanceDropoff?: boolean;
  age?: string;
  condition?: string;
  contactPhone?: string;
  contactEmail?: string;
  passengers?: number;
  medicalNotes?: string;
}

const nextStepServices = [
  {
    icon: Ambulance,
    title: "Ground Ambulance",
    description: "Coordinating pickup transport",
    status: "In Progress",
    statusColor: "text-warning",
  },
  {
    icon: Building2,
    title: "Hospital Reservation",
    description: "Bed confirmed at destination",
    status: "Confirmed",
    statusColor: "text-success",
  },
  {
    icon: FileText,
    title: "Insurance Paperwork",
    description: "Documentation processing",
    status: "Pending",
    statusColor: "text-muted-foreground",
  },
];

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<ConfirmedBooking | null>(null);
  const [savedToDb, setSavedToDb] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("confirmedBooking");
    if (stored) {
      const parsed = JSON.parse(stored);
      setBooking(parsed);
      
      // Save to database if not already saved
      if (!savedToDb) {
        saveMissionToDatabase(parsed);
      }
    } else {
      navigate("/");
    }
  }, [navigate, savedToDb]);

  const saveMissionToDatabase = async (bookingData: ConfirmedBooking) => {
    try {
      await createMission({
        booking_id: bookingData.bookingId,
        patient_name: bookingData.patientName,
        patient_age: bookingData.age ? parseInt(bookingData.age) : null,
        patient_condition: bookingData.condition || null,
        service_type: bookingData.selectedService?.title || "Medical Transport",
        origin_city: bookingData.originCity?.name || "",
        origin_code: bookingData.originCity?.code || "",
        destination_city: bookingData.destinationCity?.name || "",
        destination_code: bookingData.destinationCity?.code || "",
        flight_date: bookingData.flightDate || null,
        passengers: bookingData.passengers || 1,
        ambulance_pickup: bookingData.ambulancePickup || false,
        ambulance_dropoff: bookingData.ambulanceDropoff || false,
        quoted_price: bookingData.quotedPrice,
        payment_status: "paid",
        mission_status: "payment_confirmed",
        status_step: 1,
        priority_level: bookingData.ambulancePickup || bookingData.ambulanceDropoff ? "high" : "normal",
        contact_phone: bookingData.contactPhone || null,
        contact_email: bookingData.contactEmail || null,
        medical_notes: bookingData.medicalNotes || null,
        operator_name: null,
        aircraft_model: bookingData.selectedService?.aircraft || null,
        aadhar_id: null,
      });
      setSavedToDb(true);
      console.log("Mission saved to database successfully");
    } catch (error) {
      console.error("Error saving mission to database:", error);
    }
  };

  if (!booking) return null;

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
            {/* Success Icon & Header */}
            <div className="text-center mb-8">
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
              <p className="text-lg text-muted-foreground">
                Your air ambulance mission is now active. Our operations team will contact you shortly.
              </p>
            </div>

            {/* Booking Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bento-card mb-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-border gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="text-xl font-bold text-foreground">{booking.bookingId}</p>
                </div>
                <span className="px-4 py-2 rounded-full bg-success/10 text-success font-semibold w-fit">
                  ✓ Payment Confirmed
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Patient</p>
                  <p className="font-medium text-foreground">{booking.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Aircraft</p>
                  <p className="font-medium text-foreground">{booking.selectedService?.aircraft}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Route
                  </p>
                  <p className="font-medium text-foreground">
                    {booking.originCity?.code} → {booking.destinationCity?.code}
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
              transition={{ delay: 0.4 }}
              className="bento-card mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-foreground">Mission Progress</h3>
                  <p className="text-sm text-muted-foreground">Live tracking of your mission status</p>
                </div>
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  Active
                </span>
              </div>
              
              <MissionTimeline 
                currentStep={1} 
                showAmbulance={booking.ambulancePickup || booking.ambulanceDropoff}
              />
            </motion.div>

            {/* Next Step Services Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <h3 className="font-semibold text-foreground mb-4">Coordinated Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {nextStepServices.map((service, index) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bento-card"
                  >
                    <div className="p-3 rounded-xl bg-primary/10 w-fit mb-3">
                      <service.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="font-medium text-foreground mb-1">{service.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                    <span className={`text-sm font-medium ${service.statusColor}`}>
                      {service.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Help & Support Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bento-card mb-8"
            >
              <h3 className="font-semibold text-foreground mb-4">Help & Support</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="https://wa.me/918001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-success/50 hover:bg-success/5 transition-all group"
                >
                  <div className="p-3 rounded-xl bg-success/10 group-hover:bg-success/20 transition-colors">
                    <MessageCircle className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">WhatsApp Support</p>
                    <p className="text-sm text-muted-foreground">Chat with our team</p>
                  </div>
                </a>
                
                <a
                  href="tel:18001234567"
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-aviation-red/50 hover:bg-aviation-red/5 transition-all group"
                >
                  <div className="p-3 rounded-xl bg-aviation-red/10 group-hover:bg-aviation-red/20 transition-colors">
                    <PhoneCall className="h-6 w-6 text-aviation-red" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Call Dispatch</p>
                    <p className="text-sm text-muted-foreground">1800-123-4567 (24/7)</p>
                  </div>
                </a>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Receipt
              </Button>
              <Link to="/">
                <Button variant="aviation" className="gap-2 w-full sm:w-auto">
                  Return to Home
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              Secured by ASR Aviation
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
