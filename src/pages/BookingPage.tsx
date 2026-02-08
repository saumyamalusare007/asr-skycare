 import { useState, useEffect } from "react";
 import { useNavigate, useSearchParams } from "react-router-dom";
 import { motion, AnimatePresence } from "framer-motion";
 import { Header } from "@/components/layout/Header";
 import { Footer } from "@/components/layout/Footer";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import { Switch } from "@/components/ui/switch";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { Heart, Activity, AlertTriangle, Baby, ArrowLeft, ArrowRight, Check, Plane, Ambulance, User, MapPin, Calendar, Phone, Mail, FileText, Shield } from "lucide-react";
 import { serviceTypes, indianCities, formatINR, type IndianCity } from "@/lib/data";
 
 const steps = [
   { id: 1, title: "Select Service", icon: Plane },
   { id: 2, title: "Patient Details", icon: User },
   { id: 3, title: "Logistics", icon: MapPin },
   { id: 4, title: "Review", icon: Check },
 ];
 
 const icons: Record<string, React.ComponentType<{ className?: string }>> = {
   Heart,
   Activity,
   AlertTriangle,
   Baby,
 };
 
 export default function BookingPage() {
   const [searchParams] = useSearchParams();
   const navigate = useNavigate();
   const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: searchParams.get("service") || "",
    patientName: "",
    age: "",
    aadharId: "",
    contactPhone: "",
    contactEmail: "",
    condition: "",
    medicalNotes: "",
    origin: "",
    destination: "",
    flightDate: "",
    passengers: 1,
    ambulancePickup: false,
    ambulanceDropoff: false,
  });
 
   const selectedService = serviceTypes.find(s => s.id === formData.serviceType);
   const originCity = indianCities.find(c => c.code === formData.origin);
   const destinationCity = indianCities.find(c => c.code === formData.destination);
 
   // Calculate estimated price
   const calculatePrice = () => {
     if (!selectedService) return 0;
     let basePrice = (selectedService.priceRange.min + selectedService.priceRange.max) / 2;
     if (formData.ambulancePickup) basePrice += 25000;
     if (formData.ambulanceDropoff) basePrice += 25000;
     return basePrice;
   };
 
   const handleNext = () => {
     if (currentStep < 4) setCurrentStep(currentStep + 1);
   };
 
   const handleBack = () => {
     if (currentStep > 1) setCurrentStep(currentStep - 1);
   };
 
   const handleSubmit = () => {
     // Store booking data and navigate to payment
     const bookingData = {
       ...formData,
       quotedPrice: calculatePrice(),
       originCity,
       destinationCity,
       selectedService,
     };
     localStorage.setItem("pendingBooking", JSON.stringify(bookingData));
     navigate("/payment");
   };
 
   return (
     <div className="min-h-screen bg-background">
       <Header />
       <main className="pt-20 lg:pt-24 pb-20">
         <div className="container mx-auto px-4">
           {/* Progress Steps */}
           <div className="max-w-3xl mx-auto mb-12">
             <div className="flex items-center justify-between">
               {steps.map((step, index) => (
                 <div key={step.id} className="flex items-center">
                   <div className="flex flex-col items-center">
                     <div
                       className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                         currentStep >= step.id
                           ? "bg-aviation-red text-white"
                           : "bg-muted text-muted-foreground"
                       }`}
                     >
                       {currentStep > step.id ? (
                         <Check className="h-5 w-5" />
                       ) : (
                         <step.icon className="h-5 w-5" />
                       )}
                     </div>
                     <span className={`mt-2 text-xs font-medium ${
                       currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                     }`}>
                       {step.title}
                     </span>
                   </div>
                   {index < steps.length - 1 && (
                     <div className="flex-1 h-1 mx-4 rounded-full bg-muted overflow-hidden">
                       <motion.div
                         className="h-full bg-aviation-red"
                         initial={{ width: "0%" }}
                         animate={{ width: currentStep > step.id ? "100%" : "0%" }}
                         transition={{ duration: 0.5 }}
                       />
                     </div>
                   )}
                 </div>
               ))}
             </div>
           </div>
 
           {/* Form Content */}
           <div className="max-w-4xl mx-auto">
             <AnimatePresence mode="wait">
               {/* Step 1: Select Service */}
               {currentStep === 1 && (
                 <motion.div
                   key="step1"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-6"
                 >
                   <div className="text-center mb-8">
                     <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                       Select Your Mission Type
                     </h1>
                     <p className="text-muted-foreground">
                       Choose the medical transport service you require
                     </p>
                   </div>
 
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {serviceTypes.map((service) => {
                       const IconComponent = icons[service.icon];
                       return (
                         <button
                           key={service.id}
                           type="button"
                           onClick={() => setFormData({ ...formData, serviceType: service.id })}
                           className={`bento-card text-left transition-all ${
                             formData.serviceType === service.id
                               ? "ring-2 ring-aviation-red bg-aviation-red/5"
                               : "hover:border-aviation-red/50"
                           }`}
                         >
                           <div className="flex items-start gap-4">
                             <div className={`p-3 rounded-xl ${
                               formData.serviceType === service.id
                                 ? "bg-aviation-red text-white"
                                 : "bg-primary/10 text-primary"
                             }`}>
                               <IconComponent className="h-6 w-6" />
                             </div>
                             <div className="flex-1">
                               <h3 className="font-semibold text-foreground mb-1">
                                 {service.title}
                               </h3>
                               <p className="text-sm text-muted-foreground mb-2">
                                 {service.description}
                               </p>
                               <p className="text-sm font-medium text-aviation-red">
                                 From {formatINR(service.priceRange.min)}
                               </p>
                             </div>
                             {formData.serviceType === service.id && (
                               <Check className="h-5 w-5 text-aviation-red" />
                             )}
                           </div>
                         </button>
                       );
                     })}
                   </div>
                 </motion.div>
               )}
 
               {/* Step 2: Patient Details */}
               {currentStep === 2 && (
                 <motion.div
                   key="step2"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-6"
                 >
                   <div className="text-center mb-8">
                     <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                       Patient Information
                     </h1>
                     <p className="text-muted-foreground">
                       Enter the patient's medical details
                     </p>
                   </div>
 
                   <div className="bento-card">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <Label htmlFor="patientName">Patient Full Name</Label>
                         <div className="relative">
                           <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                           <Input
                             id="patientName"
                             placeholder="Enter patient name"
                             className="pl-10"
                             value={formData.patientName}
                             onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                           />
                         </div>
                       </div>
 
                       <div className="space-y-2">
                         <Label htmlFor="age">Age</Label>
                         <Input
                           id="age"
                           type="number"
                           placeholder="Patient age"
                           value={formData.age}
                           onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                         />
                       </div>
 
                       <div className="space-y-2">
                         <Label htmlFor="phone">Contact Phone</Label>
                         <div className="relative">
                           <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                           <Input
                             id="phone"
                             placeholder="+91 98765 43210"
                             className="pl-10"
                             value={formData.contactPhone}
                             onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                           />
                         </div>
                       </div>
 
                       <div className="space-y-2">
                         <Label htmlFor="email">Contact Email</Label>
                         <div className="relative">
                           <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                           <Input
                             id="email"
                             type="email"
                             placeholder="email@example.com"
                             className="pl-10"
                             value={formData.contactEmail}
                             onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                           />
                         </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="aadharId">Aadhar ID</Label>
                          <div className="relative">
                            <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="aadharId"
                              placeholder="1234 5678 9012"
                              className="pl-10 font-mono"
                              value={formData.aadharId}
                              onChange={(e) => setFormData({ ...formData, aadharId: e.target.value })}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">Required for medical transport verification</p>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="condition">Medical Condition</Label>
                          <Input
                            id="condition"
                            placeholder="Primary diagnosis or condition"
                            value={formData.condition}
                            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                          />
                        </div>
 
                       <div className="space-y-2 md:col-span-2">
                         <Label htmlFor="notes">Additional Medical Notes</Label>
                         <Textarea
                           id="notes"
                           placeholder="Any additional medical information, allergies, special requirements..."
                           rows={4}
                           value={formData.medicalNotes}
                           onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                         />
                       </div>
                     </div>
                   </div>
                 </motion.div>
               )}
 
               {/* Step 3: Logistics */}
               {currentStep === 3 && (
                 <motion.div
                   key="step3"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-6"
                 >
                   <div className="text-center mb-8">
                     <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                       Flight & Logistics
                     </h1>
                     <p className="text-muted-foreground">
                       Configure your transport route and ground support
                     </p>
                   </div>
 
                   <div className="bento-card">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <Label>Origin City</Label>
                         <Select
                           value={formData.origin}
                           onValueChange={(value) => setFormData({ ...formData, origin: value })}
                         >
                           <SelectTrigger>
                             <SelectValue placeholder="Select pickup city" />
                           </SelectTrigger>
                           <SelectContent>
                             {indianCities.map((city) => (
                               <SelectItem key={city.code} value={city.code}>
                                 {city.name} ({city.code})
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       </div>
 
                       <div className="space-y-2">
                         <Label>Destination City</Label>
                         <Select
                           value={formData.destination}
                           onValueChange={(value) => setFormData({ ...formData, destination: value })}
                         >
                           <SelectTrigger>
                             <SelectValue placeholder="Select destination city" />
                           </SelectTrigger>
                           <SelectContent>
                             {indianCities.map((city) => (
                               <SelectItem key={city.code} value={city.code}>
                                 {city.name} ({city.code})
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       </div>
 
                       <div className="space-y-2">
                         <Label htmlFor="date">Preferred Date</Label>
                         <div className="relative">
                           <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                           <Input
                             id="date"
                             type="date"
                             className="pl-10"
                             value={formData.flightDate}
                             onChange={(e) => setFormData({ ...formData, flightDate: e.target.value })}
                           />
                         </div>
                       </div>
 
                       <div className="space-y-2">
                         <Label htmlFor="passengers">Number of Passengers</Label>
                         <Input
                           id="passengers"
                           type="number"
                           min={1}
                           max={8}
                           value={formData.passengers}
                           onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) || 1 })}
                         />
                         <p className="text-xs text-muted-foreground">
                           Up to 8 passengers including medical escort
                         </p>
                       </div>
                     </div>
 
                     {/* Ground Ambulance Options */}
                     <div className="mt-8 pt-6 border-t border-border">
                       <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                         <Ambulance className="h-5 w-5 text-aviation-red" />
                         Ground Ambulance Support
                       </h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                           <div>
                             <p className="font-medium text-foreground">Pickup Ambulance</p>
                             <p className="text-sm text-muted-foreground">Hospital to Airport transfer</p>
                           </div>
                           <div className="flex items-center gap-3">
                             <span className="text-sm font-medium text-foreground">+₹25,000</span>
                             <Switch
                               checked={formData.ambulancePickup}
                               onCheckedChange={(checked) => setFormData({ ...formData, ambulancePickup: checked })}
                             />
                           </div>
                         </div>
                         <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                           <div>
                             <p className="font-medium text-foreground">Drop-off Ambulance</p>
                             <p className="text-sm text-muted-foreground">Airport to Hospital transfer</p>
                           </div>
                           <div className="flex items-center gap-3">
                             <span className="text-sm font-medium text-foreground">+₹25,000</span>
                             <Switch
                               checked={formData.ambulanceDropoff}
                               onCheckedChange={(checked) => setFormData({ ...formData, ambulanceDropoff: checked })}
                             />
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </motion.div>
               )}
 
               {/* Step 4: Review */}
               {currentStep === 4 && (
                 <motion.div
                   key="step4"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-6"
                 >
                   <div className="text-center mb-8">
                     <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                       Review Your Booking
                     </h1>
                     <p className="text-muted-foreground">
                       Confirm your details before proceeding to payment
                     </p>
                   </div>
 
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     {/* Service & Patient */}
                     <div className="bento-card">
                       <h3 className="font-semibold text-foreground mb-4">Service & Patient</h3>
                       <div className="space-y-3">
                         <div className="flex justify-between text-sm">
                           <span className="text-muted-foreground">Service Type</span>
                           <span className="font-medium">{selectedService?.title}</span>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span className="text-muted-foreground">Patient Name</span>
                           <span className="font-medium">{formData.patientName}</span>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span className="text-muted-foreground">Age</span>
                           <span className="font-medium">{formData.age} years</span>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span className="text-muted-foreground">Condition</span>
                           <span className="font-medium">{formData.condition}</span>
                         </div>
                       </div>
                     </div>
 
                     {/* Flight Details */}
                     <div className="bento-card">
                       <h3 className="font-semibold text-foreground mb-4">Flight Details</h3>
                       <div className="space-y-3">
                         <div className="flex justify-between text-sm">
                           <span className="text-muted-foreground">Route</span>
                           <span className="font-medium">
                             {originCity?.name} → {destinationCity?.name}
                           </span>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span className="text-muted-foreground">Date</span>
                           <span className="font-medium">{formData.flightDate}</span>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span className="text-muted-foreground">Passengers</span>
                           <span className="font-medium">{formData.passengers}</span>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span className="text-muted-foreground">Ground Support</span>
                           <span className="font-medium">
                             {formData.ambulancePickup && formData.ambulanceDropoff
                               ? "Pickup & Drop-off"
                               : formData.ambulancePickup
                               ? "Pickup Only"
                               : formData.ambulanceDropoff
                               ? "Drop-off Only"
                               : "None"}
                           </span>
                         </div>
                       </div>
                     </div>
 
                     {/* Price Summary */}
                     <div className="bento-card lg:col-span-2 bg-aviation-red/5 border-aviation-red/20">
                       <h3 className="font-semibold text-foreground mb-4">Price Summary</h3>
                       <div className="space-y-3">
                         <div className="flex justify-between text-sm">
                           <span className="text-muted-foreground">Base Service Fee</span>
                           <span className="font-medium">
                             {formatINR(selectedService?.priceRange.min || 0)} - {formatINR(selectedService?.priceRange.max || 0)}
                           </span>
                         </div>
                         {formData.ambulancePickup && (
                           <div className="flex justify-between text-sm">
                             <span className="text-muted-foreground">Pickup Ambulance</span>
                             <span className="font-medium">{formatINR(25000)}</span>
                           </div>
                         )}
                         {formData.ambulanceDropoff && (
                           <div className="flex justify-between text-sm">
                             <span className="text-muted-foreground">Drop-off Ambulance</span>
                             <span className="font-medium">{formatINR(25000)}</span>
                           </div>
                         )}
                         <div className="pt-3 border-t border-border flex justify-between">
                           <span className="font-semibold text-foreground">Estimated Total</span>
                           <span className="font-bold text-xl text-aviation-red">
                             {formatINR(calculatePrice())}
                           </span>
                         </div>
                       </div>
                     </div>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
 
             {/* Navigation Buttons */}
             <div className="flex justify-between mt-8">
               <Button
                 variant="outline"
                 onClick={handleBack}
                 disabled={currentStep === 1}
               >
                 <ArrowLeft className="h-4 w-4 mr-2" />
                 Back
               </Button>
 
               {currentStep < 4 ? (
                 <Button
                   variant="aviation"
                   onClick={handleNext}
                   disabled={
                     (currentStep === 1 && !formData.serviceType) ||
                     (currentStep === 2 && !formData.patientName) ||
                     (currentStep === 3 && (!formData.origin || !formData.destination))
                   }
                 >
                   Continue
                   <ArrowRight className="h-4 w-4 ml-2" />
                 </Button>
               ) : (
                 <Button variant="aviation" size="lg" onClick={handleSubmit}>
                   Proceed to Payment
                   <ArrowRight className="h-4 w-4 ml-2" />
                 </Button>
               )}
             </div>
           </div>
         </div>
       </main>
       <Footer />
     </div>
   );
 }