import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/ligacoes-externas")({
  component: () => (
    <PlaceholderPage
      title="Ligações Externas"
      description="Avaliação rápida, portfólio, programa de afiliados e agenda. Em construção (Fase 3)."
    />
  ),
});
