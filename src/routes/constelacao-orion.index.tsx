import { createFileRoute } from "@tanstack/react-router";
import { useStars, usePageSections, sectionBySlug } from "@/hooks/use-site-data";
import { StarsGrid } from "@/components/StarsGrid";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/constelacao-orion/")({
  component: ConstelacaoIndex,
  head: () => ({
    meta: [
      { title: "Constelação Órion — Paulo Reis" },
      {
        name: "description",
        content:
          "Um ecossistema empresarial onde cada estrela tem uma função. Estrutura, direção e legado.",
      },
    ],
  }),
});

function ConstelacaoIndex() {
  const { stars } = useStars();
  const { sections } = usePageSections("constelacao-orion");
  const hero = sectionBySlug(sections, "hero");
  return (
    <>
      <PageHero
        eyebrow={hero?.subtitle ?? "Orion Legacy"}
        title={hero?.title ?? "Constelação Órion"}
        description={
          hero?.content ??
          "Quando cada elemento ocupa o seu lugar, tudo ganha clareza. Uma constelação não é apenas um conjunto de estrelas — é um sistema, uma lógica, uma leitura para quem sabe observar."
        }
        imageUrl={hero?.image_url}
      />
      <StarsGrid stars={stars} title="As dez estrelas" subtitle="Cada uma com a sua função" />
    </>
  );
}
