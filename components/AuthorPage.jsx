import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbNode, orgId, publisherNode, websiteNode } from "@/lib/seo";
import { articlePath } from "@/lib/routes";
import { getArticlesByAuthor, getCategoryBySlug } from "@/lib/news";
import { absoluteUrl } from "@/lib/site";
import { authorPath } from "@/lib/routes";
import BrandIcon from "@/components/BrandIcon";
import SocialIcons from "@/components/SocialIcons";
import Pagination from "@/components/Pagination";
import { AUTHOR_PAGE_SIZE, authorPagePath, paginate } from "@/lib/pagination";

const hidden = { position: "absolute", width: 1, height: 1, margin: -1, padding: 0, border: 0, overflow: "hidden" };

function SocialLink({ name, href }) {
  const key = name.toLowerCase();
  const inner = <BrandIcon name={key} />;
  return { inner, key, href, name };
}

export function authorGraph(author, articles, page = 1) {
  const url = absoluteUrl(authorPagePath(author.slug, page));
  const personUrl = absoluteUrl(authorPath(author));
  return {
    "@context": "https://schema.org",
    "@graph": [
      publisherNode(),
      websiteNode(),
      breadcrumbNode(
        [{ name: "Home", url: "/" }, { name: "Authors", url: "/author" }, { name: author.name, url: authorPath(author) }],
        url,
      ),
      {
        "@type": "ProfilePage",
        "@id": `${url}#webpage`,
        url,
        name: author.metaTitle,
        description: author.metaDescription,
        isPartOf: { "@id": websiteNode()["@id"] },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: { "@id": `${personUrl}#author` },
      },
      {
        "@type": "Person",
        "@id": `${personUrl}#author`,
        name: author.name,
        url: personUrl,
        image: absoluteUrl(author.image),
        jobTitle: author.role,
        description: author.bio,
        worksFor: { "@id": orgId },
        sameAs: Object.values(author.social || {}).filter((href) => /^https?:/.test(href)),
        knowsAbout: [...new Set(articles.map((article) => getCategoryBySlug(article.category)?.name).filter(Boolean))],
      },
    ],
  };
}

export default function AuthorPage({ author, page = 1 }) {
  const allStories = getArticlesByAuthor(author.slug);
  const { items: stories, pageCount, start, end } = paginate(allStories, page, AUTHOR_PAGE_SIZE);
  const socials = Object.entries(author.social || {}).map(([name, href]) => SocialLink({ name, href }));

  return (
    <main className="author-news-page">
      <JsonLd data={authorGraph(author, allStories, page)} />
      <section className="headline-rail" />
      <section className="bio-panel">
        <div className="bio-container">
          <div className="bio-photo">
            <img src={author.image} alt={author.name} />
          </div>
          <div className="bio-details">
            <h1 className="bio-name">{author.name}</h1>
            <p className="bio-text">{author.bio}</p>
          </div>
          {socials.length > 0 && (
            <div className="share-icons social-icon-row">
              {socials.map((item) => (
                <a key={item.key} href={item.href} title={item.key} aria-label={`${author.name} on ${item.name}`} className="share-btn" target="_blank" rel="noopener noreferrer me">{item.inner}</a>
              ))}
            </div>
          )}
        </div>
      </section>
      {author.seoHeading && <h2 style={hidden}>{author.seoHeading}</h2>}
      {author.seoTopic && <h3 style={hidden}>{author.seoTopic}</h3>}
      <div className="news-flexzone">
        <div className="news-listcol">
          {stories.length === 0 && <p style={{ padding: 20 }}>No stories published yet.</p>}
          {stories.map((article) => (
            <div className="news-blockitem" key={article.slug}>
              <div className="news-textpart">
                <Link href={articlePath(article)} title={article.title} className="title-link">{article.title}</Link>
                <p>{article.excerpt}</p>
              </div>
              <div className="news-imgpart">
                <img loading="lazy" src={article.image} alt={article.imageAlt || article.title} />
              </div>
            </div>
          ))}
        </div>
        <div className="side-railbox">
          <div className="side-socialpanel">
            <h4>Follow Us</h4>
            <SocialIcons />
          </div>
        </div>
      </div>
      <Pagination page={page} pageCount={pageCount} start={start} end={end} total={allStories.length} pagePath={(number) => authorPagePath(author.slug, number)} label={`${author.name} article pages`} />
    </main>
  );
}
