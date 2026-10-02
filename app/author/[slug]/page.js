import { notFound } from "next/navigation";
import AuthorPage from "@/components/AuthorPage";
import { authors, getAuthorBySlug } from "@/lib/news";
import { authorPath } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return authors.map((author) => ({ slug: author.slug }));
}

export function generateMetadata({ params }) {
  const author = getAuthorBySlug(params.slug);
  if (!author) return {};
  return {
    title: author.metaTitle,
    description: author.metaDescription,
    alternates: { canonical: authorPath(author) },
    openGraph: { type: "profile", title: author.metaTitle, description: author.metaDescription, url: authorPath(author), images: [{ url: absoluteUrl(author.image), alt: author.name }] },
  };
}

export default function Page({ params }) {
  const author = getAuthorBySlug(params.slug);
  if (!author) notFound();
  return <AuthorPage author={author} />;
}
