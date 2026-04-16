import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/faqs")({
  component: () => (
    <PlaceholderPage
      title="FAQs"
      description="Perguntas frequentes sobre aquisição, venda, investimento e carreira. Em construção (Fase 3)."
    />
  ),
});
