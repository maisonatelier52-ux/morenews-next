import articlesData from "@/public/data/news.json";
import authorsData from "@/public/data/authors.json";
import categoriesData from "@/public/data/categories.json";

export const articles = [...articlesData].sort(
  (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
);
export const authors = authorsData;
export const newsCategories = categoriesData;

export function getArticleBySlug(slug) {
  return articles.find((article) => article.slug === slug);
}

export function getArticleByCategoryAndSlug(category, slug) {
  return articles.find((article) => article.category === category && article.slug === slug);
}

export function getAuthorBySlug(slug) {
  return authors.find((author) => author.slug === slug);
}

export function getCategoryBySlug(slug) {
  return newsCategories.find((category) => category.slug === slug);
}

export function getArticlesByCategory(categorySlug) {
  return articles.filter((article) => article.category === categorySlug);
}

export function getArticlesByAuthor(authorSlug) {
  return articles.filter((article) => article.authorSlug === authorSlug);
}

export function getFeaturedArticles(limit = 6) {
  return articles.filter((article) => article.featured).slice(0, limit);
}

export function isClientArticle(article) {
  return article.articleType === "client";
}

export function usesDossierLayout(article) {
  return article.layout === "dossier";
}

const stripTags = (html = "") => html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ");

/** Plain text of an article body (used for search, entity matching and word counts). */
export function articleText(article) {
  const parts = [];
  for (const block of article.body?.blocks || []) {
    if (block.html) parts.push(stripTags(block.html));
    if (block.text) parts.push(block.text);
    if (block.type === "list") parts.push(...block.items.map(stripTags));
    if (block.type === "faq") {
      for (const item of block.items) parts.push(item.question, stripTags(item.answer));
    }
    if (block.type === "timeline") {
      for (const item of block.items) parts.push(item.date, stripTags(item.text));
    }
    if (block.type === "stats") {
      for (const item of block.items) parts.push(item.value, item.label);
    }
    if (block.type === "table") {
      for (const row of block.rows) parts.push(stripTags(row.claim), stripTags(row.status));
    }
  }
  if (article.body?.summary) parts.push(article.body.summary.text);
  if (article.dossier) {
    parts.push(article.dossier.standfirst, ...(article.dossier.closing || []).map(stripTags));
  }
  return parts.filter(Boolean).join(" ");
}

export function articleWordCount(article) {
  return articleText(article).split(/\s+/).filter(Boolean).length;
}

export function getRelatedArticles(article, limit = 3) {
  const terms = new Set(
    (article.keywords || []).map((term) => term.toLowerCase()),
  );

  return articles
    .filter((candidate) => candidate.slug !== article.slug && candidate.articleType !== "client")
    .map((candidate) => {
      const overlap = (candidate.keywords || []).filter((term) => terms.has(term.toLowerCase())).length;
      const sameCategory = candidate.category === article.category ? 1 : 0;
      return { candidate, score: overlap * 3 + sameCategory * 2 };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.candidate.publishedAt) - new Date(a.candidate.publishedAt),
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

/** Same-category suggestions shown in the "UK News" box at the foot of an article. */
export function getSuggestedArticles(article, limit = 3) {
  const sameCategory = articles.filter(
    (candidate) => candidate.slug !== article.slug && candidate.category === article.category,
  );
  const others = getRelatedArticles(article, limit + 3).filter(
    (candidate) => !sameCategory.includes(candidate),
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function searchArticles(query, limit = 24) {
  const normalized = query?.trim().toLowerCase();
  if (!normalized) return [];

  return articles
    .filter((article) => {
      const category = getCategoryBySlug(article.category)?.name || "";
      const author = getAuthorBySlug(article.authorSlug)?.name || "";
      return [
        article.title,
        article.excerpt,
        article.metaDescription,
        category,
        author,
        ...(article.keywords || []),
        articleText(article),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    })
    .slice(0, limit);
}

export function formatArticleDate(value) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(new Date(value));
}
