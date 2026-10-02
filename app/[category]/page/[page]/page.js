import { notFound } from "next/navigation";
import CategoryPage from "@/components/CategoryPage";
import { getArticlesByCategory, getCategoryBySlug, newsCategories } from "@/lib/news";
import { categoryPagePath, paginateCategory } from "@/lib/pagination";

export const dynamicParams = false;
export function generateStaticParams() {
  return newsCategories.flatMap((category) => {
    const { pageCount } = paginateCategory(getArticlesByCategory(category.slug));
    return Array.from({ length: pageCount - 1 }, (_, index) => ({ category: category.slug, page: String(index + 2) }));
  });
}
export function generateMetadata({ params }) {
  const category = getCategoryBySlug(params.category);
  if (!category) return {};
  return { title: `${category.name} News – Page ${params.page}`, description: category.description, alternates: { canonical: categoryPagePath(category.slug, Number(params.page)) } };
}
export default function PaginatedCategory({ params }) {
  const category = getCategoryBySlug(params.category);
  const page = Number(params.page);
  if (!category || !/^\d+$/.test(params.page) || page < 2 || page > paginateCategory(getArticlesByCategory(category.slug)).pageCount) notFound();
  return <CategoryPage category={category} page={page} />;
}
