import { motion } from "framer-motion";
import { CheckCircle, Clock, Plane, Ambulance, Stethoscope } from "lucide-react";

interface TimelineStep {
  step: number;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const timelineSteps: TimelineStep[] = [
  { step: 1, label: "Request Logged", description: "Your booking has been confirmed", icon: Clock },
  { step: 2, label: "Operator Matching", description: "Finding the best aircraft for your mission", icon: Stethoscope },
  { step: 3, label: "Ambulance Dispatched", description: "Ground transport en route", icon: Ambulance },
  { step: 4, label: "Airborne", description: "Medical transport in progress", icon: Plane },
];

interface MissionTimelineProps {
  currentStep: number;
  showAmbulance?: boolean;
  className?: string;
}

export function MissionTimeline({ currentStep, showAmbulance = false, className = "" }: MissionTimelineProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Horizontal Timeline */}
      <div className="relative">
        <div className="flex items-start justify-between">
          {timelineSteps.map((step, index) => {
            const isCompleted = currentStep > step.step;
            const isCurrent = currentStep === step.step;
            const StepIcon = step.icon;
            
            return (
              <div key={step.step} className="flex flex-col items-center relative z-10 flex-1">
                {/* Step Circle */}
                <motion.div
                  className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? "bg-success border-success text-white"
                      : isCurrent
                      ? "bg-aviation-red border-aviation-red text-white"
                      : "bg-background border-border text-muted-foreground"
                  }`}
                  animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  {/* Pulsing glow for current step */}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-aviation-red/30"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                    />
                  )}
                  
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6" />
                  ) : (
                    <StepIcon className="h-5 w-5 md:h-6 md:w-6" />
                  )}
                </motion.div>
                
                {/* Step Label */}
                <div className="mt-3 text-center">
                  <p className={`text-xs md:text-sm font-medium ${
                    isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.label}
                  </p>
                  <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 hidden md:block">
                    {step.description}
                  </p>
                </div>
                
                {/* Ambulance highlight badge */}
                {step.step === 3 && showAmbulance && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-8 px-2 py-1 rounded-full bg-warning/20 text-warning text-[10px] font-medium"
                  >
                    🚑 Priority
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Progress Line */}
        <div className="absolute top-6 md:top-7 left-[8%] right-[8%] h-0.5 bg-border -z-0">
          <motion.div
            className="h-full bg-gradient-to-r from-success via-success to-aviation-red"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / (timelineSteps.length - 1)) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
