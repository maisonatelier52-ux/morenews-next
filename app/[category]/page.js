import { notFound } from "next/navigation";
import CategoryPage from "@/components/CategoryPage";
import InformationPage from "@/components/InformationPage";
import { pages, getPage } from "@/lib/data";
import { getCategoryBySlug, newsCategories } from "@/lib/news";
import { categoryPath } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...newsCategories.map((category) => ({ category: category.slug })), ...pages.map((page) => ({ category: page.slug }))];
}

export function generateMetadata({ params }) {
  const category = getCategoryBySlug(params.category);
  if (category) {
    return {
      title: category.title || category.name,
      description: category.description,
      alternates: { canonical: categoryPath(category) },
    };
  }
  const page = getPage(params.category);
  if (!page) return {};
  return { title: page.title, description: page.description, alternates: { canonical: `/${page.slug}` } };
}

export default function CategoryOrInfoPage({ params }) {
  const category = getCategoryBySlug(params.category);
  if (!category) {
    const page = getPage(params.category);
    if (!page) notFound();
    return <InformationPage page={page} />;
  }

  return <CategoryPage category={category} />;
}
