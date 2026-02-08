import { motion } from "framer-motion";
import { CheckCircle, Plane, Ambulance, Activity } from "lucide-react";

const timelineSteps = [
  { step: 1, label: "Payment Confirmed", icon: CheckCircle },
  { step: 2, label: "Aircraft Prep", icon: Plane },
  { step: 3, label: "Ground Ambulance", icon: Ambulance },
  { step: 4, label: "Mission Active", icon: Activity },
];

interface MissionTimelineProps {
  currentStep: number;
}

export function MissionTimeline({ currentStep }: MissionTimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bento-card mb-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Activity className="h-5 w-5 text-aviation-red" />
        <h3 className="font-semibold text-foreground">Mission Timeline</h3>
        <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Live
        </span>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between">
          {timelineSteps.map((step) => {
            const isCompleted = currentStep > step.step;
            const isCurrent = currentStep === step.step;
            return (
              <div key={step.step} className="flex flex-col items-center relative z-10 flex-1">
                <motion.div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? "bg-success border-success text-white"
                      : isCurrent
                      ? "bg-aviation-red border-aviation-red text-white animate-pulse-glow"
                      : "bg-background border-border text-muted-foreground"
                  }`}
                  animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </motion.div>
                <span className={`mt-2 text-[10px] sm:text-xs font-medium text-center max-w-[60px] sm:max-w-none ${
                  isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        {/* Progress Line */}
        <div className="absolute top-5 sm:top-6 left-[12%] right-[12%] h-0.5 bg-border -z-0">
          <motion.div
            className="h-full bg-gradient-to-r from-success to-aviation-red"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / (timelineSteps.length - 1)) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
