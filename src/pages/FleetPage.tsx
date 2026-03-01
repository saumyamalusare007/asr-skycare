import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fleetData } from "@/lib/data";
import { Users, Gauge, MapPin, ArrowRight, Check, Stethoscope } from "lucide-react";

export default function FleetPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20 lg:pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Our Fleet
            </span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Medical-Configured Aircraft
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              World-class air ambulance fleet for medical emergencies across India
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fleetData.map((aircraft, index) => (
              <motion.div
                key={aircraft.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-lg border border-border bg-card shadow-md overflow-hidden"
              >
                {/* Landscape Image */}
                <div className="aspect-video overflow-hidden">
                  <img
                    src={aircraft.image}
                    alt={aircraft.model}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      {aircraft.baseHub} Base
                    </span>
                    {aircraft.icuCapable && (
                      <span className="px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        ICU Ready
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                    {aircraft.model}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span>Base: {aircraft.baseHub} ({aircraft.baseHubCode})</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 shrink-0" />
                      <span>Up to {aircraft.maxPassengers} passengers</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Gauge className="h-4 w-4 shrink-0" />
                      <span>Range: {aircraft.range}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Stethoscope className="h-4 w-4 shrink-0" />
                      <span>{aircraft.medicalStaff}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Link to="/booking">
                      <Button variant="aviation-outline" className="w-full group">
                        Request Quote
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
