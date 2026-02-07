import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { FlightRouteMap } from "@/components/booking/FlightRouteMap";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Plane, Clock, Users, CreditCard, Wallet, Building2, Smartphone, 
  Plus, Minus, Check, Shield, Activity, Wind, Droplets, Heart, ChevronDown
} from "lucide-react";
import { formatINR, type IndianCity, type ServiceType } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/logo-asr.png";

interface BookingData {
  serviceType: string;
  patientName: string;
  age: string;
  contactPhone: string;
  contactEmail: string;
  condition: string;
  medicalNotes: string;
  origin: string;
  destination: string;
  flightDate: string;
  passengers: number;
  ambulancePickup: boolean;
  ambulanceDropoff: boolean;
  quotedPrice: number;
  originCity: IndianCity;
  destinationCity: IndianCity;
  selectedService: ServiceType;
}

const paymentMethods = [
  { id: "card", label: "Credit/Debit Card", icon: CreditCard },
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "netbanking", label: "Net Banking", icon: Building2 },
  { id: "wallet", label: "Digital Wallet", icon: Wallet },
];

const medicalEquipment = [
  { name: "Ventilator", status: "Ready", icon: Wind },
  { name: "Oxygen Supply", status: "100%", icon: Droplets },
  { name: "Defibrillator", status: "Charged", icon: Activity },
  { name: "IV Systems", status: "Prepared", icon: Heart },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [passengerCount, setPassengerCount] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    const storedBooking = localStorage.getItem("pendingBooking");
    if (storedBooking) {
      const parsed = JSON.parse(storedBooking);
      setBooking(parsed);
      setPassengerCount(parsed.passengers || 1);
    } else {
      navigate("/booking");
    }
  }, [navigate]);

  const handleConfirmBooking = async () => {
    if (!booking) return;
    
    setIsProcessing(true);
    
    try {
      const bookingId = `ASR-${Date.now().toString(36).toUpperCase()}`;
      
      // Save to database
      const { error } = await supabase.from("missions").insert({
        booking_id: bookingId,
        patient_name: booking.patientName,
        patient_age: parseInt(booking.age) || null,
        patient_condition: booking.condition,
        service_type: booking.serviceType,
        origin_city: booking.originCity?.name || "",
        origin_code: booking.originCity?.code || "",
        destination_city: booking.destinationCity?.name || "",
        destination_code: booking.destinationCity?.code || "",
        ambulance_pickup: booking.ambulancePickup,
        ambulance_dropoff: booking.ambulanceDropoff,
        quoted_price: booking.quotedPrice,
        payment_status: "paid",
        mission_status: "payment_confirmed",
        status_step: 1,
        contact_phone: booking.contactPhone,
        contact_email: booking.contactEmail,
        medical_notes: booking.medicalNotes,
        flight_date: booking.flightDate || null,
        passengers: passengerCount,
        aircraft_model: booking.selectedService?.aircraft || "King Air 350",
        priority_level: booking.ambulancePickup && booking.ambulanceDropoff ? "high" : "normal",
      });

      if (error) {
        console.error("Database error:", error);
        toast.error("Failed to save booking. Please try again.");
        setIsProcessing(false);
        return;
      }

      // Store in localStorage for confirmation page
      localStorage.setItem("confirmedBooking", JSON.stringify({
        ...booking,
        bookingId,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      }));
      
      toast.success("Booking confirmed successfully!");
      navigate("/booking-confirmation");
    } catch (err) {
      console.error("Error:", err);
      toast.error("An error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!booking) {
    return null;
  }

  const flightDuration = "2h 0m";
  const departureTime = "03:36 PM";
  const arrivalTime = "05:36 PM";
  const flightDate = booking.flightDate 
    ? new Date(booking.flightDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "TBD";

  // Price breakdown
  const basePrice = booking.selectedService?.priceRange 
    ? (booking.selectedService.priceRange.min + booking.selectedService.priceRange.max) / 2 
    : booking.quotedPrice;
  const ambulancePickupCost = booking.ambulancePickup ? 25000 : 0;
  const ambulanceDropoffCost = booking.ambulanceDropoff ? 25000 : 0;
  const totalPrice = basePrice + ambulancePickupCost + ambulanceDropoffCost;

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="ASR Aviation" className="h-8" />
          </div>
          <div className="text-sm text-muted-foreground hidden sm:block">
            24/7 Support: <span className="font-semibold text-foreground">+1-800-ASR-HELP</span>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                Flight Summary
              </h1>
              <span className="px-3 py-1 rounded-full bg-aviation-red text-white text-xs font-semibold uppercase">
                Medical Priority
              </span>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              {booking.selectedService?.aircraft || "King Air 350"} • Turboprop
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Flight Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Flight Route Card */}
              <div className="bento-card p-0 overflow-hidden">
                <div className="p-4 sm:p-6">
                  {/* Time & Route */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase mb-1">{flightDate}</p>
                      <p className="text-xl sm:text-2xl font-bold text-foreground">{departureTime}</p>
                    </div>
                    <div className="flex-1 px-2 sm:px-6">
                      <div className="relative flex items-center justify-center">
                        <div className="h-px flex-1 bg-border" />
                        <div className="px-2 sm:px-4 flex items-center gap-2">
                          <Plane className="h-4 w-4 text-muted-foreground -rotate-45" />
                          <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">{flightDuration}</span>
                        </div>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground uppercase mb-1">{flightDate}</p>
                      <p className="text-xl sm:text-2xl font-bold text-foreground">{arrivalTime}</p>
                    </div>
                  </div>

                  {/* City Codes */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-foreground">{booking.originCity?.code}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{booking.originCity?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl sm:text-3xl font-bold text-foreground">{booking.destinationCity?.code}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{booking.destinationCity?.name}</p>
                    </div>
                  </div>

                  {/* Map */}
                  {booking.originCity && booking.destinationCity && (
                    <FlightRouteMap
                      origin={booking.originCity}
                      destination={booking.destinationCity}
                    />
                  )}
                </div>
              </div>

              {/* Passengers & Patient */}
              <div className="bento-card">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">Passengers & Patient</h3>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">{booking.patientName}</p>
                    <p className="text-sm text-muted-foreground">
                      Age {booking.age} • {booking.condition}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Up to 8 passengers including medical escort
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors min-h-[48px] min-w-[48px]"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-xl font-semibold w-8 text-center">{passengerCount}</span>
                    <button
                      onClick={() => setPassengerCount(Math.min(8, passengerCount + 1))}
                      className="w-10 h-10 rounded-full bg-aviation-red text-white flex items-center justify-center hover:bg-aviation-red-hover transition-colors min-h-[48px] min-w-[48px]"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Medical Equipment Status */}
              <div className="bento-card">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">Medical Equipment Status</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {medicalEquipment.map((equipment) => (
                    <div
                      key={equipment.name}
                      className="p-3 sm:p-4 rounded-xl bg-muted/50"
                    >
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">{equipment.name}</p>
                      <p className="text-xs sm:text-sm font-medium text-success flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        {equipment.status}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Payment */}
            <div className="space-y-6">
              <div className="bento-card lg:sticky lg:top-24">
                {/* Payment Type */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Payment type</p>
                    <p className="font-medium text-foreground">
                      {paymentMethods.find(m => m.id === selectedPayment)?.label}
                    </p>
                  </div>
                  <button className="text-aviation-red text-sm font-medium hover:underline min-h-[48px]">
                    Change →
                  </button>
                </div>

                {/* Payment Methods */}
                <div className="space-y-2 mb-6">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all min-h-[48px] ${
                        selectedPayment === method.id
                          ? "border-aviation-red bg-aviation-red/5"
                          : "border-border hover:border-aviation-red/50"
                      }`}
                    >
                      <method.icon className={`h-5 w-5 ${
                        selectedPayment === method.id ? "text-aviation-red" : "text-muted-foreground"
                      }`} />
                      <span className={`text-sm font-medium ${
                        selectedPayment === method.id ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {method.label}
                      </span>
                      {selectedPayment === method.id && (
                        <Check className="h-4 w-4 text-aviation-red ml-auto" />
                      )}
                    </button>
                  ))}
                </div>

                <button className="w-full flex items-center justify-center gap-2 text-aviation-red text-sm font-medium mb-6 hover:underline min-h-[48px]">
                  <Plus className="h-4 w-4" />
                  Add new card
                </button>

                {/* Price Breakdown */}
                <div className="border-t border-border pt-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-foreground font-medium">Total:</span>
                    <span className="text-2xl font-bold text-foreground">
                      {formatINR(totalPrice)}
                    </span>
                  </div>
                  <button 
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    Price breakdown 
                    <ChevronDown className={`h-4 w-4 transition-transform ${showBreakdown ? "rotate-180" : ""}`} />
                  </button>
                  
                  {showBreakdown && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 pt-3 border-t border-border/50 space-y-2"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Base Flight Cost</span>
                        <span className="text-foreground">{formatINR(basePrice)}</span>
                      </div>
                      {booking.ambulancePickup && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Pickup Ambulance</span>
                          <span className="text-foreground">{formatINR(25000)}</span>
                        </div>
                      )}
                      {booking.ambulanceDropoff && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Dropoff Ambulance</span>
                          <span className="text-foreground">{formatINR(25000)}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 mb-6">
                  <Switch
                    checked={termsAccepted}
                    onCheckedChange={setTermsAccepted}
                  />
                  <p className="text-sm text-muted-foreground">
                    I accept{" "}
                    <a href="#" className="text-aviation-red hover:underline">
                      Charter Flight Terms and Conditions
                    </a>
                  </p>
                </div>

                {/* Medical Priority Notice */}
                <div className="bg-muted/50 rounded-xl p-4 mb-6">
                  <p className="text-xs text-muted-foreground">
                    This flight is a priority medical charter. You acknowledge that medical
                    emergencies require immediate action. All sales are final. Insurance
                    verification has been completed.
                  </p>
                </div>

                {/* Confirm Button */}
                <Button
                  variant="aviation"
                  size="xl"
                  className="w-full min-h-[48px]"
                  disabled={!termsAccepted || isProcessing}
                  onClick={handleConfirmBooking}
                >
                  {isProcessing ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  Secured by ASR Aviation
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
