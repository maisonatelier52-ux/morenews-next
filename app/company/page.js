import EntityDirectory from "@/components/EntityDirectory";
import { companies } from "@/lib/entities";

export const metadata = {
  title: "Companies",
  description: "Profiles of the companies and organisations featured in More News reporting.",
  alternates: { canonical: "/company" },
};

export default function Page() {
  return <EntityDirectory title="Companies" intro="Profiles of the companies and organisations featured in More News reporting." items={companies} basePath="/company" label="Company" />;
}
