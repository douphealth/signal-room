import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/$")({
  beforeLoad: () => {
    throw notFound();
  },
  headers: () => ({ "X-Robots-Tag": "noindex, follow" }),
});
