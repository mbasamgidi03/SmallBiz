import { CheckCircle2, MoreHorizontal, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, formatValue, goalPercent } from "@/lib/format";
import type { Goal } from "@/lib/types";

export function GoalCard({
  goal,
  compact = false,
  onUpdate,
  onEdit,
  onComplete,
  onReopen,
  onDelete,
}: {
  goal: Goal;
  compact?: boolean;
  onUpdate: (goal: Goal) => void;
  onEdit?: (goal: Goal) => void;
  onComplete?: (goal: Goal) => void;
  onReopen?: (goal: Goal) => void;
  onDelete?: (goal: Goal) => void;
}) {
  const pct = goalPercent(Number(goal.current_value), Number(goal.target_value));
  const done = goal.status === "completed";
  const showMenu = onEdit || onComplete || onReopen || onDelete;

  return (
    <div
      className={`rounded-lg border bg-card p-4 shadow-card ${done ? "border-dashed opacity-80" : ""}`}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-1.5">
            {done && <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />}
            <h3 className="truncate text-sm font-semibold">{goal.name}</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            {goal.category}
            {!compact && ` · Target ${formatDate(goal.target_date)}`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className={`text-sm font-semibold ${done ? "text-success" : "text-primary"}`}>
            {pct}%
          </span>
          {showMenu && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Goal actions">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(goal)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit goal
                  </DropdownMenuItem>
                )}
                {!done && onComplete && (
                  <DropdownMenuItem onClick={() => onComplete(goal)}>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as completed
                  </DropdownMenuItem>
                )}
                {done && onReopen && (
                  <DropdownMenuItem onClick={() => onReopen(goal)}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Reopen goal
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem onClick={() => onDelete(goal)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm">
        <span className="font-medium">{formatValue(Number(goal.current_value), goal.value_type)}</span>
        <span className="text-muted-foreground">
          {" "}
          of {formatValue(Number(goal.target_value), goal.value_type)}
        </span>
      </p>
      <Progress value={pct} className={`mt-2 h-2 ${done ? "[&>div]:bg-success" : ""}`} />

      {!done && (
        <Button variant="outline" size="sm" className="mt-3" onClick={() => onUpdate(goal)}>
          Update progress
        </Button>
      )}
    </div>
  );
}
