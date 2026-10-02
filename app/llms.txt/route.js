import { articles, newsCategories } from "@/lib/news";
import { companies, people } from "@/lib/entities";
import { articlePath, categoryPath, companyPath, personPath } from "@/lib/routes";
import { absoluteUrl, siteConfig } from "@/lib/site";

export function GET() {
  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "## Categories",
    ...newsCategories.map((category) => `- [${category.name}](${absoluteUrl(categoryPath(category))}): ${category.description}`),
    "",
    "## Client And Entity Coverage",
    ...articles.filter((article) => article.articleType === "client").map((article) => `- [${article.title}](${absoluteUrl(articlePath(article))})`),
    ...people.map((item) => `- [${item.name}](${absoluteUrl(personPath(item.slug))}): ${item.metaDescription}`),
    ...companies.map((item) => `- [${item.name}](${absoluteUrl(companyPath(item.slug))}): ${item.metaDescription}`),
    "",
    "## Latest Articles",
    ...articles.slice(0, 80).map((article) => `- [${article.title}](${absoluteUrl(articlePath(article))})`),
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
