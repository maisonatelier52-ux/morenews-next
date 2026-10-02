import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, "public/data", `${name}.json`), "utf8"));
const news = read("news"), authors = read("authors"), categories = read("categories"), pages = read("pages");
const datasets = { news, authors, categories, pages, people: read("people"), companies: read("companies"), profiles: read("profiles") };
const errors = [];
const slugs = new Set();
const authorSlugs = new Set(authors.map((a) => a.slug));
const categorySlugs = new Set(categories.map((c) => c.slug));
const routes = new Set(["/", "/author", "/people", "/company", "/profile", "/latest-posts", "/search"]);
categories.forEach((c) => routes.add(`/${c.slug}`));
news.forEach((a) => routes.add(`/${a.category}/${a.slug}`));
authors.forEach((a) => routes.add(`/author/${a.slug}`));
pages.forEach((p) => routes.add(`/${p.slug}`));
for (const [name, folder] of [["people", "people"], ["companies", "company"], ["profiles", "profile"]]) datasets[name].forEach((e) => routes.add(`/${folder}/${e.slug}`));
for (const article of news) {
  if (slugs.has(article.slug)) errors.push(`Duplicate article: ${article.slug}`);
  slugs.add(article.slug);
  if (!article.body?.blocks?.length) errors.push(`Empty article body: ${article.slug}`);
  if (!authorSlugs.has(article.authorSlug)) errors.push(`Missing author: ${article.slug}`);
  if (!categorySlugs.has(article.category)) errors.push(`Missing category: ${article.slug}`);
  if (!Number.isFinite(Date.parse(article.publishedAt))) errors.push(`Invalid publication date: ${article.slug}`);
}
for (const page of pages) if (!page.sections?.length) errors.push(`Empty information page: ${page.slug}`);

function check(value, location) {
  if (Array.isArray(value)) return value.forEach((v, i) => check(v, `${location}[${i}]`));
  if (value && typeof value === "object") return Object.entries(value).forEach(([key, v]) => check(v, `${location}.${key}`));
  if (typeof value !== "string") return;
  for (const match of value.matchAll(/\/images\/[^\s"<>]+/g)) {
    if (!fs.existsSync(path.join(root, "public", match[0]))) errors.push(`Missing image ${match[0]} in ${location}`);
  }
  if (/<script\b|\son\w+\s*=|javascript:/i.test(value)) errors.push(`Unsafe imported markup: ${location}`);
  for (const match of value.matchAll(/href=["'](\/(?!\/)[^"']+)["']/g)) {
    const url = match[1].split(/[?#]/)[0].replace(/\/$/, "") || "/";
    if (!routes.has(url) && !fs.existsSync(path.join(root, "public", url))) errors.push(`Missing internal route ${url} in ${location}`);
  }
}
Object.entries(datasets).forEach(([name, data]) => check(data, name));
if (errors.length) { console.error([...new Set(errors)].join("\n")); process.exitCode = 1; }
else console.log(`Content validation passed: ${news.length} complete articles, ${categories.length} categories, ${authors.length} authors, ${pages.length} information pages. Images and internal content links resolve.`);
