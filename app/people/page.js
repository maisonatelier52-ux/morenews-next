import EntityDirectory from "@/components/EntityDirectory";
import { people } from "@/lib/entities";

export const metadata = {
  title: "People",
  description: "Profiles of the people featured in More News reporting.",
  alternates: { canonical: "/people" },
};

export default function Page() {
  return <EntityDirectory title="People" intro="Profiles of the people featured in More News reporting." items={people} basePath="/people" label="Person" />;
}
