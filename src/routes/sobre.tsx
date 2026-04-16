import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/sobre")({
  component: () => (
    <PlaceholderPage
      title="Sobre mim"
      description="A história, valores, missão e visão de Paulo Reis. Página completa em construção (Fase 2)."
    />
  ),
  head: () => ({
    meta: [
      { title: "Sobre mim — Paulo Reis" },
      { name: "description", content: "A história, valores e visão de Paulo Reis." },
    ],
  }),
});
