import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Activity, BusinessProfile, ContentPiece, Goal, PosterRow } from "./types";

/* ---------- Business profile ---------- */

export const profileQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async (): Promise<BusinessProfile | null> => {
      const { data, error } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export function useProfile(userId: string | undefined) {
  return useQuery(profileQuery(userId));
}

export function useSaveProfile(userId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Partial<BusinessProfile>) => {
      if (!userId) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("business_profiles")
        .upsert({ ...values, user_id: userId }, { onConflict: "user_id" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => qc.setQueryData(["profile", userId], data),
  });
}

/* ---------- Activities ---------- */

export const activitiesQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["activities", userId],
    enabled: !!userId,
    queryFn: async (): Promise<Activity[]> => {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

export async function logActivity(userId: string, type: string, description: string) {
  await supabase.from("activities").insert({ user_id: userId, type, description });
}

/* ---------- Goals ---------- */

export const goalsQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["goals", userId],
    enabled: !!userId,
    queryFn: async (): Promise<Goal[]> => {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export function useGoals(userId: string | undefined) {
  return useQuery(goalsQuery(userId));
}

export type GoalInput = {
  name: string;
  category: string;
  target_value: number;
  current_value: number;
  value_type: string;
  target_date: string | null;
};

export function useGoalMutations(userId: string | undefined) {
  const qc = useQueryClient();
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["goals", userId] });
    qc.invalidateQueries({ queryKey: ["activities", userId] });
  };

  const create = useMutation({
    mutationFn: async (input: GoalInput) => {
      if (!userId) throw new Error("Not signed in");
      const { error } = await supabase.from("goals").insert({ ...input, user_id: userId });
      if (error) throw error;
      await logActivity(userId, "goal_created", `New goal created: ${input.name}`);
    },
    onSuccess: refresh,
  });

  const update = useMutation({
    mutationFn: async ({ id, ...input }: Partial<GoalInput> & { id: string; name?: string }) => {
      if (!userId) throw new Error("Not signed in");
      const { error } = await supabase.from("goals").update(input).eq("id", id);
      if (error) throw error;
      if (input.name) await logActivity(userId, "goal_edited", `Goal edited: ${input.name}`);
    },
    onSuccess: refresh,
  });

  const updateProgress = useMutation({
    mutationFn: async ({ goal, value }: { goal: Goal; value: number }) => {
      if (!userId) throw new Error("Not signed in");
      const completed = value >= Number(goal.target_value) && Number(goal.target_value) > 0;
      const { error } = await supabase
        .from("goals")
        .update({ current_value: value, status: completed ? "completed" : goal.status })
        .eq("id", goal.id);
      if (error) throw error;
      await logActivity(userId, "goal_updated", `Goal updated: ${goal.name}`);
    },
    onSuccess: refresh,
  });

  const setStatus = useMutation({
    mutationFn: async ({ goal, status }: { goal: Goal; status: "active" | "completed" }) => {
      if (!userId) throw new Error("Not signed in");
      const { error } = await supabase.from("goals").update({ status }).eq("id", goal.id);
      if (error) throw error;
      if (status === "completed")
        await logActivity(userId, "goal_completed", `Goal completed: ${goal.name}`);
    },
    onSuccess: refresh,
  });

  const remove = useMutation({
    mutationFn: async (goal: Goal) => {
      const { error } = await supabase.from("goals").delete().eq("id", goal.id);
      if (error) throw error;
    },
    onSuccess: refresh,
  });

  return { create, update, updateProgress, setStatus, remove };
}

/* ---------- Content pieces ---------- */

export const contentQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["content", userId],
    enabled: !!userId,
    queryFn: async (): Promise<ContentPiece[]> => {
      const { data, error } = await supabase
        .from("content_pieces")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

/* ---------- Posters ---------- */

export const latestPosterQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["poster", userId],
    enabled: !!userId,
    queryFn: async (): Promise<PosterRow | null> => {
      const { data, error } = await supabase
        .from("posters")
        .select("*")
        .eq("user_id", userId!)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
