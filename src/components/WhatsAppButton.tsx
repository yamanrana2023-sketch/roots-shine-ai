import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phone = "918285262890";
  const message = encodeURIComponent("Hi, I want to know about your coaching classes");

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 active:scale-95 transition-all"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
