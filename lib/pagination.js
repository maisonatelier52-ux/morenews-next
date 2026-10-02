export const CATEGORY_PAGE_SIZE = 8;
export const AUTHOR_PAGE_SIZE = 8;

export function categoryPagePath(slug, page = 1) {
  return page === 1 ? `/${slug}` : `/${slug}/page/${page}`;
}

export function authorPagePath(slug, page = 1) {
  return page === 1 ? `/author/${slug}` : `/author/${slug}/page/${page}`;
}

export function paginate(items, page = 1, pageSize = CATEGORY_PAGE_SIZE) {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  return { pageCount, items: items.slice((page - 1) * pageSize, page * pageSize), start: (page - 1) * pageSize + 1, end: Math.min(page * pageSize, items.length) };
}

export const paginateCategory = (items, page = 1) => paginate(items, page, CATEGORY_PAGE_SIZE);
