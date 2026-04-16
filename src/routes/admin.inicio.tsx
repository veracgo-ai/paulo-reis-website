import { createFileRoute } from "@tanstack/react-router";
import { PageEditor } from "./admin.sobre";

export const Route = createFileRoute("/admin/inicio")({
  component: () => <PageEditor pageSlug="inicio" pageTitle="Página Início" />,
});
