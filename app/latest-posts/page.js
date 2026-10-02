import Card from "@/components/Card";
import JsonLd from "@/components/JsonLd";
import { articles, getCategoryBySlug } from "@/lib/news";
import { articlePath } from "@/lib/routes";
import { breadcrumbNode, publisherNode, websiteNode } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata = {
  title: "Latest Posts",
  description: "Every story published by More News, newest first.",
  alternates: { canonical: "/latest-posts" },
};

export default function LatestPosts() {
  const url = absoluteUrl("/latest-posts");
  return (
    <main className="category-page">
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [publisherNode(), websiteNode(), breadcrumbNode([{ name: "Home", url: "/" }, { name: "Latest Posts", url: "/latest-posts" }], url)] }} />
      <h1>Latest Posts</h1>
      <div className="category-grid">
        {articles.map((item, index) => (
          <Card key={item.slug} item={item} href={articlePath(item)} label={getCategoryBySlug(item.category)?.name} />
        ))}
      </div>
    </main>
  );
}
