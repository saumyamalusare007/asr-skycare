import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, Plane, Ambulance, User } from "lucide-react";
import { formatINR } from "@/lib/data";

interface BookingDetailsCardProps {
  bookingId: string;
  patientName: string;
  originCity: { name: string; code: string };
  destinationCity: { name: string; code: string };
  flightDate: string;
  quotedPrice: number;
  selectedService: { title: string; aircraft?: string };
  ambulancePickup?: boolean;
  ambulanceDropoff?: boolean;
}

export function BookingDetailsCard({
  bookingId,
  patientName,
  originCity,
  destinationCity,
  flightDate,
  quotedPrice,
  selectedService,
  ambulancePickup,
  ambulanceDropoff,
}: BookingDetailsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bento-card mb-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-border gap-4">
        <div>
          <p className="text-xs sm:text-sm text-muted-foreground">Booking ID</p>
          <p className="text-lg sm:text-xl font-bold text-foreground font-mono">{bookingId}</p>
        </div>
        <span className="self-start sm:self-auto px-4 py-2 rounded-full bg-success/10 text-success font-semibold text-sm flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          Mission Active
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Patient</p>
            <p className="font-medium text-foreground">{patientName}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Plane className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Aircraft Type</p>
            <p className="font-medium text-foreground">{selectedService?.aircraft || "King Air 350"}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Route</p>
            <p className="font-medium text-foreground">
              {originCity?.name} ({originCity?.code}) → {destinationCity?.name} ({destinationCity?.code})
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Flight Date</p>
            <p className="font-medium text-foreground">{flightDate || "To be scheduled"}</p>
          </div>
        </div>
      </div>

      {/* Ambulance Status */}
      {(ambulancePickup || ambulanceDropoff) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {ambulancePickup && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 text-warning text-xs font-medium">
              <Ambulance className="h-3 w-3" />
              Pickup Ambulance
            </span>
          )}
          {ambulanceDropoff && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 text-warning text-xs font-medium">
              <Ambulance className="h-3 w-3" />
              Dropoff Ambulance
            </span>
          )}
        </div>
      )}

      {/* Price */}
      <div className="p-4 rounded-xl bg-aviation-red/5 border border-aviation-red/20">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Paid</span>
          <span className="text-xl sm:text-2xl font-bold text-aviation-red">{formatINR(quotedPrice)}</span>
        </div>
      </div>
    </motion.div>
  );
}
