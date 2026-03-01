import { Link, useLocation } from "react-router-dom";
import { Home, Plane, Phone, User } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/booking", label: "My Flights", icon: Plane },
  { href: "tel:9829538079", label: "Support", icon: Phone, external: true },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center gap-1 min-h-[48px] min-w-[48px] px-3"
              >
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{item.label}</span>
              </a>
            );
          }
          return (
            <Link
              key={item.label}
              to={item.href}
              className="flex flex-col items-center justify-center gap-1 min-h-[48px] min-w-[48px] px-3"
            >
              <item.icon className={`h-5 w-5 ${isActive ? "text-aviation-red" : "text-muted-foreground"}`} />
              <span className={`text-[10px] ${isActive ? "text-aviation-red font-medium" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
