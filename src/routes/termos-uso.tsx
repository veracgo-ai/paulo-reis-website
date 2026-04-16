import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/termos-uso")({
  component: () => (
    <PlaceholderPage title="Termos de Uso" description="Documento em redação (Fase 3)." />
  ),
});
