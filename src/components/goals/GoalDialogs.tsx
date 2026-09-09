import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field } from "@/components/app/PageHeader";
import { defaultValueType, formatValue, goalPercent } from "@/lib/format";
import { GOAL_CATEGORIES, type Goal } from "@/lib/types";
import type { GoalInput, useGoalMutations } from "@/lib/queries";

type Mutations = ReturnType<typeof useGoalMutations>;

/* ---------- Update progress ---------- */

export function UpdateProgressDialog({
  goal,
  onClose,
  mutations,
}: {
  goal: Goal | null;
  onClose: () => void;
  mutations: Mutations;
}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (goal) setValue(String(Number(goal.current_value)));
  }, [goal]);

  const numeric = Number(value);
  const preview = goal ? goalPercent(numeric, Number(goal.target_value)) : 0;

  const save = async () => {
    if (!goal || Number.isNaN(numeric) || numeric < 0) {
      toast.error("Please enter a valid number.");
      return;
    }
    await mutations.updateProgress.mutateAsync({ goal, value: numeric });
    toast.success("Progress updated");
    onClose();
  };

  return (
    <Dialog open={!!goal} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Update progress</DialogTitle>
          <DialogDescription>{goal?.name}</DialogDescription>
        </DialogHeader>
        {goal && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 rounded-md bg-muted p-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Current</p>
                <p className="font-medium">{formatValue(Number(goal.current_value), goal.value_type)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Target</p>
                <p className="font-medium">{formatValue(Number(goal.target_value), goal.value_type)}</p>
              </div>
            </div>
            <Field label="New value" hint={`This will be ${preview}% of your target.`}>
              <div className="relative">
                {goal.value_type === "currency" && (
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                    R
                  </span>
                )}
                <Input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className={goal.value_type === "currency" ? "pl-7" : ""}
                  autoFocus
                />
              </div>
            </Field>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={mutations.updateProgress.isPending}>
            {mutations.updateProgress.isPending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Create / edit goal ---------- */

const emptyForm = {
  name: "",
  category: "Sales",
  target_value: "",
  current_value: "0",
  target_date: "",
};

export function GoalFormDialog({
  open,
  goal,
  onClose,
  mutations,
}: {
  open: boolean;
  goal?: Goal | null;
  onClose: () => void;
  mutations: Mutations;
}) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;
    if (goal) {
      setForm({
        name: goal.name,
        category: goal.category,
        target_value: String(Number(goal.target_value)),
        current_value: String(Number(goal.current_value)),
        target_date: goal.target_date ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, goal]);

  const set = (key: keyof typeof emptyForm) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const valueType = defaultValueType(form.category);
  const isMoney = valueType === "currency";
  const busy = mutations.create.isPending || mutations.update.isPending;

  const submit = async (): Promise<void> => {
    const target = Number(form.target_value);
    const current = Number(form.current_value || 0);
    if (!form.name.trim()) { toast.error("Please give the goal a name."); return; }
    if (!target || target <= 0) { toast.error("Target value must be greater than zero."); return; }
    if (Number.isNaN(current) || current < 0) { toast.error("Current value must be a positive number."); return; }

    const input: GoalInput = {
      name: form.name.trim(),
      category: form.category,
      target_value: target,
      current_value: current,
      value_type: valueType,
      target_date: form.target_date || null,
    };
    if (goal) {
      await mutations.update.mutateAsync({ id: goal.id, ...input });
      toast.success("Goal updated");
    } else {
      await mutations.create.mutateAsync(input);
      toast.success("Goal created");
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{goal ? "Edit goal" : "Set a new goal"}</DialogTitle>
          <DialogDescription>
            Choose something measurable so you can track it over time.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Field label="Goal name">
            <Input
              placeholder="e.g. Monthly Sales"
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              autoFocus
            />
          </Field>
          <Field label="Category">
            <Select value={form.category} onValueChange={set("category")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GOAL_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={isMoney ? "Target (R)" : "Target"}>
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                placeholder={isMoney ? "15000" : "20"}
                value={form.target_value}
                onChange={(e) => set("target_value")(e.target.value)}
              />
            </Field>
            <Field label={isMoney ? "Current (R)" : "Current"}>
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                value={form.current_value}
                onChange={(e) => set("current_value")(e.target.value)}
              />
            </Field>
          </div>
          <Field label="Target date" optional>
            <Input
              type="date"
              value={form.target_date}
              onChange={(e) => set("target_date")(e.target.value)}
            />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy}>
            {busy ? "Saving…" : goal ? "Save changes" : "Create goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
