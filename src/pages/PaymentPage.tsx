import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { FlightRouteMap } from "@/components/booking/FlightRouteMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plane, Clock, Users, CreditCard, Wallet, Building2, Smartphone, Plus, Minus, Check, Shield, AlertCircle, Activity, Wind, Droplets, Heart } from "lucide-react";
import { formatINR, type IndianCity, type ServiceType } from "@/lib/data";
import logo from "@/assets/logo-asr.png";
 
 interface BookingData {
   serviceType: string;
   patientName: string;
   age: string;
   condition: string;
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
 
   const handleConfirmBooking = () => {
     setIsProcessing(true);
     // Simulate payment processing
     setTimeout(() => {
       const bookingId = `ASR-${Date.now().toString(36).toUpperCase()}`;
       localStorage.setItem("confirmedBooking", JSON.stringify({
         ...booking,
         bookingId,
         status: "confirmed",
         createdAt: new Date().toISOString(),
       }));
       navigate("/booking-confirmation");
     }, 2000);
   };
 
   if (!booking) {
     return null;
   }
 
   const flightDuration = "2h 0m"; // Mock calculation
   const departureTime = "03:36 PM";
   const arrivalTime = "05:36 PM";
   const flightDate = new Date(booking.flightDate).toLocaleDateString("en-US", {
     month: "short",
     day: "numeric",
     year: "numeric",
   });
 
   return (
     <div className="min-h-screen bg-background">
       <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
         <div className="container mx-auto px-4 py-3 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <span className="text-2xl font-bold text-primary">ASR</span>
             <span className="text-sm text-muted-foreground">Aviation</span>
           </div>
           <div className="text-sm text-muted-foreground">
             24/7 Support: <span className="font-semibold text-foreground">+1-800-ASR-HELP</span>
           </div>
         </div>
       </header>
 
       <main className="pt-20 pb-12">
         <div className="container mx-auto px-4">
           {/* Header */}
           <div className="mb-8">
             <div className="flex items-center gap-3 mb-2">
               <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                 Flight Summary
               </h1>
               <span className="px-3 py-1 rounded-full bg-aviation-red text-white text-xs font-semibold uppercase">
                 Medical Priority
               </span>
             </div>
             <p className="text-muted-foreground">
               {booking.selectedService?.aircraft || "King Air 350"} • Turboprop
             </p>
           </div>
 
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Left Column - Flight Details */}
             <div className="lg:col-span-2 space-y-6">
               {/* Flight Route Card */}
               <div className="bento-card p-0 overflow-hidden">
                 <div className="p-6">
                   {/* Time & Route */}
                   <div className="flex items-center justify-between mb-6">
                     <div>
                       <p className="text-xs text-muted-foreground uppercase mb-1">{flightDate}</p>
                       <p className="text-2xl font-bold text-foreground">{departureTime}</p>
                     </div>
                     <div className="flex-1 px-6">
                       <div className="relative flex items-center justify-center">
                         <div className="h-px flex-1 bg-border" />
                         <div className="px-4 flex items-center gap-2">
                           <Plane className="h-4 w-4 text-muted-foreground -rotate-45" />
                           <span className="text-sm text-muted-foreground">{flightDuration}</span>
                         </div>
                         <div className="h-px flex-1 bg-border" />
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="text-xs text-muted-foreground uppercase mb-1">{flightDate}</p>
                       <p className="text-2xl font-bold text-foreground">{arrivalTime}</p>
                     </div>
                   </div>
 
                   {/* City Codes */}
                   <div className="flex items-center justify-between mb-6">
                     <div>
                       <p className="text-3xl font-bold text-foreground">{booking.originCity?.code}</p>
                       <p className="text-sm text-muted-foreground">{booking.originCity?.name}</p>
                     </div>
                     <div className="text-right">
                       <p className="text-3xl font-bold text-foreground">{booking.destinationCity?.code}</p>
                       <p className="text-sm text-muted-foreground">{booking.destinationCity?.name}</p>
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
                 <div className="flex items-center justify-between">
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
                       className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                     >
                       <Minus className="h-4 w-4" />
                     </button>
                     <span className="text-xl font-semibold w-8 text-center">{passengerCount}</span>
                     <button
                       onClick={() => setPassengerCount(Math.min(8, passengerCount + 1))}
                       className="w-10 h-10 rounded-full bg-aviation-red text-white flex items-center justify-center hover:bg-aviation-red-hover transition-colors"
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
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {medicalEquipment.map((equipment) => (
                     <div
                       key={equipment.name}
                       className="p-4 rounded-xl bg-muted/50"
                     >
                       <p className="text-sm text-muted-foreground mb-1">{equipment.name}</p>
                       <p className="text-sm font-medium text-success flex items-center gap-1">
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
               <div className="bento-card sticky top-24">
                 {/* Payment Type */}
                 <div className="flex items-center justify-between mb-4">
                   <div>
                     <p className="text-sm text-muted-foreground">Payment type</p>
                     <p className="font-medium text-foreground">
                       {paymentMethods.find(m => m.id === selectedPayment)?.label}
                     </p>
                   </div>
                   <button className="text-aviation-red text-sm font-medium hover:underline">
                     Change →
                   </button>
                 </div>
 
                 {/* Payment Methods */}
                 <div className="space-y-2 mb-6">
                   {paymentMethods.map((method) => (
                     <button
                       key={method.id}
                       onClick={() => setSelectedPayment(method.id)}
                       className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
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
 
                 <button className="w-full flex items-center justify-center gap-2 text-aviation-red text-sm font-medium mb-6 hover:underline">
                   <Plus className="h-4 w-4" />
                   Add new card
                 </button>
 
                 {/* Price Breakdown */}
                 <div className="border-t border-border pt-4 mb-4">
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-foreground font-medium">Total:</span>
                     <span className="text-2xl font-bold text-foreground">
                       {formatINR(booking.quotedPrice)}
                     </span>
                   </div>
                   <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                     Price breakdown ↓
                   </button>
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
                     verification has been completed for policy: {Math.floor(Math.random() * 99999)}.
                   </p>
                 </div>
 
                 {/* Confirm Button */}
                 <Button
                   variant="aviation"
                   size="xl"
                   className="w-full"
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