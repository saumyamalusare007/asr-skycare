import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface SuccessAnimationProps {
  title: string;
  subtitle: string;
}

export function SuccessAnimation({ title, subtitle }: SuccessAnimationProps) {
  return (
    <div className="text-center mb-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center animate-pulse-glow"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring" }}
        >
          <CheckCircle className="h-12 w-12 sm:h-14 sm:w-14 text-success" />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}
