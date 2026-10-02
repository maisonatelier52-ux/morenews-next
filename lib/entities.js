import peopleData from "@/public/data/people.json";
import companiesData from "@/public/data/companies.json";
import profilesData from "@/public/data/profiles.json";
import { articles, articleText, getArticleByCategoryAndSlug } from "@/lib/news";

export const people = peopleData;
export const companies = companiesData;
export const profiles = profilesData;

export const entityPeople = Object.fromEntries(peopleData.map((entity) => [entity.slug, entity]));
export const entityCompanies = Object.fromEntries(companiesData.map((entity) => [entity.slug, entity]));
export const entityProfiles = Object.fromEntries(profilesData.map((entity) => [entity.slug, entity]));

export function getPerson(slug) {
  return entityPeople[slug] || null;
}
export function getCompany(slug) {
  return entityCompanies[slug] || null;
}
export function getProfile(slug) {
  return entityProfiles[slug] || null;
}

export const entityCollections = {
  people: { label: "People", items: people, getter: getPerson, base: "/people" },
  company: { label: "Companies", items: companies, getter: getCompany, base: "/company" },
  profile: { label: "Profiles", items: profiles, getter: getProfile, base: "/profile" },
};

/** Names an entity may be mentioned by in article copy. */
export function entityAliases(entity) {
  const alt = entity.schema?.alternateName;
  return [
    entity.name,
    ...(Array.isArray(alt) ? alt : alt ? [alt] : []),
  ]
    .filter(Boolean)
    .map((value) => value.toLowerCase());
}

/** Articles that actually mention the entity (title, keywords or body). */
export function getEntityCoverage(entity, limit = 6) {
  const aliases = entityAliases(entity).filter((alias) => alias.length > 6);
  return articles
    .filter((article) => {
      const haystack = [article.title, article.excerpt, ...(article.keywords || []), articleText(article)]
        .join(" ")
        .toLowerCase();
      return aliases.some((alias) => haystack.includes(alias));
    })
    .slice(0, limit);
}

/** Resolve "/category/slug" hrefs to live article records so cards stay in sync with news.json. */
export function resolveArticleHref(href) {
  const match = /^\/([^/]+)\/([^/]+)$/.exec(href || "");
  return match ? getArticleByCategoryAndSlug(match[1], match[2]) : undefined;
}
