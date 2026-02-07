import { Link, useLocation } from "react-router-dom";
import { Home, Plane, HeadphonesIcon, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/booking", label: "My Flights", icon: Plane },
  { href: "/services", label: "Support", icon: HeadphonesIcon },
  { href: "/admin", label: "Profile", icon: User },
];

export function MobileBottomNav() {
  const location = useLocation();

  // Hide on certain pages
  const hiddenRoutes = ["/payment", "/booking-confirmation"];
  if (hiddenRoutes.includes(location.pathname)) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full min-h-[48px] transition-colors",
                isActive ? "text-aviation-red" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 mb-1", isActive && "text-aviation-red")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
