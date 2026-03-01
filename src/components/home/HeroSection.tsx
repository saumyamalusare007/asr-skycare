import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, Plane, Clock, Globe, Award, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroJet from "@/assets/hero-jet.jpg";

const stats = [
  { value: "150+", label: "Countries" },
  { value: "15 min", label: "Response Time" },
  { value: "24/7", label: "Operations" },
  { value: "99.9%", label: "Success Rate" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 lg:pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroJet}
          alt="ASR Aviation Air Ambulance"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Operations Active - Ready for Dispatch
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4"
          >
            ASR Aviation
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-3xl md:text-4xl lg:text-6xl font-bold text-gradient-hero mb-6"
          >
            Global Medical Logistics
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mb-10"
          >
            Specialized aircraft for time-critical organ transport, dignified repatriation, and emergency medical evacuations across 150+ countries.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <Link to="/booking">
              <Button variant="aviation" size="xl" className="group text-base px-8 py-4 shadow-glow-red">
                Start Booking Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="tel:9829538079">
              <Button variant="aviation-outline" size="xl" className="text-white border-white hover:bg-white hover:text-primary text-base px-8 py-4">
                <Phone className="h-5 w-5" />
                Call Emergency
              </Button>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-12"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center md:text-left">
                <motion.p
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="text-3xl lg:text-4xl font-bold text-white mb-1"
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Curved Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-16 md:h-24 fill-background"
          preserveAspectRatio="none"
        >
          <path d="M0,120 L0,60 Q720,120 1440,60 L1440,120 Z" />
        </svg>
      </div>
    </section>
  );
}
