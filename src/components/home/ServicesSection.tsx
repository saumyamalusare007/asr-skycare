 import { motion } from "framer-motion";
 import { Link } from "react-router-dom";
 import { Heart, Activity, AlertTriangle, Baby, ArrowRight, Check, Plane } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { serviceTypes, formatINR } from "@/lib/data";
 import organTransport from "@/assets/organ-transport.jpg";
 import icuInterior from "@/assets/icu-interior.jpg";
 import emergencyEvac from "@/assets/emergency-evac.jpg";
 import neonatalCare from "@/assets/neonatal-care.jpg";
 
 const images: Record<string, string> = {
   "organ-transport": organTransport,
   "icu-interior": icuInterior,
   "emergency-evac": emergencyEvac,
   "neonatal-care": neonatalCare,
 };
 
 const icons: Record<string, React.ComponentType<{ className?: string }>> = {
   Heart,
   Activity,
   AlertTriangle,
   Baby,
 };
 
 export function ServicesSection() {
   return (
     <section className="py-20 lg:py-32 bg-background">
       <div className="container mx-auto px-4">
         {/* Header */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
         >
           <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
             Our Services
           </span>
           <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
             Select Your Mission Type
           </h2>
           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
             World-class medical aviation services tailored to your specific needs
           </p>
         </motion.div>
 
         {/* Services Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
           {serviceTypes.map((service, index) => {
             const IconComponent = icons[service.icon];
             return (
               <motion.div
                 key={service.id}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: index * 0.1 }}
               >
                 <Link
                   to={`/booking?service=${service.id}`}
                   className="group block h-full"
                 >
                   <div className="bento-card h-full flex flex-col overflow-hidden p-0">
                     {/* Image */}
                     <div className="relative h-48 overflow-hidden">
                       <img
                         src={images[service.image]}
                         alt={service.title}
                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                       <div className="absolute bottom-4 left-4 p-2 rounded-full bg-primary text-primary-foreground">
                         <IconComponent className="h-5 w-5" />
                       </div>
                     </div>
 
                     {/* Content */}
                     <div className="p-6 flex-1 flex flex-col">
                       <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-aviation-red transition-colors">
                         {service.title}
                       </h3>
                       <p className="text-sm text-muted-foreground mb-4">
                         {service.description}
                       </p>
 
                       <div className="text-xs text-muted-foreground mb-4">
                         <span className="flex items-center gap-1">
                           <Plane className="h-3 w-3" />
                           Aircraft: {service.aircraft}
                         </span>
                       </div>
 
                       <ul className="space-y-2 mb-4 flex-1">
                         {service.features.map((feature) => (
                           <li key={feature} className="flex items-center gap-2 text-sm text-success">
                             <Check className="h-4 w-4 flex-shrink-0" />
                             {feature}
                           </li>
                         ))}
                       </ul>
 
                       <div className="pt-4 border-t border-border flex items-center justify-between">
                         <span className="text-sm text-muted-foreground">Starting from</span>
                         <span className="font-semibold text-foreground">
                           {formatINR(service.priceRange.min)} - {formatINR(service.priceRange.max)}
                         </span>
                       </div>
                     </div>
                   </div>
                 </Link>
               </motion.div>
             );
           })}
         </div>
 
         {/* Bottom CTA */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mt-12"
         >
           <p className="text-sm text-muted-foreground mb-6">
             All missions include: <span className="font-medium text-foreground">Ground ambulance coordination</span> • <span className="font-medium text-foreground">Airport handling</span> • <span className="font-medium text-foreground">24/7 flight tracking</span>
           </p>
           <Link to="/booking">
             <Button variant="aviation" size="lg" className="group">
               Get Custom Quote
               <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
             </Button>
           </Link>
         </motion.div>
       </div>
     </section>
   );
 }