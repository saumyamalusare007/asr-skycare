import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Search, MapPin, Plane } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AirAmbulanceProvider {
  name: string;
  city: string;
  phone: string;
  type: string;
}

const providers: AirAmbulanceProvider[] = [
  { name: "Air Rescuers", city: "Delhi", phone: "+91 9999 168 168", type: "Fixed Wing & Helicopter" },
  { name: "ICATT Air Ambulance", city: "Mumbai", phone: "+91 9920 811 117", type: "ICU Air Ambulance" },
  { name: "Bluestar Air Ambulance", city: "Delhi", phone: "+91 9810 155 000", type: "Fixed Wing" },
  { name: "Medanta Air Ambulance (Medanta Hospital)", city: "Gurugram", phone: "+91 124 414 1414", type: "Hospital-Linked" },
  { name: "Apollo Hospitals Air Ambulance", city: "Chennai", phone: "+91 44 2829 0200", type: "Hospital-Linked" },
  { name: "Fortis Air Ambulance Service", city: "Bangalore", phone: "+91 80 6621 4444", type: "Hospital-Linked" },
  { name: "Pawan Hans Helicopter Services", city: "Delhi", phone: "+91 11 2465 2465", type: "Helicopter" },
  { name: "Global Vectra Helicorp", city: "Mumbai", phone: "+91 22 6677 8899", type: "Helicopter" },
  { name: "Ventura AirConnect", city: "Hyderabad", phone: "+91 40 4455 1234", type: "Fixed Wing" },
  { name: "Flyola Air Ambulance", city: "Patna", phone: "+91 9708 557 243", type: "Fixed Wing & ICU" },
  { name: "JetSetGo Aviation", city: "Mumbai", phone: "+91 80 4857 4857", type: "Charter & Medical" },
  { name: "Club One Air", city: "Mumbai", phone: "+91 22 4343 4343", type: "Fixed Wing Luxury" },
  { name: "Panchmukhi Air Ambulance", city: "Delhi", phone: "+91 9071 550 550", type: "Fixed Wing & Train" },
  { name: "Aeromed Air Ambulance", city: "Bangalore", phone: "+91 80 4090 2222", type: "ICU Air Ambulance" },
  { name: "AMRI Hospitals Air Service", city: "Kolkata", phone: "+91 33 6680 0000", type: "Hospital-Linked" },
  { name: "BLK Max Air Ambulance", city: "Delhi", phone: "+91 11 3040 3040", type: "Hospital-Linked" },
];

export function AirAmbulanceNetwork() {
  const [search, setSearch] = useState("");

  const filtered = providers.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Pan-India Coverage
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            India Air Ambulance Network
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive directory of air ambulance providers and hospital-linked aviation services across India
          </p>
        </motion.div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, city, or type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((provider, i) => (
            <motion.div
              key={provider.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                      <Plane className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm leading-tight">
                        {provider.name}
                      </h3>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        {provider.city}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full w-fit">
                    {provider.type}
                  </span>
                  <a href={`tel:${provider.phone.replace(/\s/g, "")}`} className="mt-auto">
                    <Button variant="aviation-outline" size="sm" className="w-full text-xs">
                      <Phone className="h-3 w-3 mr-1" />
                      {provider.phone}
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">
            No providers found matching "{search}"
          </p>
        )}
      </div>
    </section>
  );
}
