import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SocialIcons from "@/components/SocialIcons";
import Pagination from "@/components/Pagination";
import { articles, formatArticleDate, getArticlesByCategory, getAuthorBySlug, newsCategories } from "@/lib/news";
import { articlePath, authorPath, categoryPath } from "@/lib/routes";
import { categoryPagePath, paginateCategory } from "@/lib/pagination";
import { breadcrumbNode, publisherNode, websiteNode } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

function Byline({ article }) {
  const author = getAuthorBySlug(article.authorSlug);
  return <div className="category-byline">{author && <Link href={authorPath(author)}>{author.name}</Link>}<time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time></div>;
}

export default function CategoryPage({ category, page = 1 }) {
  const allItems = getArticlesByCategory(category.slug);
  const { items, pageCount, start, end } = paginateCategory(allItems, page);
  const [lead, ...rest] = items;
  const sideStories = rest.slice(0, 4);
  const latest = rest.slice(4);
  const elsewhere = articles.filter((item) => item.category !== category.slug && item.articleType !== "client").slice(0, 4);
  const url = absoluteUrl(categoryPagePath(category.slug, page));
  const graph = {
    "@context": "https://schema.org",
    "@graph": [publisherNode(), websiteNode(), breadcrumbNode([{ name: "Home", url: "/" }, { name: category.name, url: categoryPath(category) }], url), {
      "@type": "CollectionPage", "@id": `${url}#webpage`, url, name: category.name, description: category.description,
      isPartOf: { "@id": websiteNode()["@id"] },
      mainEntity: { "@type": "ItemList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: start + index, url: absoluteUrl(articlePath(item)), name: item.title })) },
    }],
  };
  return (
    <main className="news-category-page">
      <JsonLd data={graph} />
      <div className="world-header-shell">
        <div className="category-kicker"><Link href="/">Home</Link><span>{category.name}</span></div>
        <h1 className="world-headline-text">{category.name}</h1>
        <p className="category-description">{category.description}</p>
        <nav className="world-category-strip" aria-label="News categories">
          {newsCategories.map((item) => <Link key={item.slug} className="world-category-item" href={categoryPath(item)} aria-current={item.slug === category.slug ? "page" : undefined}>{item.name}</Link>)}
        </nav>
      </div>
      {lead && <section className="news-wrapper-unique" aria-label={`${category.name} headlines`}>
        <div className="news-grid-unique">
          <article className="main-article-unique">
            <Link href={articlePath(lead)}><img src={lead.image} alt={lead.imageAlt || lead.title} width="900" height="560" fetchPriority="high" /></Link>
            <div className="main-sec">
              <span className="news-eyebrow">{category.name}</span>
              <h2><Link href={articlePath(lead)}>{lead.title}</Link></h2>
              <p>{lead.excerpt}</p>
              <Byline article={lead} />
            </div>
          </article>
          <div className="side-articles-unique">
            {sideStories.map((item) => <article className="side-article-unique" key={item.slug}>
              <div className="side-article-text"><h3><Link href={articlePath(item)}>{item.title}</Link></h3><p>{item.excerpt}</p><Byline article={item} /></div>
              <Link href={articlePath(item)} tabIndex={-1} aria-hidden="true"><img src={item.image} alt="" width="160" height="120" loading="lazy" /></Link>
            </article>)}
          </div>
        </div>
      </section>}
      {latest.length > 0 && <section className="category-latest" aria-labelledby="latest-heading">
        <div className="headline-tabwrap"><h2 className="headline-tab" id="latest-heading">More {category.name} news</h2></div>
        <div className="news-flexzone">
          <div className="news-listcol">
            {latest.map((item) => <article className="news-blockitem" key={item.slug}>
              <div className="news-textpart"><h3><Link href={articlePath(item)}>{item.title}</Link></h3><p>{item.excerpt}</p><Byline article={item} /></div>
              <Link className="news-imgpart" href={articlePath(item)} tabIndex={-1} aria-hidden="true"><img src={item.image} alt="" width="320" height="200" loading="lazy" /></Link>
            </article>)}
          </div>
          <aside className="category-side-rail"><h2>Across More News</h2>
            {elsewhere.map((item) => <article key={item.slug}><span className="news-eyebrow">{newsCategories.find((c) => c.slug === item.category)?.name}</span><h3><Link href={articlePath(item)}>{item.title}</Link></h3></article>)}
            <div className="side-socialpanel"><h4>Follow More News</h4><SocialIcons /></div>
          </aside>
        </div>
      </section>}
      <Pagination page={page} pageCount={pageCount} start={start} end={end} total={allItems.length} pagePath={(number) => categoryPagePath(category.slug, number)} label={`${category.name} news pages`} />
    </main>
  );
}
