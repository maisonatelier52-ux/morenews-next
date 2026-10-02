import { articles, authors, articleText, getCategoryBySlug } from "@/lib/news";
import { companies, people, profiles } from "@/lib/entities";
import { pages } from "@/lib/data";
import { articlePath, authorPath, companyPath, pagePath, personPath, profilePath } from "@/lib/routes";

function match(query, parts) {
  return parts.filter(Boolean).join(" ").toLowerCase().includes(query);
}

const entityText = (item) =>
  [item.name, item.metaTitle, item.metaDescription, item.jobTitle, item.tagline, ...item.sections.flatMap((section) => [section.heading, ...section.items.map((entry) => (typeof entry === "string" ? entry : `${entry.title || ""} ${entry.excerpt || ""}`))])];

export const emptyResults = { articles: [], people: [], companies: [], authors: [], pages: [], profiles: [], total: 0 };

export function searchSite(query) {
  const q = query.trim().toLowerCase();
  if (!q) return emptyResults;

  const articleResults = articles
    .filter((article) =>
      match(q, [article.title, article.excerpt, article.metaDescription, article.category, ...(article.keywords || []), articleText(article)]) ||
      match(q, [authors.find((author) => author.slug === article.authorSlug)?.name]),
    )
    .slice(0, 24);
  const peopleResults = people.filter((item) => match(q, entityText(item))).slice(0, 12);
  const companyResults = companies.filter((item) => match(q, entityText(item))).slice(0, 12);
  const profileResults = profiles.filter((item) => match(q, entityText(item))).slice(0, 12);
  const authorResults = authors.filter((item) => match(q, [item.name, item.role, item.bio, item.metaDescription])).slice(0, 12);
  const pageResults = pages.filter((item) => match(q, [item.title, item.description, item.label])).slice(0, 12);

  const withMeta = (item, url, label) => ({ ...item, url, label });

  return {
    articles: articleResults.map((article) => ({
      ...article,
      url: articlePath(article),
      label: getCategoryBySlug(article.category)?.name || article.category,
    })),
    people: peopleResults.map((item) => withMeta({ ...item, title: item.name, excerpt: item.tagline || item.metaDescription }, personPath(item.slug), "People")),
    companies: companyResults.map((item) => withMeta({ ...item, title: item.name, excerpt: item.tagline || item.metaDescription }, companyPath(item.slug), "Company")),
    profiles: profileResults.map((item) => withMeta({ ...item, title: item.name, excerpt: item.tagline || item.metaDescription }, profilePath(item.slug), "Profile")),
    authors: authorResults.map((item) => withMeta({ ...item, title: item.name, excerpt: item.bio }, authorPath(item), "Author")),
    pages: pageResults.map((item) => withMeta({ ...item, excerpt: item.description, image: undefined }, pagePath(item.slug), "Page")),
    total: articleResults.length + peopleResults.length + companyResults.length + profileResults.length + authorResults.length + pageResults.length,
  };
}
