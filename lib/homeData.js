import {
  articles,
  formatArticleDate,
  getArticleBySlug,
  getArticlesByCategory,
  getAuthorBySlug,
  getCategoryBySlug,
} from "@/lib/news";
import { articlePath } from "@/lib/routes";

function card(article) {
  if (!article) return null;
  const author = getAuthorBySlug(article.authorSlug);
  const category = getCategoryBySlug(article.category);
  return {
    slug: article.slug,
    href: articlePath(article),
    image: article.image,
    imageAlt: article.imageAlt || article.title,
    title: article.title,
    excerpt: article.excerpt,
    category: category?.name || article.category,
    categorySlug: article.category,
    author: author?.name || "More News",
    authorSlug: article.authorSlug,
    date: formatArticleDate(article.publishedAt),
    publishedAt: article.publishedAt,
  };
}

// Every story used anywhere on the homepage is recorded here so no story
// appears twice, no matter which section claims it first.
const usedSlugs = new Set();

function takeUnique(list, count) {
  const picked = [];
  for (const article of list) {
    if (picked.length >= count) break;
    if (usedSlugs.has(article.slug)) continue;
    usedSlugs.add(article.slug);
    picked.push(article);
  }
  return picked;
}

const byNewest = (list) => [...list].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

const ukStories = getArticlesByCategory("uk");
const politicsStories = getArticlesByCategory("politics");
const businessStories = getArticlesByCategory("business");
const worldStories = getArticlesByCategory("world");
const investigationStories = getArticlesByCategory("investigation");
const techHealthStories = byNewest([...getArticlesByCategory("tech"), ...getArticlesByCategory("health")]);
const sportsInvestigationStories = byNewest([
  ...getArticlesByCategory("sports"),
  ...getArticlesByCategory("investigation"),
]);

// Homepage lead + side feature: change these slugs to pin different stories,
// or set to null to fall back to the newest featured articles.
const PINNED_HERO_SLUG = "britannia-leadership-julio-cesar-herrera-lord-stanley-fink";
const PINNED_SIDE_SLUG = "isabela-herrera-banvelca-patient-capital";

const featured = articles.filter((article) => article.featured);
const heroStory = (PINNED_HERO_SLUG && getArticleBySlug(PINNED_HERO_SLUG)) || featured[0] || articles[0];
usedSlugs.add(heroStory.slug);
const sideFeatureStory =
  (PINNED_SIDE_SLUG && getArticleBySlug(PINNED_SIDE_SLUG)) ||
  featured.find((article) => article.slug !== heroStory.slug);
if (sideFeatureStory) usedSlugs.add(sideFeatureStory.slug);

export const hero = card(heroStory);
export const sideFeature = card(sideFeatureStory);

// Headline rail (3 newest) + the two small stories beside the lead.
export const rail = takeUnique(articles, 3).map(card);
export const heroSmall = takeUnique(ukStories, 2).map(card);

// Story grid — politics
export const storyDuo = takeUnique(politicsStories, 2).map(card);
export const storyFeature = card(takeUnique(politicsStories, 1)[0]);
export const storyCategory = card(takeUnique(politicsStories, 1)[0]);
export const storyCategorySide = card(takeUnique(politicsStories, 1)[0]);

// Side feed — investigation + business
export const sideCards = [
  ...takeUnique(investigationStories, 1),
  ...takeUnique(businessStories, 2),
].map(card);

// Insight board — tech & health
export const insightBoard = takeUnique(techHealthStories, 4).map(card);

// Journal — world
export const journal = takeUnique(worldStories, 5).map(card);

// Bottom strip — sport & investigation
export const strip = takeUnique(sportsInvestigationStories, 5).map(card);

// Fill the original editorial spaces with distinct stories from the same archive.
export const heroExtra = takeUnique(businessStories, 1).map(card);
export const primaryExtra = takeUnique(articles.filter((article) => article.articleType !== "client"), 3).map(card);
export const moreSections = ["business", "health"].map((slug) => ({
  slug,
  name: getCategoryBySlug(slug)?.name || slug,
  items: takeUnique(getArticlesByCategory(slug), 3).map(card),
})).filter((section) => section.items.length);
export const sideExtra = takeUnique(articles.filter((article) => article.articleType !== "client"), 1).map(card);

// Extra reading that fills the short text columns beside tall images.
const nonClient = (list) => list.filter((article) => article.articleType !== "client");
export const heroRelated = takeUnique(nonClient(worldStories.length > 4 ? worldStories : articles), 1).map(card);
export const featureRelated = takeUnique(nonClient(politicsStories), 1).map(card);
export const categoryRelated = takeUnique(nonClient(politicsStories.length > 1 ? politicsStories : articles), 0).map(card);
