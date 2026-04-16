import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/politica-privacidade")({
  component: () => (
    <PlaceholderPage title="Política de Privacidade" description="Documento RGPD em redação (Fase 3)." />
  ),
});
