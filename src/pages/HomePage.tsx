 import { Header } from "@/components/layout/Header";
 import { Footer } from "@/components/layout/Footer";
 import { HeroSection } from "@/components/home/HeroSection";
 import { ServicesSection } from "@/components/home/ServicesSection";
 import { WhyChooseUs } from "@/components/home/WhyChooseUs";
 import { FleetPreview } from "@/components/home/FleetPreview";
 
 export default function HomePage() {
   return (
     <div className="min-h-screen">
       <Header />
       <main>
         <HeroSection />
         <ServicesSection />
         <WhyChooseUs />
         <FleetPreview />
       </main>
       <Footer />
     </div>
   );
 }