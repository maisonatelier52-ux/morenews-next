import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import {
  hero, sideFeature, rail, heroSmall, storyDuo, storyFeature, storyCategory, storyCategorySide,
  sideCards, insightBoard, journal, strip, heroExtra, primaryExtra, moreSections, sideExtra,
  heroRelated, featureRelated, categoryRelated,
} from "@/lib/homeData";
import { breadcrumbNode, publisherNode, websiteNode } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: { absolute: "More News - UK Politics, Business, Tech & World" },
  alternates: { canonical: "/" },
};

const authorLabel = (item) => item.author;

export default function HomePage() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      publisherNode(),
      websiteNode(),
      breadcrumbNode([{ name: "Home", url: "/" }], siteConfig.url),
      {
        "@type": "CollectionPage",
        "@id": `${siteConfig.url}/#webpage`,
        url: siteConfig.url,
        name: "More News",
        description: siteConfig.description,
        isPartOf: { "@id": websiteNode()["@id"] },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: [hero, ...rail, ...storyDuo].filter(Boolean).map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${siteConfig.url}${item.href}`,
            name: item.title,
          })),
        },
      },
    ],
  };

  return (
    <main className="home-page">
      <JsonLd data={graph} />

      <section className="headline-rail">
        <div className="rail-inner">
          {rail.map((item) => (
            <article className="rail-item" key={item.slug}>
              <Link className="thumb-wrap" href={item.href}>
                <img src={item.image} alt={item.imageAlt} width="120" height="80" loading="lazy" />
              </Link>
              <div className="rail-content">
                <h2 className="rail-title"><Link href={item.href}>{item.title}</Link></h2>
                <p className="rail-excerpt">{item.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {hero && (
        <section className="news-feature">
          <div className="news-container">
            <div className="news-left">
              <div className="news-eyebrow">In focus · {hero.category}</div>
              <h2 className="news-title"><Link href={hero.href}>{hero.title}</Link></h2>
              <div className="news-meta">
                <span className="category">{hero.category.toUpperCase()}</span>
                <span className="author">{authorLabel(hero)}</span>
              </div>
              <p className="news-excerpt">{hero.excerpt}</p>
              {heroRelated.length > 0 && (
                <ul className="related-list" aria-label="More stories">
                  {heroRelated.map((item) => (
                    <li key={item.slug}>
                      <span className="news-eyebrow">{item.category}</span>
                      <Link href={item.href}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="news-image">
              <Link href={hero.href} tabIndex={-1} aria-hidden="true"><img src={hero.image} alt={hero.imageAlt} width="800" height="500" decoding="async" fetchPriority="high" /></Link>
            </div>
            <div className="news-right">
              <div className="news-top">
                {heroSmall.map((item) => (
                  <div className="news-small" key={item.slug}>
                    <Link className="link1" href={item.href}>{item.title}</Link>
                    <p>{item.excerpt}</p>
                  </div>
                ))}
              </div>
              {heroExtra.map((item) => <article className="news-bottom" key={item.slug}><span className="news-eyebrow">{item.category}</span><h3><Link href={item.href}>{item.title}</Link></h3><p>{item.excerpt}</p></article>)}
            </div>
          </div>
        </section>
      )}

      <section className="story-wrapper" aria-labelledby="politics-heading">
        <div className="section-heading"><h2 id="politics-heading">Politics & public affairs</h2><Link href="/politics">All politics <span aria-hidden="true">→</span></Link></div>
        <div className="story-grid">
          <div className="primary-feed">
            <div className="headline-duo">
              {storyDuo.map((item) => (
                <article className="headline-card" key={item.slug}>
                  <Link className="headline-title" href={item.href}>{item.title}</Link>
                  <p className="headline-summary">{item.excerpt}</p>
                </article>
              ))}
            </div>

            {storyFeature && (
              <div className="feature-block">
                <div className="feature-text">
                  <Link className="feature-title" href={storyFeature.href}>{storyFeature.title}</Link>
                  <div className="meta-line">
                    <span className="topic-tag">{storyFeature.category}</span>
                    <span className="byline">{storyFeature.author}</span>
                  </div>
                  <div className="dis-flex">
                    <p className="feature-summary">{storyFeature.excerpt}</p>
                  </div>
                  {featureRelated.length > 0 && (
                    <ul className="related-list" aria-label="Related coverage">
                      {featureRelated.map((item) => (
                        <li key={item.slug}>
                          <span className="news-eyebrow">{item.category}</span>
                          <Link href={item.href}>{item.title}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="feature-media">
                  <img src={storyFeature.image} alt={storyFeature.imageAlt} width="640" height="420" loading="lazy" />
                </div>
              </div>
            )}
            <div className="home-latest-list">
              {primaryExtra.map((item) => <article className="home-latest-story" key={item.slug}><div><span className="news-eyebrow">{item.category}</span><h3><Link href={item.href}>{item.title}</Link></h3><p>{item.excerpt}</p></div><Link href={item.href} tabIndex={-1} aria-hidden="true"><img src={item.image} alt="" width="220" height="140" loading="lazy" /></Link></article>)}
            </div>

            {storyCategory && (
              <section className="category-block">
                <div className="category-grid">
                  <div className="category-left">
                    <div className="story-info">
                      <Link className="story-title" href={storyCategory.href}>{storyCategory.title}</Link>
                      <div className="story-meta">
                        <span className="story-tag">{storyCategory.category}</span>
                        <span className="story-author">{storyCategory.author}</span>
                      </div>
                      <p className="story-excerpt">{storyCategory.excerpt}</p>
                    </div>
                    {categoryRelated.length > 0 && (
                      <ul className="related-list related-list--row" aria-label="More politics">
                        {categoryRelated.map((item) => (
                          <li key={item.slug}>
                            <span className="news-eyebrow">{item.category}</span>
                            <Link href={item.href}>{item.title}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {storyCategorySide && (
                    <div className="category-right">
                      <Link className="side-title2" href={storyCategorySide.href}>{storyCategorySide.title}</Link>
                      <p className="side-excerpt">{storyCategorySide.excerpt}</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          <aside className="side-feed">
            {sideCards.map((item) => (
              <div className="side-card image-inline" key={item.slug}>
                <div>
                  <p className="side-tag">{item.category}</p>
                  <h3 className="side-title"><Link href={item.href}>{item.title}</Link></h3>
                  <span className="side-author">{item.author}</span>
                </div>
                <img src={item.image} alt={item.imageAlt} width="75" height="75" loading="lazy" />
              </div>
            ))}
            {sideFeature && (
              <>
                <div>
                  <img className="image-sect" src={sideFeature.image} alt={sideFeature.imageAlt} width="360" height="240" loading="lazy" />
                </div>
                <section className="crisis-wrap">
                  <div className="crisis-container">
                    <Link className="crisis-title" href={sideFeature.href}>{sideFeature.title}</Link>
                    <p className="crisis-summary">{sideFeature.excerpt}</p>
                  </div>
                </section>
              </>
            )}
            {sideExtra.map((item) => <article className="side-card image-inline" key={item.slug}><div><p className="side-tag">{item.category}</p><h3 className="side-title"><Link href={item.href}>{item.title}</Link></h3><span className="side-author">{item.author}</span></div><img src={item.image} alt={item.imageAlt} width="75" height="75" loading="lazy" /></article>)}
          </aside>
        </div>
      </section>

      <section className="insight-board">
        <div className="section-heading"><h2>Science, health & technology</h2><Link href="/tech">All tech <span aria-hidden="true">→</span></Link></div>
        <div className="insight-row">
          {insightBoard.map((item) => (
            <div className="insight-item" key={item.slug}>
              <div><Link className="insight-title" href={item.href}>{item.title}</Link><p className="insight-desc">{item.excerpt}</p></div>
              <div><img className="insight-thumb" src={item.image} alt={item.imageAlt} width="180" height="120" loading="lazy" /></div>
            </div>
          ))}
        </div>
      </section>

      <section className="journal-wrapper">
        <div className="section-heading"><h2>World briefing</h2><Link href="/world">All world news <span aria-hidden="true">→</span></Link></div>
        <div className="feature-grid">
          {journal.map((item) => (
            <article className="story-block" key={item.slug}>
              <div className="story-visual">
                <img src={item.image} alt={item.imageAlt} width="240" height="160" loading="lazy" />
              </div>
              <h4 className="story-heading"><Link href={item.href}>{item.title}</Link></h4>
              <p className="story-excerpt">{item.excerpt}</p>
              <hr className="story-divider" />
            </article>
          ))}
        </div>
      </section>

      <section className="newsFlexWrap">
        <div className="section-heading strip-heading"><h2>Sport & investigations</h2><Link href="/latest-posts">Latest news <span aria-hidden="true">→</span></Link></div>
        {strip.map((item) => (
          <div className="newsColumnBox" key={item.slug}>
            <div className="newsImageBox">
              <img src={item.image} alt={item.imageAlt} width="240" height="160" loading="lazy" />
            </div>
            <div className="categoryLabel">{item.category}</div>
            <Link className="headlineAnchor" href={item.href}>{item.title}</Link>
          </div>
        ))}
      </section>
      {moreSections.map((section) => <section className="home-desk-section" key={section.slug}>
        <div className="section-heading"><h2>{section.name}</h2><Link href={`/${section.slug}`}>All {section.name.toLowerCase()} <span aria-hidden="true">→</span></Link></div>
        <div className="home-desk-grid">{section.items.map((item) => <article key={item.slug}><Link href={item.href}><img src={item.image} alt={item.imageAlt} width="500" height="300" loading="lazy" /></Link><h3><Link href={item.href}>{item.title}</Link></h3><p>{item.excerpt}</p><time dateTime={item.publishedAt}>{item.date}</time></article>)}</div>
      </section>)}
    </main>
  );
}
