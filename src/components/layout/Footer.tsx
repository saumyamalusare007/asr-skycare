import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Plane, Shield, Award, CheckCircle } from "lucide-react";
import { certifications } from "@/lib/data";
import logo from "@/assets/logo-asr.png";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Certifications Bar */}
      <div className="border-b border-white/10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
            {certifications.map((cert) => (
              <div key={cert.name} className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-aviation-red" />
                <div>
                  <p className="text-sm font-semibold">{cert.name}</p>
                  <p className="text-xs text-white/60">{cert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img src={logo} alt="ASR Aviation" className="h-12 mb-4 brightness-0 invert" />
            <p className="text-sm text-white/70 mb-4">
              Global leader in medical aviation, providing life-saving air ambulance services across 150+ countries with 24/7 operations.
            </p>
            <div className="flex items-center gap-2 text-success">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium">Operations Center Active</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              {["Organ Transplant Transfer", "ICU-to-ICU Transfer", "Emergency Evacuation", "Neonatal Care Transport", "Dead Body Transportation"].map((service) => (
                <li key={service}>
                  <Link to="/services" className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-2">
                    <Plane className="h-3 w-3" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Book Air Ambulance", href: "/booking" },
                { label: "Our Fleet", href: "/fleet" },
                { label: "Terms & Conditions", href: "#" },
                { label: "Privacy Policy", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">24/7 Emergency Contact</h4>
            <div className="space-y-3">
              <a href="tel:9829538079" className="flex items-center gap-3 text-aviation-red font-semibold hover:underline">
                <Phone className="h-5 w-5" />
                9829538079
              </a>
              <a href="mailto:emergency@asraviation.com" className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors">
                <Mail className="h-4 w-4" />
                emergency@asraviation.com
              </a>
              <div className="flex items-start gap-3 text-sm text-white/70">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>ASR Aviation Headquarters, IGI Airport, New Delhi 110037</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} ASR Aviation. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              ISO 9001:2015 Certified
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              DGCA Approved
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
