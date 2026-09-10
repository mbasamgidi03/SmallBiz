import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useSaveProfile, logActivity } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/app/PageHeader";
import { LoadingScreen } from "@/components/app/LoadingScreen";
import { BrandColorPicker } from "@/components/business/BrandColorPicker";
import {
  BusinessBasicsFields,
  BusinessContactFields,
  emptyBusinessValues,
  type BusinessFormValues,
} from "@/components/business/BusinessFields";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Business setup — SmallBiz" },
      { name: "description", content: "Tell SmallBiz about your business so we can personalise your tools." },
      { property: "og:title", content: "Business setup — SmallBiz" },
      { property: "og:description", content: "Set up your business in SmallBiz." },
    ],
  }),
  component: Onboarding,
});

const STEPS = ["About your business", "Contact & brand"] as const;

function Onboarding() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const profile = useProfile(user?.id);
  const save = useSaveProfile(user?.id);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<BusinessFormValues>(emptyBusinessValues);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (profile.data?.onboarding_complete) navigate({ to: "/dashboard", replace: true });
  }, [profile.data, navigate]);

  if (loading || !user || profile.isPending) return <LoadingScreen />;

  const patch = (p: Partial<BusinessFormValues>) => setValues((v) => ({ ...v, ...p }));

  const next = () => {
    if (!values.owner_name.trim() || !values.business_name.trim()) {
      toast.error("Please enter your name and your business name.");
      return;
    }
    setStep(1);
  };

  const finish = async () => {
    try {
      await save.mutateAsync({
        ...values,
        account_email: user.email ?? "",
        onboarding_complete: true,
      });
      await logActivity(user.id, "setup", "Business profile set up");
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            SB
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight">Set up your business</p>
            <p className="text-xs text-muted-foreground">
              Step {step + 1} of {STEPS.length} · {STEPS[step]}
            </p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>

        <div className="rounded-lg border bg-card p-5 shadow-card">
          {step === 0 && (
            <div className="space-y-4">
              <Field label="Your name">
                <Input
                  value={values.owner_name}
                  onChange={(e) => patch({ owner_name: e.target.value })}
                  placeholder="e.g. Thandi Mokoena"
                  autoFocus
                />
              </Field>
              <BusinessBasicsFields values={values} onChange={patch} />
              <div className="flex justify-end pt-2">
                <Button onClick={next}>Continue</Button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <BusinessContactFields values={values} onChange={patch} />
              <div>
                <p className="mb-1.5 text-sm font-medium">Preferred brand colour</p>
                <p className="mb-3 text-xs text-muted-foreground">
                  Used for your posters and promotional designs. You can change it later.
                </p>
                <BrandColorPicker
                  value={values.brand_color}
                  onChange={(hex) => patch({ brand_color: hex })}
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <Button variant="ghost" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button onClick={finish} disabled={save.isPending}>
                  {save.isPending ? "Saving…" : "Finish setup"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
