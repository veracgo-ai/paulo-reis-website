import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/contactos")({
  component: () => (
    <PlaceholderPage
      title="Contactos"
      description="Formulário, mapa e dados de contacto. Em construção (Fase 2)."
    />
  ),
});
