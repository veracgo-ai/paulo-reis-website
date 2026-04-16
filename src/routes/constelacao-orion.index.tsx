import { createFileRoute } from "@tanstack/react-router";
import { useStars } from "@/hooks/use-site-data";
import { StarsGrid } from "@/components/StarsGrid";

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
  return (
    <>
      {/* Header spacer */}
      <section className="relative overflow-hidden bg-[var(--navy-deep)] px-4 pb-16 pt-40 text-white sm:pt-48">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
            Orion Legacy
          </span>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl">Constelação Órion</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Quando cada elemento ocupa o seu lugar, tudo ganha clareza. Uma constelação não é
            apenas um conjunto de estrelas — é um sistema, uma lógica, uma leitura para quem
            sabe observar.
          </p>
        </div>
      </section>
      <StarsGrid stars={stars} title="As dez estrelas" subtitle="Cada uma com a sua função" />
    </>
  );
}
