import Card from "@/components/Card";
import { searchSite } from "@/lib/search";

export const metadata = { title: "Search", robots: { index: false, follow: true } };

// Searches run on the server so the full article dataset never ships to the browser.
export default function SearchPage({ searchParams }) {
  const raw = searchParams?.query;
  const query = (Array.isArray(raw) ? raw[0] : raw) || "";
  const results = searchSite(query);
  const sections = [
    ["Articles", results.articles],
    ["People", results.people],
    ["Companies", results.companies],
    ["Profiles", results.profiles],
    ["Authors", results.authors],
    ["Pages", results.pages],
  ];

  return (
    <main className="search-page">
      <p className="label">Search</p>
      <h1>{query ? `Results for "${query}"` : "Search More News"}</h1>
      <p>
        {query
          ? `${results.total} result${results.total === 1 ? "" : "s"} found.`
          : "Use the header search to find articles, people, companies, authors and policy pages."}
      </p>
      {sections.map(([label, items]) =>
        items.length ? (
          <section key={label}>
            <h2 className="mt-10 font-serif text-3xl font-black">{label}</h2>
            <div className="search-grid">
              {items.map((item) => (
                <Card key={`${label}-${item.slug}`} item={item} href={item.url} label={item.label || label} />
              ))}
            </div>
          </section>
        ) : null,
      )}
      {query && results.total === 0 ? <p className="mt-8">No results found.</p> : null}
    </main>
  );
}
