import EntityDirectory from "@/components/EntityDirectory";
import { profiles } from "@/lib/entities";

export const metadata = {
  title: "Profiles",
  description: "In-depth profiles published by More News.",
  alternates: { canonical: "/profile" },
};

export default function Page() {
  return <EntityDirectory title="Profiles" intro="In-depth profiles published by More News." items={profiles} basePath="/profile" label="Profile" />;
}
