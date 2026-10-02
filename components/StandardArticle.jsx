import Link from "next/link";
import SocialIcons from "@/components/SocialIcons";
import NewsBlock from "@/components/NewsBlock";
import { ShareMenu } from "@/components/ShareLinks";
import {
  formatArticleDate,
  getAuthorBySlug,
  getCategoryBySlug,
  getSuggestedArticles,
} from "@/lib/news";
import { articlePath, authorPath, categoryPath } from "@/lib/routes";

/** Group consecutive text blocks together; images break the text into separate writer blocks. */
function segments(blocks) {
  const out = [];
  for (const block of blocks) {
    if (block.type === "image") {
      out.push({ type: "image", block });
    } else {
      const last = out[out.length - 1];
      if (last && last.type === "text") last.blocks.push(block);
      else out.push({ type: "text", blocks: [block] });
    }
  }
  return out;
}

export default function StandardArticle({ article }) {
  const author = getAuthorBySlug(article.authorSlug);
  const category = getCategoryBySlug(article.category);
  const suggested = getSuggestedArticles(article, 3);
  const { summary, blocks } = article.body;
  const parts = segments(blocks);
  // The "In Brief" summary + share menu open the first text block.
  const firstTextIndex = parts.findIndex((part) => part.type === "text");

  return (
    <main className="standard-article">
      <div className="article-header">
        <h1 className="article-headline">{article.title}</h1>
        <div className="article-breadcrumb">
          <Link href="/" className="crumb-link">Home</Link> ›{" "}
          <Link href={categoryPath(article.category)} title={category?.name} className="crumb-link">{category?.name || article.category}</Link>{" "}
          › <span className="crumb-current">{article.title}</span>
        </div>
        <SocialIcons />
        <div className="writer-block">
          <div className="author-info">
            <div className="writer-info-row">
              {author && <img src={author.image} alt={author.name} className="writer-avatar" />}
              <div className="writer-details-box">
                <p className="writer-credit">
                  By{" "}
                  {author ? (
                    <Link href={authorPath(author)} title={author.name} className="writer-anchor">{author.name}</Link>
                  ) : (
                    "More News"
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="writer-date" itemProp="datePublished" content={article.publishedAt.slice(0, 10)}>
            <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
            {article.readingTime && <span className="reading-time">{article.readingTime}</span>}
          </div>
        </div>
      </div>

      <div className="image-wrapper">
        <img src={article.image} alt={article.imageAlt || article.title} width="1200" height="750" fetchPriority="high" />
      </div>

      {parts.length === 0 && (
        <div className="writer-block">
          <div className="story-text-wrap">
            <ShareMenu title={article.title} />
            {summary ? (
              <div className="aio-box"><h2>{summary.heading}</h2><p>{summary.text}</p></div>
            ) : null}
            <p>{article.excerpt}</p>
          </div>
        </div>
      )}

      {parts.map((part, index) =>
        part.type === "image" ? (
          <div className="image-wrapper" key={index}>
            <img src={part.block.src} alt={part.block.alt} loading="lazy" />
          </div>
        ) : (
          <div className="writer-block" key={index}>
            <div className="story-text-wrap">
              {index === firstTextIndex && <ShareMenu title={article.title} />}
              {index === firstTextIndex && summary ? (
                <div className="aio-box"><h2>{summary.heading}</h2><p>{summary.text}</p></div>
              ) : null}
              {part.blocks.map((block, i) => <NewsBlock key={i} block={block} />)}
            </div>
          </div>
        ),
      )}

      {suggested.length > 0 && (
        <div className="writer-block">
          <div className="suggested-box">
            <h3 className="suggested-heading">{category?.name || "More from More News"}</h3>
            {suggested.map((item) => (
              <div className="suggested-item" key={item.slug}>
                <img loading="lazy" src={item.image} alt={item.imageAlt || item.title} className="suggested-thumb" />
                <div className="suggested-text">
                  <Link href={articlePath(item)} title={item.title} className="suggested-title">{item.title}</Link>
                  <span className="suggested-date">{formatArticleDate(item.publishedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
