import Link from "next/link";

export default function Pagination({ page, pageCount, start, end, total, pagePath, label = "News pages" }) {
  return <div className="pagination-bar">
    <p>{total ? `Showing ${start}–${end} of ${total} stories` : "No stories yet"}</p>
    {pageCount > 1 && <nav className="pagination" aria-label={label}>
      {page > 1 && <Link href={pagePath(page - 1)} rel="prev">Previous</Link>}
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <Link key={number} href={pagePath(number)} aria-current={number === page ? "page" : undefined} aria-label={`Page ${number}`}>{number}</Link>)}
      {page < pageCount && <Link href={pagePath(page + 1)} rel="next">Next</Link>}
    </nav>}
  </div>;
}
