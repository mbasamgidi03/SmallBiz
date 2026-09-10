import { Link, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, PenSquare, Image, Target, Building2, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { BusinessProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";

export const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", short: "Home", icon: LayoutDashboard },
  { to: "/content", label: "Create Content", short: "Content", icon: PenSquare },
  { to: "/poster", label: "Create Poster", short: "Poster", icon: Image },
  { to: "/goals", label: "Goals & Tracking", short: "Goals", icon: Target },
  { to: "/business", label: "My Business", short: "Business", icon: Building2 },
] as const;

export function AppShell({ profile, children }: { profile: BusinessProfile; children: ReactNode }) {
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const initials = (profile.business_name || profile.owner_name || "SB")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop / tablet sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            SB
          </span>
          <span className="text-sm font-semibold text-sidebar-accent-foreground">SmallBiz</span>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeProps={{
                className: "bg-sidebar-accent text-sidebar-accent-foreground before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-primary hover:bg-sidebar-accent",
              }}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-accent-foreground">{profile.business_name || "My business"}</p>
              <p className="truncate text-xs text-sidebar-foreground">{profile.owner_name}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={signOut} title="Sign out" aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b bg-card px-4 md:hidden">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground">
            SB
          </span>
          <span className="text-sm font-semibold">SmallBiz</span>
        </div>
        <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground">
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </header>

      <main className="px-4 pb-24 pt-5 md:ml-60 md:px-8 md:pb-10 md:pt-7">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t bg-card md:hidden">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-1 py-2 text-[11px] font-medium text-muted-foreground"
            activeProps={{ className: "text-primary" }}
          >
            <item.icon className="h-5 w-5" />
            {item.short}
          </Link>
        ))}
      </nav>
    </div>
  );
}
