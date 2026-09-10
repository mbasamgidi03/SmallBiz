import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, CalendarDays, Lightbulb, Target } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { activitiesQuery, useGoalMutations, useGoals, useProfile } from "@/lib/queries";
import { formatDate, formatValue, goalPercent, timeAgo } from "@/lib/format";
import { businessTip } from "@/lib/content-tips";
import type { Goal } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SectionCard } from "@/components/app/PageHeader";
import { UpdateProgressDialog } from "@/components/goals/GoalDialogs";

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

  const ownerName = profile.data?.owner_name?.trim() || "there";
  const firstName = ownerName === "there" ? ownerName : ownerName.split(/\s+/)[0];
  const businessName = profile.data?.business_name || "your business";
  const activeGoals = (goals.data ?? []).filter((goal) => goal.status === "active");
  const primaryGoal = activeGoals[0];
  const otherGoals = activeGoals.slice(1, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Welcome back, {firstName}</h1>
        <p className="text-sm text-muted-foreground">
          Here's how {businessName} is doing.
        </p>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(17rem,0.8fr)]">
        <section className="overflow-hidden rounded-lg border bg-card shadow-card">
          {goals.isPending ? (
            <div className="p-6 text-sm text-muted-foreground">Loading goal progress…</div>
          ) : primaryGoal ? (
            <ActiveGoal goal={primaryGoal} onUpdate={setUpdating} />
          ) : (
            <div className="flex min-h-72 flex-col items-start justify-center p-6 sm:p-8">
              <span className="mb-4 grid h-10 w-10 place-items-center rounded-md bg-secondary text-primary">
                <Target className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-semibold">Set your first business goal</h2>
              <p className="mt-1 max-w-lg text-sm text-muted-foreground">
                Track something that matters to your business, such as sales, customers, enquiries or social media growth.
              </p>
              <Button className="mt-5" asChild>
                <Link to="/goals">Set a Goal</Link>
              </Button>
            </div>
          )}
        </section>

        <div className="space-y-5">
          <SectionCard title="Recent activity">
            {activities.data && activities.data.length > 0 ? (
              <ul className="space-y-2.5">
                {activities.data.slice(0, 4).map((a) => (
                  <li key={a.id} className="border-b pb-2.5 text-sm last:border-0 last:pb-0">
                    <span className="block leading-snug">{a.description}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{timeAgo(a.created_at)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Your recent actions will show up here.
              </p>
            )}
          </SectionCard>

          <div className="rounded-lg border bg-card p-4 shadow-card">
            <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
              <Lightbulb className="h-3.5 w-3.5" /> Quick tip
            </div>
            <p className="text-sm leading-relaxed">{businessTip(profile.data?.category)}</p>
          </div>
        </div>
      </div>

      {otherGoals.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">Other Goals</h2>
            <Button variant="link" size="sm" asChild className="h-auto p-0">
              <Link to="/goals">
                View all goals <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {otherGoals.map((goal) => (
              <CompactGoal key={goal.id} goal={goal} />
            ))}
          </div>
        </section>
      )}

      <UpdateProgressDialog goal={updating} onClose={() => setUpdating(null)} mutations={mutations} />
    </div>
  );
}

function ActiveGoal({ goal, onUpdate }: { goal: Goal; onUpdate: (goal: Goal) => void }) {
  const pct = goalPercent(Number(goal.current_value), Number(goal.target_value));

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-muted-foreground">Active goal</p>
        <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-primary">In progress</span>
      </div>
      <h2 className="mt-5 text-2xl font-semibold leading-tight text-foreground">{goal.name}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{goal.category}</p>

      <div className="mt-7 flex items-end justify-between gap-4">
        <p className="text-lg font-semibold">
          {formatValue(Number(goal.current_value), goal.value_type)}
          <span className="font-normal text-muted-foreground"> / {formatValue(Number(goal.target_value), goal.value_type)}</span>
        </p>
        <p className="text-xl font-semibold text-primary">{pct}%</p>
      </div>
      <Progress value={pct} className="mt-3 h-2.5" aria-label={`${pct}% complete`} />

      <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays className="h-4 w-4" />
        <span>Target date: {formatDate(goal.target_date)}</span>
      </div>
      <div className="mt-7 flex flex-wrap items-center gap-2">
        <Button onClick={() => onUpdate(goal)}>Update Progress</Button>
        <Button variant="ghost" asChild>
          <Link to="/goals">
            View Goal <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function CompactGoal({ goal }: { goal: Goal }) {
  const pct = goalPercent(Number(goal.current_value), Number(goal.target_value));
  return (
    <div className="rounded-lg border bg-card p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold">{goal.name}</h3>
          <p className="text-xs text-muted-foreground">{goal.category}</p>
        </div>
        <span className="shrink-0 text-sm font-semibold text-primary">{pct}%</span>
      </div>
      <Progress value={pct} className="mt-3 h-1.5" aria-label={`${pct}% complete`} />
    </div>
  );
}
