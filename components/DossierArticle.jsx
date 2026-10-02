import Link from "next/link";
import { Fragment } from "react";
import { ShareIcons } from "@/components/ShareLinks";
import { formatArticleDate, getAuthorBySlug, getCategoryBySlug } from "@/lib/news";
import { authorPath } from "@/lib/routes";

const html = (value) => ({ __html: value });

function Body({ block }) {
  switch (block.type) {
    case "paragraph":
      return <p dangerouslySetInnerHTML={html(block.html)} />;
    case "pullquote":
      return <p className="dossier-pullquote" dangerouslySetInnerHTML={html(block.html)} />;
    case "heading":
      return <h2 className="dossier-section-heading">{block.text}</h2>;
    case "stats":
      return (
        <ul>
          {block.items.map((item, i) => (
            <li key={i} style={item.accent === "seal" ? { borderLeftColor: "var(--seal)" } : undefined}>
              <strong>{item.value}</strong> <span>{item.label}</span>
            </li>
          ))}
        </ul>
      );
    case "timeline":
      return (
        <ul className="dossier-timeline">
          {block.items.map((item, i) => (
            <li key={i}>
              <span className="dossier-timeline-date">{item.date}</span>
              <span dangerouslySetInnerHTML={html(item.text)} />
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <table className="dossier-status-table">
          <thead>
            <tr>{block.head.map((cell, i) => <th key={i}>{cell}</th>)}</tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i}>
                <td dangerouslySetInnerHTML={html(row.claim)} />
                <td className={`status-${row.tone}`} dangerouslySetInnerHTML={html(row.status)} />
              </tr>
            ))}
          </tbody>
        </table>
      );
    case "faq":
      return (
        <div className="dossier-faq">
          {block.items.map((item, i) => (
            <details className="dossier-faq-item" key={i} open={item.open || undefined}>
              <summary className="dossier-faq-question">
                <span><span className="dossier-faq-num">Q{i + 1}</span>{item.question}</span>
                <span className="dossier-faq-icon"><i className="fa-solid fa-plus" /></span>
              </summary>
              <div className="dossier-faq-answer" dangerouslySetInnerHTML={html(item.answer)} />
            </details>
          ))}
        </div>
      );
    default:
      return null;
  }
}

function Side({ block, title }) {
  return (
    <div className="dossier-side-block">
      <h3 className="dossier-side-heading">{block.heading}</h3>
      {block.type === "facts" && (
        <ul className="dossier-facts-list">
          {block.items.map((item, i) => (
            <li key={i}>
              <span className="dossier-fact-label">{item.label}</span>
              <span className="dossier-fact-value">{item.value}</span>
            </li>
          ))}
        </ul>
      )}
      {block.type === "related" && (
        <ul className="dossier-related-list">
          {block.items.map((item, i) => (
            <li key={i}>
              {item.external ? (
                <a href={item.href} target="_blank" rel="noopener">
                  <span className="dossier-related-tag">{item.tag}</span>
                  {item.label}
                </a>
              ) : (
                <Link href={item.href}>
                  <span className="dossier-related-tag">{item.tag}</span>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
      {block.type === "text" && <p>{block.text}</p>}
      {block.type === "share" && <ShareIcons title={title} networks={block.networks} />}
    </div>
  );
}

export default function DossierArticle({ article }) {
  const d = article.dossier;
  const author = getAuthorBySlug(article.authorSlug);
  const category = getCategoryBySlug(article.category);
  const date = formatArticleDate(article.publishedAt);

  return (
    <main>
      <article className={`dossier${d.linkedBody ? " dossier--linked" : ""}`}>
        <div className="dossier-band">
          <div className="dossier-band-inner">
            <span className="dossier-eyebrow">{category?.name || d.eyebrow}</span>
            <span className="dossier-date">{date}</span>
          </div>
        </div>
        <div className="dossier-container">
          <div className="dossier-tags">
            {d.tags.category.map((tag) => <span className="dossier-tag-category" key={tag}>{tag}</span>)}
            {d.tags.key.map((tag) => <span className="dossier-tag-key" key={tag}>{tag}</span>)}
          </div>
          <h1 className="dossier-headline">{article.title}</h1>
          <p className="dossier-standfirst">{d.standfirst}</p>
          <div className="dossier-author">
            {author && <img src={author.image} alt={author.name} className="dossier-author-avatar" />}
            <div className="dossier-author-details">
              <p className="dossier-author-name">
                By{" "}
                {author ? (
                  <Link href={authorPath(author)} title={author.name} className="dossier-author-link">{author.name}</Link>
                ) : (
                  "More News"
                )}
              </p>
              <p className="dossier-author-date">Published {date}</p>
            </div>
          </div>
          <figure className="dossier-hero">
            <div className="dossier-hero-frame">
              <img src={article.image} alt={article.imageAlt || article.title} width="1200" height="630" fetchPriority="high" />
            </div>
            {d.heroCaption && <figcaption>{d.heroCaption}</figcaption>}
          </figure>
          <div className="dossier-layout">
            <div className="dossier-main">
              {d.chart && (
                <div className="dossier-chart" aria-label={d.chartLabel} data-label={d.chartLabel}>
                  {d.chart.map((card, i) => (
                    <Fragment key={i}>
                      {i > 0 && <div className="dossier-chart-connector" />}
                      <div className={`dossier-chart-card${card.chair ? " dossier-chart-card--chair" : ""}`} data-badge={card.chair ? d.chartBadge : undefined} tabIndex={0}>
                        <span className="dossier-chart-role">{card.role}</span>
                        <span className="dossier-chart-name" dangerouslySetInnerHTML={html(card.nameHtml)} />
                        <span className="dossier-chart-title" dangerouslySetInnerHTML={html(card.titleHtml)} />
                      </div>
                    </Fragment>
                  ))}
                </div>
              )}
              <div className="dossier-body">
                {article.body.blocks.map((block, i) => <Body key={i} block={block} />)}
              </div>
              {d.closing?.length > 0 && (
                <div className="dossier-closing">
                  {d.closing.map((paragraph, i) => <p key={i} dangerouslySetInnerHTML={html(paragraph)} />)}
                </div>
              )}
              {d.sources?.length > 0 && (
                <div className="dossier-sources">
                  <h2 className="dossier-sources-heading">Consolidated Source List</h2>
                  <ol className="dossier-sources-list">
                    {d.sources.map((source, i) => (
                      <li key={i}>
                        <span className="dossier-source-num">{String(i + 1).padStart(2, "0")}</span>
                        {source.url ? (
                          <a href={source.url} target="_blank" rel="noopener">{source.name}</a>
                        ) : (
                          <span style={{ color: "var(--ink-soft)" }}>{source.name}</span>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
            <aside className="dossier-sidebar">
              {d.sidebar.map((block, i) => <Side key={i} block={block} title={article.title} />)}
            </aside>
          </div>
        </div>
      </article>
    </main>
  );
}
