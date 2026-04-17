import { FaWhatsapp } from "react-icons/fa";
import { useSiteSettings } from "@/hooks/use-site-data";

const FALLBACK_URL =
  "https://wa.me/351933842514?text=Olá%20Paulo%20Reis%2C%20vim%20pelo%20seu%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20os%20seus%20serviços.";

export function WhatsAppFloat() {
  const { settings } = useSiteSettings();
  const url = settings.whatsapp_url || FALLBACK_URL;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com Paulo Reis no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg animate-whatsapp-glow transition-transform duration-300 hover:scale-110 sm:bottom-8 sm:right-8 sm:h-16 sm:w-16"
    >
      <FaWhatsapp className="h-8 w-8 sm:h-9 sm:w-9" aria-hidden="true" />
    </a>
  );
}
