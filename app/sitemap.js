import { articles, authors, newsCategories, getArticlesByAuthor, getArticlesByCategory } from "@/lib/news";
import { AUTHOR_PAGE_SIZE, authorPagePath, categoryPagePath, paginate } from "@/lib/pagination";
import { companies, people, profiles } from "@/lib/entities";
import { pages } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { articlePath, authorPath, categoryPath, companyPath, pagePath, personPath, profilePath } from "@/lib/routes";

export default function sitemap() {
  const now = new Date();
  const abs = (path) => `${siteConfig.url}${path}`;
  return [
    { url: siteConfig.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: abs("/latest-posts"), lastModified: now, changeFrequency: "daily", priority: 0.7 },
    ...newsCategories.map((category) => ({ url: abs(categoryPath(category)), lastModified: now, changeFrequency: "daily", priority: 0.8 })),
    ...newsCategories.flatMap((category) => Array.from({ length: paginate(getArticlesByCategory(category.slug)).pageCount - 1 }, (_, index) => ({ url: abs(categoryPagePath(category.slug, index + 2)), lastModified: now, changeFrequency: "daily", priority: 0.6 }))),
    ...articles.map((article) => ({
      url: abs(articlePath(article)),
      lastModified: article.updatedAt || article.publishedAt || now,
      changeFrequency: "weekly",
      priority: article.articleType === "client" ? 0.95 : 0.85,
    })),
    ...authors.map((author) => ({ url: abs(authorPath(author)), lastModified: now, changeFrequency: "monthly", priority: 0.55 })),
    ...authors.flatMap((author) => Array.from({ length: paginate(getArticlesByAuthor(author.slug), 1, AUTHOR_PAGE_SIZE).pageCount - 1 }, (_, index) => ({ url: abs(authorPagePath(author.slug, index + 2)), lastModified: now, changeFrequency: "monthly", priority: 0.45 }))),
    ...people.map((item) => ({ url: abs(personPath(item.slug)), lastModified: now, changeFrequency: "monthly", priority: 0.75 })),
    ...companies.map((item) => ({ url: abs(companyPath(item.slug)), lastModified: now, changeFrequency: "monthly", priority: 0.75 })),
    ...profiles.map((item) => ({ url: abs(profilePath(item.slug)), lastModified: now, changeFrequency: "monthly", priority: 0.65 })),
    ...pages.map((page) => ({ url: abs(pagePath(page.slug)), lastModified: now, changeFrequency: "yearly", priority: 0.45 })),
    { url: abs("/people"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: abs("/company"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: abs("/profile"), lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: abs("/author"), lastModified: now, changeFrequency: "weekly", priority: 0.5 },
  ];
}
