import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbNode, publisherNode, websiteNode } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export default function EntityDirectory({ title, intro, items, basePath, label }) {
  const url = absoluteUrl(basePath);
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      publisherNode(),
      websiteNode(),
      breadcrumbNode([{ name: "Home", url: "/" }, { name: title, url: basePath }], url),
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description: intro,
        isPartOf: { "@id": websiteNode()["@id"] },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(`${basePath}/${item.slug}`),
            name: item.name,
          })),
        },
      },
    ],
  };

  return (
    <main className="directory-page">
      <JsonLd data={graph} />
      <h1>{title}</h1>
      <p style={{ marginTop: 14, color: "#555", maxWidth: 720, lineHeight: 1.6 }}>{intro}</p>
      <div className="directory-grid">
        {items.map((item) => (
          <Link key={item.slug} className="mn-card" href={`${basePath}/${item.slug}`}>
            {item.heroImage || item.image ? <img src={item.heroImage || item.image} alt={item.heroImageAlt || item.name} loading="lazy" /> : null}
            <div className="label">{label}</div>
            <h2>{item.name}</h2>
            <p>{item.tagline || item.metaDescription}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
