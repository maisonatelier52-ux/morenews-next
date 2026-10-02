import { notFound } from "next/navigation";
import EntityPage from "@/components/EntityPage";
import { profiles, getProfile } from "@/lib/entities";
import { entityPath } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return profiles.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }) {
  const entity = getProfile(params.slug);
  if (!entity) return {};
  return {
    title: entity.metaTitle,
    description: entity.metaDescription,
    alternates: { canonical: entityPath(entity) },
    openGraph: {
      type: "profile",
      title: entity.metaTitle,
      description: entity.metaDescription,
      url: entityPath(entity),
      images: entity.heroImage ? [{ url: absoluteUrl(entity.heroImage), alt: entity.heroImageAlt || entity.name }] : undefined,
    },
  };
}

export default function Page({ params }) {
  const entity = getProfile(params.slug);
  if (!entity) notFound();
  return <EntityPage entity={entity} />;
}
