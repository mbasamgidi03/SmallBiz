import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, Image, Lightbulb, PenSquare, Target } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { activitiesQuery, useGoalMutations, useGoals, useProfile } from "@/lib/queries";
import { timeAgo } from "@/lib/format";
import { tipOfTheDay } from "@/lib/content-tips";
import type { Goal } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/app/PageHeader";
import { GoalCard } from "@/components/goals/GoalCard";
import { GoalFormDialog, UpdateProgressDialog } from "@/components/goals/GoalDialogs";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SmallBiz" },
      { name: "description", content: "Your business overview: goal progress, recent activity and a quick tip." },
      { property: "og:title", content: "Dashboard — SmallBiz" },
      { property: "og:description", content: "Your business overview at a glance." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const profile = useProfile(user?.id);
  const goals = useGoals(user?.id);
  const activities = useQuery(activitiesQuery(user?.id));
  const mutations = useGoalMutations(user?.id);
  const [updating, setUpdating] = useState<Goal | null>(null);
  const [creating, setCreating] = useState(false);

  const name = profile.data?.owner_name || profile.data?.business_name || "there";
  const activeGoals = (goals.data ?? []).filter((g) => g.status === "active").slice(0, 3);
  const totalActive = (goals.data ?? []).filter((g) => g.status === "active").length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Welcome back, {name}</h1>
        <p className="text-sm text-muted-foreground">
          Here's how {profile.data?.business_name || "your business"} is doing.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <QuickAction to="/content" icon={PenSquare} title="Create Content" desc="Ideas and captions for social media" />
        <QuickAction to="/poster" icon={Image} title="Create Poster" desc="Design an advert for your business" />
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex items-center gap-3 rounded-lg border bg-card p-4 text-left shadow-card transition-colors hover:border-primary/40 hover:bg-primary/5"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
            <Target className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">Set a Goal</span>
            <span className="block truncate text-xs text-muted-foreground">Define something measurable</span>
          </span>
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <SectionCard
          title="Goal progress"
          description={totalActive ? `${totalActive} active goal${totalActive === 1 ? "" : "s"}` : "No active goals yet"}
          actions={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/goals">
                View all goals <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          }
        >
          {goals.isPending ? (
            <p className="text-sm text-muted-foreground">Loading goals…</p>
          ) : activeGoals.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center">
              <p className="text-sm font-medium">No goals yet</p>
              <p className="mb-3 text-xs text-muted-foreground">
                Set a target for sales, customers or followers and track it here.
              </p>
              <Button size="sm" onClick={() => setCreating(true)}>
                Set your first goal
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {activeGoals.map((g) => (
                <GoalCard key={g.id} goal={g} compact onUpdate={setUpdating} />
              ))}
            </div>
          )}
        </SectionCard>

        <div className="space-y-5">
          <SectionCard title="Recent activity">
            {activities.data && activities.data.length > 0 ? (
              <ul className="space-y-2.5">
                {activities.data.slice(0, 5).map((a) => (
                  <li key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 text-sm">
                    <span className="truncate">{a.description}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(a.created_at)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Your recent actions will show up here.
              </p>
            )}
          </SectionCard>

          <div className="rounded-lg border bg-primary/5 p-4">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <Lightbulb className="h-3.5 w-3.5" /> Quick tip
            </div>
            <p className="text-sm">{tipOfTheDay()}</p>
          </div>
        </div>
      </div>

      <UpdateProgressDialog goal={updating} onClose={() => setUpdating(null)} mutations={mutations} />
      <GoalFormDialog open={creating} onClose={() => setCreating(false)} mutations={mutations} />
    </div>
  );
}

function QuickAction({
  to,
  icon: Icon,
  title,
  desc,
}: {
  to: "/content" | "/poster";
  icon: typeof PenSquare;
  title: string;
  desc: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-card transition-colors hover:border-primary/40 hover:bg-primary/5"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block truncate text-xs text-muted-foreground">{desc}</span>
      </span>
    </Link>
  );
}
