/** Content blocks restored from the supplied HTML, with scripts removed at import. */
export default function NewsBlock({ block }) {
  if (block.type === "paragraph") return <p dangerouslySetInnerHTML={{ __html: block.html }} />;
  if (block.type === "heading") {
    const Tag = block.level === 3 ? "h3" : block.level === 4 ? "h4" : "h2";
    return <Tag>{block.text}</Tag>;
  }
  if (block.type === "divider") return <hr />;
  if (block.type === "quote") return <blockquote dangerouslySetInnerHTML={{ __html: block.html }} />;
  if (block.type === "list") {
    const Tag = block.ordered ? "ol" : "ul";
    return <Tag>{block.items.map((item, index) => <li key={index} dangerouslySetInnerHTML={{ __html: item }} />)}</Tag>;
  }
  if (block.type === "html") return <div className="article-content-block" dangerouslySetInnerHTML={{ __html: block.html }} />;
  return null;
}
