 import { Header } from "@/components/layout/Header";
 import { Footer } from "@/components/layout/Footer";
 import { ServicesSection } from "@/components/home/ServicesSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { AirAmbulanceNetwork } from "@/components/services/AirAmbulanceNetwork";
 
 export default function ServicesPage() {
   return (
     <div className="min-h-screen">
       <Header />
       <main className="pt-20">
          <ServicesSection />
          <AirAmbulanceNetwork />
          <WhyChooseUs />
       </main>
       <Footer />
     </div>
   );
 }