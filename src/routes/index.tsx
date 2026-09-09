import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/app/LoadingScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmallBiz — Content, posters and goals for small businesses" },
      {
        name: "description",
        content:
          "SmallBiz helps small-business owners create social media content, design posters and track business goals.",
      },
      { property: "og:title", content: "SmallBiz" },
      {
        property: "og:description",
        content: "A simple productivity tool for small-business owners.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    navigate({ to: user ? "/dashboard" : "/auth", replace: true });
  }, [loading, user, navigate]);

  return <LoadingScreen />;
}
