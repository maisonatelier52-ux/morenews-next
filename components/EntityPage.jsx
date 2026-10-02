import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import BrandIcon from "@/components/BrandIcon";
import { entityGraph } from "@/lib/seo";
import { resolveArticleHref } from "@/lib/entities";
import { getCategoryBySlug } from "@/lib/news";

const html = (value) => ({ __html: value });

const sectionHeading = "font-serif font-bold text-2xl text-ink mb-4";
const asideHeading = "font-sans text-xs font-bold uppercase tracking-widest text-muted";

function EntityIcon({ icon }) {
  const brand = icon?.match(/fa-(instagram|x-twitter|linkedin|facebook|quora|flipboard|medium|substack)/)?.[1];
  return brand ? <span className="inline-flex w-5 justify-center"><BrandIcon name={brand === "x-twitter" ? "x" : brand} size={16} /></span> : <i className={`${icon} w-5 text-center`} aria-hidden="true" />;
}

function SmartLink({ href, external, className, children }) {
  if (external || /^https?:\/\//.test(href)) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}

/** Coverage cards pull their title/excerpt/category live from news.json when the link is an article. */
function liveCard(item) {
  const article = resolveArticleHref(item.href);
  if (!article) return item;
  return {
    ...item,
    tag: getCategoryBySlug(article.category)?.name || item.tag,
    title: article.title,
    excerpt: article.excerpt,
  };
}

function Section({ section }) {
  if (section.type === "paragraphs") {
    return (
      <section>
        <h2 className={sectionHeading}>{section.heading}</h2>
        <div className="font-sans text-[16px] leading-relaxed text-ink/85 space-y-4">
          {section.items.map((paragraph, i) => <p key={i} dangerouslySetInnerHTML={html(paragraph)} />)}
        </div>
      </section>
    );
  }
  if (section.type === "bullets") {
    return (
      <section>
        <h2 className={sectionHeading}>{section.heading}</h2>
        <ul className="space-y-4 font-sans text-[15px] text-ink/85">
          {section.items.map((item, i) => (
            <li className="flex gap-3" key={i}>
              <span className="flex-none w-2 h-2 mt-2 rounded-full bg-accent" />
              <div dangerouslySetInnerHTML={html(item)} />
            </li>
          ))}
        </ul>
      </section>
    );
  }
  if (section.type === "coverage" && section.variant === "link") {
    return (
      <section>
        <h2 className={sectionHeading}>{section.heading}</h2>
        {section.items.map(liveCard).map((item) => (
          <Link key={item.href} className="block border border-hairline rounded-lg p-5 hover:shadow-md transition-shadow" href={item.href}>
            <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-accent">{item.tag}</span>
            <h3 className="font-serif font-bold text-lg text-ink mt-1 mb-2">{item.title}</h3>
            <p className="font-sans text-sm text-ink/70">{item.excerpt}</p>
          </Link>
        ))}
      </section>
    );
  }
  if (section.type === "coverage") {
    return (
      <section>
        <h2 className={sectionHeading}>{section.heading}</h2>
        <div className="space-y-4">
          {section.items.map(liveCard).map((item) => (
            <article key={item.href} className="border border-hairline rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <Link className="block p-5" href={item.href}>
                <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-accent">{item.tag}</span>
                <h3 className="font-serif font-bold text-lg text-ink mt-1 mb-2 hover:text-accent">{item.title}</h3>
                <p className="font-sans text-sm text-ink/70 leading-relaxed">{item.excerpt}</p>
              </Link>
            </article>
          ))}
        </div>
      </section>
    );
  }
  if (section.type === "cards") {
    return (
      <section>
        <h2 className={sectionHeading}>{section.heading}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {section.items.map((item) => (
            <Link key={item.href} className="block border border-hairline rounded-lg p-4 hover:shadow-md transition-shadow" href={item.href}>
              <span className="text-xs font-bold uppercase tracking-widest text-accent">{item.tag}</span>
              <h3 className="font-serif font-bold text-ink mt-1">{item.title}</h3>
              <p className="text-sm text-ink/70 mt-1">{item.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    );
  }
  return null;
}

function Side({ block }) {
  if (block.type === "facts") {
    return (
      <div className="border border-hairline rounded-lg p-5 bg-neutral-50/50">
        <h3 className={`${asideHeading} mb-4`}>{block.heading}</h3>
        <dl className="space-y-3 font-sans text-sm">
          {block.items.map((item, i) => (
            <div key={i}>
              <dt className="text-muted">{item.label}</dt>
              <dd className="font-medium text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }
  if (block.type === "links") {
    const flex = block.style === "flex";
    return (
      <div className="border border-hairline rounded-lg p-5">
        <h3 className={`${asideHeading} mb-4`}>{block.heading}</h3>
        <ul className={`${block.spacing || "space-y-3"} font-sans text-sm`}>
          {block.items.map((item) => (
            <li key={item.href}>
              <SmartLink href={item.href} external={item.external} className={`${flex ? "flex items-center gap-2 " : ""}text-ink hover:text-accent`}>
                {item.icon && <EntityIcon icon={item.icon} />}
                {item.icon ? " " : ""}{item.label}
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (block.type === "themes") {
    return (
      <div className="border border-hairline rounded-lg p-5">
        <h3 className={`${asideHeading} mb-3`}>{block.heading}</h3>
        <div className="flex flex-wrap gap-2">
          {block.items.map((item) => (
            <span key={item} className="px-3 py-1 rounded-full bg-neutral-100 text-xs font-sans text-ink/80">{item}</span>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export default function EntityPage({ entity }) {
  const listing = { company: ["Company", "/company"], profile: ["Profile", "/profile"], people: ["People", "/people"] }[entity.kind];
  return (
    <main>
      <JsonLd data={entityGraph(entity)} />
      <nav aria-label="Breadcrumb" className="max-w-[1360px] mx-auto px-6 pt-8 text-sm font-sans text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link className="hover:text-accent hover:underline" href="/">Home</Link></li>
          <li className="mx-1">›</li>
          <li><span className="text-ink/70">{entity.breadcrumbLabel || listing[0]}</span></li>
          <li className="mx-1">›</li>
          <li className="text-ink font-medium">{entity.name}</li>
        </ol>
      </nav>

      <section className="profile-hero max-w-[1360px] mx-auto mt-6 mb-10 rounded-xl overflow-hidden border border-hairline">
        <div className="px-6 py-10 sm:px-10 sm:py-12 flex flex-col sm:flex-row gap-8 items-start">
          {entity.heroImage && (
            <div className="flex-none">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden bg-neutral-200 border-4 border-white shadow-md">
                <img alt={entity.heroImageAlt || entity.name} className="w-full h-full object-cover" src={entity.heroImage} />
              </div>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-sans text-[11px] font-bold uppercase tracking-widest text-accent mb-2">{entity.kicker}</p>
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-ink leading-tight mb-2">{entity.heading}</h1>
            <p className="font-sans text-lg text-ink/80 mb-1">{entity.jobTitle}</p>
            <p className="font-sans text-sm text-muted mb-6">{entity.tagline}</p>
            <div className="flex flex-wrap gap-3">
              {entity.links.map((link) => (
                <SmartLink
                  key={link.href}
                  href={link.href}
                  external={link.external}
                  className="profile-link inline-flex items-center gap-2 px-4 py-2 rounded-full border border-hairline bg-white text-sm font-sans text-ink"
                >
                  {link.icon && <EntityIcon icon={link.icon} />} {link.label}
                </SmartLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1360px] mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {entity.sections.map((section, i) => <Section key={i} section={section} />)}
        </div>
        <aside className="space-y-8">
          {entity.sidebar.map((block, i) => <Side key={i} block={block} />)}
        </aside>
      </div>
    </main>
  );
}
