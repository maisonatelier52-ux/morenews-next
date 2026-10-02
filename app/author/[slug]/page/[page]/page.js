import { notFound } from "next/navigation";
import AuthorPage from "@/components/AuthorPage";
import { authors, getAuthorBySlug, getArticlesByAuthor } from "@/lib/news";
import { AUTHOR_PAGE_SIZE, authorPagePath, paginate } from "@/lib/pagination";

export const dynamicParams = false;
export function generateStaticParams() {
  return authors.flatMap((author) => {
    const { pageCount } = paginate(getArticlesByAuthor(author.slug), 1, AUTHOR_PAGE_SIZE);
    return Array.from({ length: pageCount - 1 }, (_, index) => ({ slug: author.slug, page: String(index + 2) }));
  });
}
export function generateMetadata({ params }) {
  const author = getAuthorBySlug(params.slug);
  if (!author) return {};
  return { title: `${author.name} – Articles, Page ${params.page}`, description: author.metaDescription, alternates: { canonical: authorPagePath(author.slug, Number(params.page)) } };
}
export default function PaginatedAuthor({ params }) {
  const author = getAuthorBySlug(params.slug);
  const page = Number(params.page);
  if (!author || !/^\d+$/.test(params.page) || page < 2 || page > paginate(getArticlesByAuthor(author.slug), 1, AUTHOR_PAGE_SIZE).pageCount) notFound();
  return <AuthorPage author={author} page={page} />;
}
