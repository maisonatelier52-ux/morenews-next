export function categoryPath(category) {
  const slug = typeof category === "string" ? category : category.slug;
  return `/${slug}`;
}

export function articlePath(article) {
  return `${categoryPath(article.category)}/${article.slug}`;
}

export function authorPath(author) {
  const slug = typeof author === "string" ? author : author.slug;
  return `/author/${slug}`;
}

export function personPath(slug) {
  return `/people/${slug}`;
}

export function companyPath(slug) {
  return `/company/${slug}`;
}

export function profilePath(slug) {
  return `/profile/${slug}`;
}

export function pagePath(slug) {
  return `/${slug}`;
}

export function entityPath(entity) {
  if (entity.kind === "company") return companyPath(entity.slug);
  if (entity.kind === "profile") return profilePath(entity.slug);
  return personPath(entity.slug);
}
