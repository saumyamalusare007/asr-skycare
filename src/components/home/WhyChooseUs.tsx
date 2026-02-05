 import { motion } from "framer-motion";
 import { Shield, Clock, Users, Plane, Award, HeartPulse, Globe, Headphones } from "lucide-react";
 
 const features = [
   {
     icon: Clock,
     title: "15-Minute Response",
     description: "Our operations team responds within 15 minutes to any emergency request, 24/7/365.",
   },
   {
     icon: HeartPulse,
     title: "Full ICU Capability",
     description: "All aircraft equipped with advanced life support systems and critical care equipment.",
   },
   {
     icon: Users,
     title: "Expert Medical Crew",
     description: "Board-certified physicians and ICU nurses accompany every medical transport flight.",
   },
   {
     icon: Globe,
     title: "Global Operations",
     description: "Operating in 150+ countries with established hospital networks worldwide.",
   },
   {
     icon: Shield,
     title: "Insurance Accepted",
     description: "Direct billing with major insurance providers and corporate health plans.",
   },
   {
     icon: Headphones,
     title: "24/7 Support",
     description: "Dedicated case managers available round the clock for seamless coordination.",
   },
 ];
 
 export function WhyChooseUs() {
   return (
     <section className="py-20 lg:py-32 bg-primary text-primary-foreground">
       <div className="container mx-auto px-4">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
         >
           <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium mb-4">
             Why ASR Aviation
           </span>
           <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
             Trusted by Leading Hospitals
           </h2>
           <p className="text-lg text-white/70 max-w-2xl mx-auto">
             India's premier air ambulance service with the highest standards of medical aviation
           </p>
         </motion.div>
 
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
           {features.map((feature, index) => (
             <motion.div
               key={feature.title}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: index * 0.1 }}
               className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
             >
               <div className="w-12 h-12 rounded-xl bg-aviation-red/20 flex items-center justify-center mb-4">
                 <feature.icon className="h-6 w-6 text-aviation-red" />
               </div>
               <h3 className="font-display text-lg font-semibold text-white mb-2">
                 {feature.title}
               </h3>
               <p className="text-sm text-white/70">
                 {feature.description}
               </p>
             </motion.div>
           ))}
         </div>
       </div>
     </section>
   );
 }