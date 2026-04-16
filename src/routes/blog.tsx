import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/blog")({
  component: () => (
    <PlaceholderPage
      title="Blog"
      description="Artigos e análises sobre imobiliário, investimento e carreira. Em construção (Fase 3)."
    />
  ),
});
