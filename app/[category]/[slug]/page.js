import { notFound } from "next/navigation";
import DossierArticle from "@/components/DossierArticle";
import JsonLd from "@/components/JsonLd";
import StandardArticle from "@/components/StandardArticle";
import { articleGraph } from "@/lib/seo";
import { articles, getArticleByCategoryAndSlug, getAuthorBySlug, getCategoryBySlug, usesDossierLayout } from "@/lib/news";
import { articlePath } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({ category: article.category, slug: article.slug }));
}

export function generateMetadata({ params }) {
  const article = getArticleByCategoryAndSlug(params.category, params.slug);
  if (!article) return {};
  const author = getAuthorBySlug(article.authorSlug);
  const image = absoluteUrl(article.image);
  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    keywords: article.keywords?.length ? article.keywords : undefined,
    authors: author ? [{ name: author.name, url: `/author/${author.slug}` }] : undefined,
    alternates: { canonical: articlePath(article) },
    openGraph: {
      type: "article",
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      url: articlePath(article),
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      section: getCategoryBySlug(article.category)?.name,
      authors: author ? [author.name] : undefined,
      images: [{ url: image, alt: article.imageAlt || article.title }],
    },
    twitter: { card: "summary_large_image", title: article.metaTitle || article.title, description: article.metaDescription || article.excerpt, images: [image] },
  };
}

export default function ArticlePage({ params }) {
  const article = getArticleByCategoryAndSlug(params.category, params.slug);
  if (!article) notFound();
  const category = getCategoryBySlug(article.category);
  return (
    <>
      <JsonLd data={articleGraph(article, category)} />
      {usesDossierLayout(article) ? <DossierArticle article={article} /> : <StandardArticle article={article} />}
    </>
  );
}
