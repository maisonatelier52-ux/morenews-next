import { newsCategories, authors } from "@/lib/news";
import pagesData from "@/public/data/pages.json";
import { categoryPath, authorPath, pagePath } from "@/lib/routes";

export const pages = pagesData;

export function getPage(slug) {
  return pages.find((page) => page.slug === slug);
}

export const categories = newsCategories.map((category) => ({
  label: category.name,
  href: categoryPath(category),
  slug: category.slug,
}));

/** [label, href] pairs for the header nav. */
export const navCategories = [["Home", "/"], ...categories.map((category) => [category.label, category.href])];

export const extraNavLinks = [
  { label: "People", href: "/people" },
  { label: "Companies", href: "/company" },
  { label: "Authors", href: "/author" },
];

export const footerColumns = {
  explore: navCategories.map(([label, href]) => ({ label, href })),
  authors: authors.filter((author) => !author.desk).map((author) => ({ label: author.name, href: authorPath(author) })),
  about: pages.filter((page) => page.group === "about").map((page) => ({ label: page.label, href: pagePath(page.slug) })),
  policies: pages.filter((page) => page.group === "policy").map((page) => ({ label: page.label, href: pagePath(page.slug) })),
};
