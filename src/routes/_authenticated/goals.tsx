import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useGoalMutations, useGoals } from "@/lib/queries";
import type { Goal } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/app/PageHeader";
import { GoalCard } from "@/components/goals/GoalCard";
import { GoalFormDialog, UpdateProgressDialog } from "@/components/goals/GoalDialogs";

export const Route = createFileRoute("/_authenticated/goals")({
  head: () => ({
    meta: [
      { title: "Goals & Tracking — SmallBiz" },
      { name: "description", content: "Set measurable business goals and track your progress." },
      { property: "og:title", content: "Goals & Tracking — SmallBiz" },
      { property: "og:description", content: "Set measurable business goals and track your progress." },
    ],
  }),
  component: GoalsPage,
});

function GoalsPage() {
  const { user } = useAuth();
  const goals = useGoals(user?.id);
  const mutations = useGoalMutations(user?.id);
  const [updating, setUpdating] = useState<Goal | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [deleting, setDeleting] = useState<Goal | null>(null);

  const active = (goals.data ?? []).filter((g) => g.status === "active");
  const completed = (goals.data ?? []).filter((g) => g.status === "completed");

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (g: Goal) => {
    setEditing(g);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    await mutations.remove.mutateAsync(deleting);
    toast.success("Goal deleted");
    setDeleting(null);
  };

  const handlers = {
    onUpdate: setUpdating,
    onEdit: openEdit,
    onComplete: async (g: Goal) => {
      await mutations.setStatus.mutateAsync({ goal: g, status: "completed" });
      toast.success("Goal marked as completed");
    },
    onReopen: async (g: Goal) => {
      await mutations.setStatus.mutateAsync({ goal: g, status: "active" });
    },
    onDelete: setDeleting,
  };

  return (
    <div>
      <PageHeader
        title="Goals & Tracking"
        description="Define what you're working towards and update progress as you go."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> New goal
          </Button>
        }
      />

      {goals.isPending ? (
        <p className="text-sm text-muted-foreground">Loading goals…</p>
      ) : goals.data?.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-card p-8 text-center">
          <p className="font-medium">You haven't set any goals yet</p>
          <p className="mx-auto mb-4 mt-1 max-w-sm text-sm text-muted-foreground">
            Examples: Monthly Sales of R15,000 · 20 new customers · 1,000 Instagram followers · 50 orders
          </p>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Create your first goal
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
              Active goals ({active.length})
            </h2>
            {active.length === 0 ? (
              <p className="text-sm text-muted-foreground">All goals completed. Time for a new one!</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {active.map((g) => (
                  <GoalCard key={g.id} goal={g} {...handlers} />
                ))}
              </div>
            )}
          </section>

          {completed.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
                Completed ({completed.length})
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {completed.map((g) => (
                  <GoalCard key={g.id} goal={g} {...handlers} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <UpdateProgressDialog goal={updating} onClose={() => setUpdating(null)} mutations={mutations} />
      <GoalFormDialog
        open={formOpen}
        goal={editing}
        onClose={() => setFormOpen(false)}
        mutations={mutations}
      />
      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this goal?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleting?.name}" and its progress will be removed. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
