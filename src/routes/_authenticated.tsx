import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/lib/queries";
import { AppShell } from "@/components/app/AppShell";
import { LoadingScreen } from "@/components/app/LoadingScreen";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const profile = useProfile(user?.id);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (profile.isSuccess && !profile.data?.onboarding_complete) {
      navigate({ to: "/onboarding", replace: true });
    }
  }, [profile.isSuccess, profile.data, navigate]);

  if (loading || !user || profile.isPending) return <LoadingScreen />;
  if (profile.isError) {
    return <LoadingScreen label="Could not load your business. Please refresh." />;
  }
  if (!profile.data?.onboarding_complete) return <LoadingScreen />;

  return (
    <AppShell profile={profile.data}>
      <Outlet />
    </AppShell>
  );
}
