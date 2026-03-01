import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, Menu, X, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-asr.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/fleet", label: "Fleet" },
  { href: "/booking", label: "Book Now" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="ASR Aviation" className="h-10 lg:h-12" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative text-sm font-medium transition-colors hover:text-aviation-red ${
                  location.pathname === link.href
                    ? "text-aviation-red"
                    : "text-foreground/80"
                }`}
              >
                {link.label}
                {location.pathname === link.href && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-aviation-red rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Emergency Line & CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">24/7 Emergency:</span>
              <a
                href="tel:9829538079"
                className="flex items-center gap-1 text-aviation-red font-semibold hover:underline"
              >
                <Phone className="h-4 w-4" />
                9829538079
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-success font-medium">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                Operations Active
              </span>
            </div>
            <Link to="/booking">
              <Button variant="aviation" size="sm">
                <Plane className="h-4 w-4 mr-2" />
                Start Booking
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/50 py-4"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === link.href
                      ? "bg-aviation-red/10 text-aviation-red"
                      : "hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border/50 mt-2 pt-4 px-4">
                <a
                  href="tel:9829538079"
                  className="flex items-center gap-2 text-aviation-red font-semibold"
                >
                  <Phone className="h-4 w-4" />
                  9829538079
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}
