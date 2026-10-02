import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { authors } from "@/lib/news";
import { breadcrumbNode, publisherNode, websiteNode } from "@/lib/seo";
import { authorPath } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

export const metadata = {
  title: "Authors",
  description: "Meet the More News journalists covering UK politics, business, technology, world affairs, health and sport.",
  alternates: { canonical: "/author" },
};

export default function AuthorsPage() {
  const list = authors.filter((author) => !author.desk);
  const url = absoluteUrl("/author");
  return (
    <main className="directory-page">
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [publisherNode(), websiteNode(), breadcrumbNode([{ name: "Home", url: "/" }, { name: "Authors", url: "/author" }], url)] }} />
      <h1>Authors</h1>
      <div className="directory-grid">
        {list.map((author) => (
          <Link key={author.slug} className="mn-card" href={authorPath(author)}>
            <img src={author.image} alt={author.name} loading="lazy" />
            <div className="label">{author.role}</div>
            <h2>{author.name}</h2>
            <p>{author.bio}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
