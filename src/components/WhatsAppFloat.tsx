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
      <svg
        viewBox="0 0 32 32"
        className="h-8 w-8 sm:h-9 sm:w-9"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.302.216-.66.244-.99 0-.075-.014-.115-.014-.165 0-.4-1.864-.7-2.005-.745z m-2.405-9.51c-3.683 0-6.677 2.994-6.677 6.677 0 1.27.358 2.494 1.038 3.555l-1.09 3.252 3.39-1.073a6.65 6.65 0 0 0 3.34.892c3.683 0 6.677-2.994 6.677-6.677 0-3.683-2.994-6.677-6.677-6.677z m0 12.215a5.546 5.546 0 0 1-3.04-.91l-2.13.673.677-2.057a5.515 5.515 0 0 1-1.05-3.244 5.553 5.553 0 0 1 5.547-5.547 5.553 5.553 0 0 1 5.547 5.547 5.553 5.553 0 0 1-5.55 5.547z" transform="translate(0 0)"/>
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.823.733 5.475 2.018 7.78L0 32l8.42-2.21A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333c-2.61 0-5.04-.748-7.097-2.04l-.51-.302-5.27 1.382 1.41-5.135-.332-.527A13.255 13.255 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333z"/>
      </svg>
    </a>
  );
}
