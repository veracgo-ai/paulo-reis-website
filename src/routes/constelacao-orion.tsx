import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/constelacao-orion")({
  component: () => <Outlet />,
});
