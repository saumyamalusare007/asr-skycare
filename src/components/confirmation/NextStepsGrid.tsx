import { motion } from "framer-motion";
import { Ambulance, Building2, FileCheck, Clock } from "lucide-react";

const nextStepServices = [
  { 
    icon: Ambulance, 
    title: "Ground Ambulance Coordination",
    description: "Our team is coordinating road transport to pickup location",
    status: "In Progress",
    statusColor: "text-warning"
  },
  { 
    icon: Building2, 
    title: "Hospital Bed Reservation",
    description: "Confirming ICU/bed availability at destination hospital",
    status: "Pending Confirmation",
    statusColor: "text-info"
  },
  { 
    icon: FileCheck, 
    title: "Insurance Paperwork",
    description: "Processing your insurance claim and documentation",
    status: "Submitted",
    statusColor: "text-success"
  },
  { 
    icon: Clock, 
    title: "Estimated Pickup Time",
    description: "Ground team will arrive within the scheduled window",
    status: "2-3 Hours",
    statusColor: "text-aviation-red"
  },
];

export function NextStepsGrid() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="mb-8"
    >
      <h3 className="font-display font-semibold text-foreground mb-4 text-lg">Next Steps</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {nextStepServices.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="bento-card p-4 sm:p-5 hover:shadow-xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <service.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <h4 className="font-medium text-sm text-foreground mb-2 line-clamp-2">{service.title}</h4>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{service.description}</p>
            <span className={`text-xs font-semibold ${service.statusColor}`}>{service.status}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
