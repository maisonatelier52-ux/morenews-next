import { articles, getAuthorBySlug, getCategoryBySlug } from "@/lib/news";
import { articlePath } from "@/lib/routes";
import { absoluteUrl, siteConfig } from "@/lib/site";

const escapeXml = (value = "") =>
  String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

export function GET() {
  const items = articles
    .slice(0, 60)
    .map((article) => {
      const link = absoluteUrl(articlePath(article));
      const author = getAuthorBySlug(article.authorSlug);
      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(article.excerpt || article.metaDescription)}</description>
      <category>${escapeXml(getCategoryBySlug(article.category)?.name || article.category)}</category>
      ${author ? `<dc:creator>${escapeXml(author.name)}</dc:creator>` : ""}
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>${escapeXml(siteConfig.name)}</title><link>${siteConfig.url}</link><description>${escapeXml(siteConfig.description)}</description><language>en-gb</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
