import { createFileRoute } from "@tanstack/react-router";
import { PageEditor } from "./admin.sobre";

export const Route = createFileRoute("/admin/landing")({
  component: () => <PageEditor pageSlug="landing" pageTitle="Página Landing" />,
});