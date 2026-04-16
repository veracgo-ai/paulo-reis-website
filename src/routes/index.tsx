import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [{ title: "Paulo-reis.pt" }],
  }),
});

function Index() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <h1 className="text-4xl font-bold text-black sm:text-6xl md:text-8xl select-none">
        Paulo-reis.pt
      </h1>
    </div>
  );
}
