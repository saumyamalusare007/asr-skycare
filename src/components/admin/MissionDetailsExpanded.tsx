import { motion } from "framer-motion";
import { 
  Users, Plane, ChevronDown, ChevronUp, Ambulance, 
  Phone, Mail, FileText, Shield, CreditCard
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { formatINR } from "@/lib/data";
import type { Tables } from "@/integrations/supabase/types";
import { useState } from "react";

type Mission = Tables<"missions">;

interface MissionDetailsExpandedProps {
  mission: Mission;
}

export function MissionDetailsExpanded({ mission }: MissionDetailsExpandedProps) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      {/* Patient Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bento-card"
      >
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          Patient Details
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="font-medium text-foreground">{mission.patient_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="font-medium text-foreground">{mission.patient_age || "N/A"}</p>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground">Condition</p>
            <p className="font-medium text-foreground">{mission.patient_condition || "Not specified"}</p>
          </div>

          {/* Aadhar ID - Important for Indian context */}
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Aadhar ID</p>
            </div>
            <p className="font-mono font-medium text-foreground">
              {mission.aadhar_id ? formatAadhar(mission.aadhar_id) : "Not provided"}
            </p>
          </div>

          {/* Expandable Contact Details */}
          <Collapsible open={isContactOpen} onOpenChange={setIsContactOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors min-h-[40px]">
              <span className="text-sm font-medium text-foreground">Contact Details</span>
              {isContactOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{mission.contact_phone || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{mission.contact_email || "N/A"}</span>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Medical Notes */}
          {mission.medical_notes && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Medical Notes</p>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {mission.medical_notes}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Flight Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bento-card"
      >
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Plane className="h-5 w-5 text-muted-foreground" />
          Flight Details
        </h3>
        <div className="space-y-4">
          {/* Route Display */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{mission.origin_code}</p>
              <p className="text-xs text-muted-foreground">{mission.origin_city}</p>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <Plane className="h-4 w-4 text-muted-foreground -rotate-45" />
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{mission.destination_code}</p>
              <p className="text-xs text-muted-foreground">{mission.destination_city}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Aircraft</p>
              <p className="font-medium text-foreground text-sm">{mission.aircraft_model || "Pending Assignment"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Passengers</p>
              <p className="font-medium text-foreground">{mission.passengers || 1}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Flight Date</p>
              <p className="font-medium text-foreground text-sm">
                {mission.flight_date ? new Date(mission.flight_date).toLocaleDateString() : "TBD"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Priority</p>
              <Badge className={mission.priority_level === "high" ? "bg-aviation-red/20 text-aviation-red" : "bg-muted text-muted-foreground"}>
                {mission.priority_level === "high" ? "🚨 High Priority" : "Normal"}
              </Badge>
            </div>
          </div>

          {/* Ambulance Needs */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Ground Ambulance Coordination</p>
            <div className="flex flex-wrap gap-2">
              {mission.ambulance_pickup ? (
                <span className="flex items-center gap-1.5 text-xs bg-warning/10 text-warning px-3 py-1.5 rounded-full font-medium">
                  <Ambulance className="h-3 w-3" />
                  Pickup Required
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">No pickup ambulance</span>
              )}
              {mission.ambulance_dropoff && (
                <span className="flex items-center gap-1.5 text-xs bg-warning/10 text-warning px-3 py-1.5 rounded-full font-medium">
                  <Ambulance className="h-3 w-3" />
                  Dropoff Required
                </span>
              )}
            </div>
          </div>

          {/* Documents Section */}
          <Collapsible open={isDocumentsOpen} onOpenChange={setIsDocumentsOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors min-h-[40px]">
              <span className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Documents & Insurance
              </span>
              {isDocumentsOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Insurance Status</span>
                  <Badge className="bg-success/20 text-success">Verified</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Medical Clearance</span>
                  <Badge className="bg-info/20 text-info">Pending</Badge>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </motion.div>

      {/* Payment Info - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bento-card lg:col-span-2"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold text-foreground">{formatINR(Number(mission.quoted_price))}</p>
            </div>
          </div>
          <Badge className={`text-sm px-4 py-2 ${mission.payment_status === "paid" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"}`}>
            {mission.payment_status === "paid" ? "✓ Payment Received" : "⏳ Payment Pending"}
          </Badge>
        </div>
      </motion.div>
    </div>
  );
}

function formatAadhar(aadhar: string): string {
  // Format as XXXX XXXX XXXX
  const cleaned = aadhar.replace(/\D/g, "");
  if (cleaned.length === 12) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8)}`;
  }
  return aadhar;
}
