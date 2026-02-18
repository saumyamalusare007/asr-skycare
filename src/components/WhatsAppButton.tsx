import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const phoneNumber = "911141600000";
  const message = encodeURIComponent(
    "I need urgent assistance with an Air Ambulance booking."
  );

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
