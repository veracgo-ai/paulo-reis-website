import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { ApresentacaoSection } from "@/components/ApresentacaoSection";
import { StarsGrid } from "@/components/StarsGrid";
import { usePageSections, useStars, sectionBySlug } from "@/hooks/use-site-data";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Paulo Reis — Consultor Imobiliário | Orion Legacy" },
      {
        name: "description",
        content:
          "Consultoria imobiliária estratégica no Algarve. Estrutura, direção e legado para investidores, compradores, vendedores e profissionais do setor.",
      },
      { property: "og:title", content: "Paulo Reis — Orion Legacy" },
      {
        property: "og:description",
        content:
          "Onde decisões estruturadas transformam pessoas em legado. Conheça a Constelação Órion.",
      },
    ],
  }),
});

function Index() {
  const { sections } = usePageSections("inicio");
  const { stars } = useStars({ featuredOnly: true });

  const apresentacao = sectionBySlug(sections, "apresentacao");
  const destaque = sectionBySlug(sections, "estrelas-destaque");

  return (
    <>
      <Hero />
      <ApresentacaoSection
        title={apresentacao?.title ?? "Não comecei com certezas."}
        subtitle={apresentacao?.subtitle ?? "Quem é Paulo Reis"}
        content={
          apresentacao?.content ??
          "Hoje não trabalho para reagir ao mercado. Trabalho para o antecipar."
        }
      />
      <StarsGrid
        stars={stars}
        title={destaque?.title ?? "Três estrelas. Três caminhos."}
        subtitle={destaque?.subtitle ?? "Constelação Órion"}
      />
    </>
  );
}
