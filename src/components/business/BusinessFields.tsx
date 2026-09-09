import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field } from "@/components/app/PageHeader";
import { BUSINESS_CATEGORIES } from "@/lib/types";

export type BusinessFormValues = {
  owner_name: string;
  business_name: string;
  category: string;
  description: string;
  products_services: string;
  target_audience: string;
  location: string;
  phone: string;
  business_email: string;
  brand_color: string;
};

export const emptyBusinessValues: BusinessFormValues = {
  owner_name: "",
  business_name: "",
  category: "",
  description: "",
  products_services: "",
  target_audience: "",
  location: "",
  phone: "",
  business_email: "",
  brand_color: "#1d6f5c",
};

type Props = {
  values: BusinessFormValues;
  onChange: (patch: Partial<BusinessFormValues>) => void;
};

export function BusinessBasicsFields({ values, onChange }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Business name">
        <Input
          value={values.business_name}
          onChange={(e) => onChange({ business_name: e.target.value })}
          placeholder="e.g. Thandi's Bakery"
        />
      </Field>
      <Field label="Business category">
        <Select value={values.category} onValueChange={(v) => onChange({ category: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a category" />
          </SelectTrigger>
          <SelectContent>
            {BUSINESS_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Business description" hint="One or two sentences about what you do.">
          <Textarea
            rows={2}
            value={values.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="e.g. Home bakery making fresh bread, cakes and treats for the neighbourhood."
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Products / services offered">
          <Textarea
            rows={2}
            value={values.products_services}
            onChange={(e) => onChange({ products_services: e.target.value })}
            placeholder="e.g. Birthday cakes, cupcakes, fresh bread, catering platters"
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Target audience">
          <Input
            value={values.target_audience}
            onChange={(e) => onChange({ target_audience: e.target.value })}
            placeholder="e.g. Families and small offices in Soweto"
          />
        </Field>
      </div>
    </div>
  );
}

export function BusinessContactFields({ values, onChange }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field label="Business location">
          <Input
            value={values.location}
            onChange={(e) => onChange({ location: e.target.value })}
            placeholder="e.g. 12 Vilakazi St, Soweto"
          />
        </Field>
      </div>
      <Field label="Contact number">
        <Input
          type="tel"
          value={values.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="e.g. 072 123 4567"
        />
      </Field>
      <Field label="Business email" optional>
        <Input
          type="email"
          value={values.business_email}
          onChange={(e) => onChange({ business_email: e.target.value })}
          placeholder="hello@business.co.za"
        />
      </Field>
    </div>
  );
}
