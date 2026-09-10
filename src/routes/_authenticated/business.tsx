import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useSaveProfile } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, PageHeader, SectionCard } from "@/components/app/PageHeader";
import { BrandColorPicker } from "@/components/business/BrandColorPicker";
import {
  BusinessBasicsFields,
  BusinessContactFields,
  emptyBusinessValues,
  type BusinessFormValues,
} from "@/components/business/BusinessFields";

export const Route = createFileRoute("/_authenticated/business")({
  head: () => ({
    meta: [
      { title: "My Business — SmallBiz" },
      { name: "description", content: "Manage your business details, owner information and brand colour." },
      { property: "og:title", content: "My Business — SmallBiz" },
      { property: "og:description", content: "Manage your business details and brand colour." },
    ],
  }),
  component: BusinessPage,
});

function BusinessPage() {
  const { user } = useAuth();
  const profile = useProfile(user?.id);
  const save = useSaveProfile(user?.id);
  const [values, setValues] = useState<BusinessFormValues>(emptyBusinessValues);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (profile.data && !dirty) {
      const p = profile.data;
      setValues({
        owner_name: p.owner_name,
        business_name: p.business_name,
        category: p.category,
        description: p.description,
        products_services: p.products_services,
        target_audience: p.target_audience,
        location: p.location,
        phone: p.phone,
        business_email: p.business_email,
        brand_color: p.brand_color,
      });
    }
  }, [profile.data, dirty]);

  const patch = (p: Partial<BusinessFormValues>) => {
    setDirty(true);
    setValues((v) => ({ ...v, ...p }));
  };

  const discard = () => {
    setDirty(false);
  };

  const submit = async () => {
    if (!values.business_name.trim() || !values.owner_name.trim()) {
      toast.error("Business name and owner name are required.");
      return;
    }
    try {
      await save.mutateAsync(values);
      setDirty(false);
      toast.success("Business details saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    }
  };

  return (
    <div>
      <PageHeader
        title="My Business"
        description="This information personalises your content, posters and dashboard."
        actions={
          dirty && (
            <>
              <Button variant="outline" onClick={discard}>
                Discard
              </Button>
              <Button onClick={submit} disabled={save.isPending}>
                {save.isPending ? "Saving…" : "Save changes"}
              </Button>
            </>
          )
        }
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <SectionCard title="Business information">
            <BusinessBasicsFields values={values} onChange={patch} />
          </SectionCard>
          <SectionCard title="Contact & location">
            <BusinessContactFields values={values} onChange={patch} />
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Owner information">
            <div className="space-y-4">
              <Field label="Owner name">
                <Input value={values.owner_name} onChange={(e) => patch({ owner_name: e.target.value })} />
              </Field>
              <Field label="Account email" hint="The email you use to sign in.">
                <Input value={user?.email ?? ""} readOnly className="bg-muted" />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            title="Branding"
            description="Your brand colour is used in posters and promotional designs."
          >
            <BrandColorPicker value={values.brand_color} onChange={(hex) => patch({ brand_color: hex })} />
          </SectionCard>
        </div>
      </div>

      {dirty && (
        <div className="mt-5 flex justify-end gap-2 lg:hidden">
          <Button variant="outline" onClick={discard}>
            Discard
          </Button>
          <Button onClick={submit} disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      )}
    </div>
  );
}
