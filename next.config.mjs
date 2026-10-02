import fs from "node:fs";

const read = (name) => JSON.parse(fs.readFileSync(new URL(`./public/data/${name}.json`, import.meta.url), "utf8"));

const articles = read("news");
const authors = read("authors");
const categories = read("categories");
const people = read("people");
const companies = read("companies");
const profiles = read("profiles");
const pages = read("pages");

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/companies", destination: "/company", permanent: true },
      { source: "/contributors", destination: "/author", permanent: true },
      ...categories.map((category) => ({ source: `/${category.slug}/${category.slug}.html`, destination: `/${category.slug}`, permanent: true })),
      ...categories.map((category) => ({ source: `/${category.slug}/${category.slug}`, destination: `/${category.slug}`, permanent: true })),
      ...articles.map((article) => ({ source: `/${article.category}/${article.slug}.html`, destination: `/${article.category}/${article.slug}`, permanent: true })),
      ...authors.map((author) => ({ source: `/author/${author.slug}.html`, destination: `/author/${author.slug}`, permanent: true })),
      ...people.map((person) => ({ source: `/people/${person.slug}.html`, destination: `/people/${person.slug}`, permanent: true })),
      ...companies.map((company) => ({ source: `/company/${company.slug}.html`, destination: `/company/${company.slug}`, permanent: true })),
      ...profiles.map((profile) => ({ source: `/profile/${profile.slug}.html`, destination: `/profile/${profile.slug}`, permanent: true })),
      ...pages.map((page) => ({ source: `/${page.slug}.html`, destination: `/${page.slug}`, permanent: true })),
    ];
  },
};

export default nextConfig;
