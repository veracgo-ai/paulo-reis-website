import whatsappIcon from "@/assets/logo-whatsapp.png";
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
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full animate-whatsapp-glow transition-transform duration-300 hover:scale-110 sm:bottom-8 sm:right-8 sm:h-[68px] sm:w-[68px]"
    >
      <img
        src={whatsappIcon}
        alt=""
        className="h-12 w-12 object-contain sm:h-14 sm:w-14"
        loading="eager"
      />
    </a>
  );
}
