import { authors, articleText, articleWordCount, isClientArticle } from "@/lib/news";
import { companies, entityAliases, people, entityPeople } from "@/lib/entities";
import { siteConfig, absoluteUrl } from "@/lib/site";
import { articlePath, authorPath, categoryPath, companyPath, entityPath, personPath } from "@/lib/routes";

export const orgId = `${siteConfig.url}/#publisher`;
export const websiteId = `${siteConfig.url}/#website`;

export function entityId(kind, slug) {
  if (kind === "company") return `${absoluteUrl(companyPath(slug))}#organization`;
  return `${absoluteUrl(personPath(slug))}#person`;
}

export function publisherNode() {
  return {
    "@type": "NewsMediaOrganization",
    "@id": orgId,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(siteConfig.logo),
      width: 512,
      height: 512,
    },
    address: { "@type": "PostalAddress", addressCountry: "GB" },
    sameAs: Object.values(siteConfig.socials),
  };
}

export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: siteConfig.url,
    name: siteConfig.name,
    inLanguage: "en-GB",
    publisher: { "@id": orgId },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/search?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbNode(items, id) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${id}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

const clean = (node) => Object.fromEntries(Object.entries(node).filter(([, value]) => value !== undefined));

/** People and companies actually named in the article. */
export function articleEntityRefs(article) {
  const haystack = [article.title, article.metaDescription, article.excerpt, ...(article.keywords || []), articleText(article)]
    .join(" ")
    .toLowerCase();
  const refs = [];
  for (const [kind, list] of [["people", people], ["company", companies]]) {
    for (const entity of list) {
      if (entityAliases(entity).some((alias) => alias.length > 6 && haystack.includes(alias))) {
        refs.push({ "@id": entityId(kind, entity.slug) });
      }
    }
  }
  return refs;
}

export function articleGraph(article, category) {
  const pageUrl = absoluteUrl(articlePath(article));
  const pageId = `${pageUrl}#webpage`;
  const articleId = `${pageUrl}#article`;
  const author = authors.find((item) => item.slug === article.authorSlug);
  const authorUrl = absoluteUrl(authorPath(article.authorSlug));
  const authorId = `${authorUrl}#author`;
  const entityRefs = articleEntityRefs(article);
  const wordCount = articleWordCount(article);

  return {
    "@context": "https://schema.org",
    "@graph": [
      publisherNode(),
      websiteNode(),
      breadcrumbNode(
        [
          { name: "Home", url: "/" },
          { name: category?.name || article.category, url: categoryPath(article.category) },
          { name: article.title, url: articlePath(article) },
        ],
        pageUrl,
      ),
      clean({
        "@type": "Person",
        "@id": authorId,
        name: author?.name,
        url: authorUrl,
        image: author?.image ? absoluteUrl(author.image) : undefined,
        jobTitle: author?.role,
        worksFor: { "@id": orgId },
      }),
      clean({
        "@type": "WebPage",
        "@id": pageId,
        url: pageUrl,
        name: article.metaTitle || article.title,
        description: article.metaDescription || article.excerpt,
        isPartOf: { "@id": websiteId },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        primaryImageOfPage: article.image ? { "@type": "ImageObject", url: absoluteUrl(article.image) } : undefined,
        mainEntity: { "@id": articleId },
        about: entityRefs.length ? entityRefs : undefined,
        inLanguage: "en-GB",
      }),
      clean({
        "@type": isClientArticle(article) ? "Article" : "NewsArticle",
        "@id": articleId,
        headline: article.title,
        description: article.metaDescription || article.excerpt,
        image: article.image ? [absoluteUrl(article.image)] : undefined,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt || article.publishedAt,
        articleSection: category?.name || article.category,
        wordCount: wordCount || undefined,
        inLanguage: "en-GB",
        isAccessibleForFree: true,
        author: { "@id": authorId },
        publisher: { "@id": orgId },
        mainEntityOfPage: { "@id": pageId },
        about: entityRefs.length ? entityRefs : undefined,
        mentions: entityRefs.length ? entityRefs : undefined,
        keywords: article.keywords?.length ? article.keywords.join(", ") : undefined,
      }),
    ],
  };
}

export function entityGraph(entity) {
  const url = absoluteUrl(entityPath(entity));
  const pageId = `${url}#webpage`;
  const isCompany = entity.kind === "company";
  const isProfile = entity.kind === "profile";
  // A /profile/ page describes the same person as the matching /people/ page.
  const linkedPerson = isProfile ? entityPeople[entity.slug] : null;
  const mainId = isProfile
    ? linkedPerson
      ? entityId("people", entity.slug)
      : `${url}#person`
    : entityId(entity.kind, entity.slug);
  const raw = entity.schema || {};
  const listLabel = isCompany ? ["Companies", "/company"] : isProfile ? ["Profiles", "/profile"] : ["People", "/people"];

  const nodes = [
    publisherNode(),
    websiteNode(),
    breadcrumbNode(
      [
        { name: "Home", url: "/" },
        { name: listLabel[0], url: listLabel[1] },
        { name: entity.name, url: entityPath(entity) },
      ],
      url,
    ),
  ];

  if (!isProfile || !linkedPerson) {
    nodes.push(
      clean({
        ...raw,
        "@type": isCompany ? "Organization" : "Person",
        "@id": mainId,
        name: entity.name,
        url,
        description: entity.metaDescription || raw.description,
        image: entity.image ? absoluteUrl(entity.image) : raw.image,
      }),
    );
  }

  nodes.push(
    clean({
      "@type": "ProfilePage",
      "@id": pageId,
      url,
      name: entity.metaTitle || entity.name,
      description: entity.metaDescription,
      isPartOf: { "@id": websiteId },
      breadcrumb: { "@id": `${url}#breadcrumb` },
      mainEntity: { "@id": mainId },
      about: { "@id": mainId },
      inLanguage: "en-GB",
    }),
  );

  return { "@context": "https://schema.org", "@graph": nodes };
}
