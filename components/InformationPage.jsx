import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import NewsBlock from "@/components/NewsBlock";
import BrandIcon from "@/components/BrandIcon";
import { pages } from "@/lib/data";
import { authors, newsCategories } from "@/lib/news";
import { breadcrumbNode, publisherNode, websiteNode } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";
import {
  aboutContent,
  categoryBlurbs,
  contactContent,
  emails,
  pageGroups,
  subsections,
  teamContent,
} from "@/lib/pageContent";

const html = (value) => ({ __html: value });
const strip = (value = "") => value.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim();
const slugify = (value) => strip(value).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const displayLabel = (label) => label.replace(/ And /g, " and ").replace(/ Of /g, " of ");

/* ------------------------------------------------------------------ */
/* Shared pieces                                                        */
/* ------------------------------------------------------------------ */

function Hero({ page, lede, updated }) {
  return (
    <section className="info-hero">
      <div className="info-wrap">
        <nav aria-label="Breadcrumb" className="info-crumbs">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{displayLabel(page.label)}</span>
        </nav>
        <h1>{displayLabel(page.label)}</h1>
        {typeof lede === "string" ? <p className="info-lede" dangerouslySetInnerHTML={html(lede)} /> : <p className="info-lede">{lede}</p>}
        {updated && <p className="info-updated">Last updated <time>{updated}</time></p>}
      </div>
    </section>
  );
}

function PageNav({ current }) {
  return (
    <nav aria-label="More News information pages" className="info-nav-lists">
      {pageGroups.map((group) => (
        <div key={group.id} className="info-nav-group">
          <h2>{group.title}</h2>
          <ul>
            {pages.filter((item) => item.group === group.id).map((item) => (
              <li key={item.slug}>
                <Link href={`/${item.slug}`} aria-current={item.slug === current ? "page" : undefined}>{displayLabel(item.label)}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function CtaBand({ title, text, actions }) {
  return (
    <section className="info-cta">
      <div className="info-wrap info-cta-inner">
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="info-cta-actions">
          {actions.map((action) => (
            <Link key={action.href} href={action.href} className={action.primary ? "info-btn info-btn--primary" : "info-btn"}>{action.label}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* About                                                                */
/* ------------------------------------------------------------------ */

function AboutPage({ page }) {
  const standards = aboutContent.standards.map((item) => ({ ...item, page: pages.find((p) => p.slug === item.slug) })).filter((item) => item.page);
  return (
    <>
      <Hero page={page} lede={aboutContent.lede} />

      <section className="info-section">
        <div className="info-wrap info-split">
          <h2 className="info-section-title">An independent newsroom for readers, not for parties or advertisers</h2>
          <div className="info-copy">
            {aboutContent.intro.map((text, i) => <p key={i}>{text}</p>)}
          </div>
        </div>
      </section>

      <section className="info-section info-section--panel">
        <div className="info-wrap">
          <h2 className="info-section-title">What we cover</h2>
          <ul className="info-desks">
            {newsCategories.map((category) => (
              <li key={category.slug}>
                <Link href={`/${category.slug}`}>
                  <strong>{category.name}</strong>
                  <span>{categoryBlurbs[category.slug] || category.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="info-section">
        <div className="info-wrap">
          <h2 className="info-section-title">How we work</h2>
          <div className="info-principles">
            {aboutContent.principles.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <Link href={item.href}>{item.cta}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="info-section info-section--panel">
        <div className="info-wrap">
          <h2 className="info-section-title">Standards you can hold us to</h2>
          <ul className="info-standards">
            {standards.map((item) => (
              <li key={item.slug}>
                <Link href={`/${item.slug}`}><strong>{displayLabel(item.page.label)}</strong><span>{item.text}</span></Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title="Meet the people behind the reporting"
        text="Every story has a named journalist and an editor accountable for it. If you have a tip, a question or a correction, we want to hear it."
        actions={[{ href: "/our-team", label: "Meet the team", primary: true }, { href: "/contact", label: "Contact the newsroom" }]}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Our team                                                             */
/* ------------------------------------------------------------------ */

function hasImage(author) {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", author.image));
  } catch {
    return false;
  }
}

function Portrait({ author, sizes }) {
  if (hasImage(author)) {
    return <Image src={author.image} alt={`${author.name}, ${author.role}`} fill sizes={sizes} className="info-portrait-img" />;
  }
  const initials = author.name.split(" ").map((part) => part[0]).slice(0, 2).join("");
  return <span className="info-portrait-fallback" role="img" aria-label={author.name}>{initials}</span>;
}

function TeamPage({ page, updated }) {
  const bySlug = (slug) => authors.find((author) => author.slug === slug);
  const leaders = teamContent.leadership.map(bySlug).filter(Boolean);
  const reporters = teamContent.reporters.map(bySlug).filter(Boolean);
  return (
    <>
      <Hero page={page} lede={teamContent.lede} updated={updated} />

      <section className="info-section">
        <div className="info-wrap">
          <p className="info-statement">{teamContent.mission}</p>
        </div>
      </section>

      <section className="info-section info-section--tight">
        <div className="info-wrap">
          <h2 className="info-section-title">Leadership</h2>
          <div className="info-leaders">
            {leaders.map((author) => (
              <article key={author.slug} className="info-leader">
                <div className="info-portrait"><Portrait author={author} sizes="(max-width: 700px) 40vw, 220px" /></div>
                <div>
                  <h3><Link href={`/author/${author.slug}`}>{author.name}</Link></h3>
                  <p className="info-role">{author.role}</p>
                  <p>{author.bio}</p>
                  <Link className="info-textlink" href={`/author/${author.slug}`}>Read {author.name.split(" ")[0]}’s articles</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="info-section info-section--panel">
        <div className="info-wrap">
          <h2 className="info-section-title">Reporting team</h2>
          <div className="info-reporters">
            {reporters.map((author) => (
              <article key={author.slug} className="info-reporter">
                <div className="info-portrait"><Portrait author={author} sizes="140px" /></div>
                <div>
                  <h3><Link href={`/author/${author.slug}`}>{author.name}</Link></h3>
                  <p className="info-role">{author.role}</p>
                  <p>{author.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="info-wrap">
          <h2 className="info-section-title">Behind every story</h2>
          <p className="info-section-intro">A wider team works across departments to keep the newsroom independent and to hold every story to the same editorial standards.</p>
          <dl className="info-deskgrid">
            {teamContent.desks.map((desk) => (
              <div key={desk.name}>
                <dt>{desk.name}</dt>
                <dd>{desk.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaBand
        title="Read the work, or contribute to it"
        text="Browse every contributor’s reporting, or send the newsroom a tip or correction."
        actions={[{ href: "/author", label: "All contributors", primary: true }, { href: "/contact", label: "Contact the newsroom" }]}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Contact                                                              */
/* ------------------------------------------------------------------ */

function ContactPage({ page, updated }) {
  const networks = [["twitter", "X (Twitter)"], ["instagram", "Instagram"], ["medium", "Medium"], ["substack", "Substack"], ["flipboard", "Flipboard"]];
  return (
    <>
      <Hero page={page} lede={contactContent.lede} updated={updated} />

      <section className="info-section">
        <div className="info-wrap">
          <div className="info-channels">
            {contactContent.channels.map((channel) => (
              <article key={channel.title} className="info-channel">
                <h2>{channel.title}</h2>
                <p>{channel.text}</p>
                <p className="info-include"><strong>Please include:</strong> {channel.include}</p>
                <div className="info-channel-actions">
                  <a className="info-btn info-btn--primary" href={`mailto:${channel.email}`}>{channel.email}</a>
                  {channel.href && <Link className="info-textlink" href={channel.href}>{channel.cta}</Link>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="info-section info-section--panel">
        <div className="info-wrap info-split">
          <div>
            <h2 className="info-section-title">Writing about a published article?</h2>
            <p className="info-section-intro">{contactContent.tipNote}</p>
          </div>
          <div>
            <h2 className="info-section-title">Follow More News</h2>
            <ul className="info-socials">
              {networks.map(([name, label]) => (
                <li key={name}>
                  <a href={siteConfig.socials[name]} target="_blank" rel="noopener noreferrer me"><BrandIcon name={name} size={18} /><span>{label}</span></a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="info-section info-section--tight">
        <div className="info-wrap">
          <p className="info-disclosure">{contactContent.disclosure}</p>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Policies, legal and terms                                            */
/* ------------------------------------------------------------------ */

/** Pull the "Last Updated" line out of the body and tidy odd section structure. */
function prepare(page) {
  let updated = null;
  const sections = page.sections.map((section) => ({
    ...section,
    blocks: (section.blocks || []).filter((block) => {
      if (block.type !== "paragraph") return true;
      const match = strip(block.html).match(/^last updated:\s*(.+)$/i);
      if (match) {
        updated = match[1];
        return false;
      }
      return true;
    }),
  }));

  // An empty heading followed by a "Heading:" section is one section.
  const merged = [];
  for (let i = 0; i < sections.length; i += 1) {
    const current = sections[i];
    const next = sections[i + 1];
    if (current.heading && current.blocks.length === 0 && next?.heading?.trim().endsWith(":")) {
      merged.push({ ...current, blocks: next.blocks });
      i += 1;
    } else {
      merged.push(current);
    }
  }

  const children = subsections[page.slug] || [];
  const used = new Set();
  const items = merged.map((section) => {
    const base = section.heading ? slugify(section.heading) : "";
    let id = base;
    for (let n = 2; id && used.has(id); n += 1) id = `${base}-${n}`;
    if (id) used.add(id);
    return { ...section, id, level: children.includes(section.heading) ? 3 : 2 };
  });

  const intro = items[0] && !items[0].heading ? items[0] : null;
  const introBlocks = intro ? intro.blocks : [];
  const lede = introBlocks[0]?.type === "paragraph" ? introBlocks[0].html : page.description;
  return {
    updated,
    lede,
    introRest: introBlocks[0]?.type === "paragraph" ? introBlocks.slice(1) : introBlocks,
    sections: items.filter((section) => section.heading),
  };
}

function Toc({ sections, className }) {
  return (
    <ol className={className}>
      {sections.map((section) => (
        <li key={section.id} className={section.level === 3 ? "is-sub" : undefined}>
          <a href={`#${section.id}`}>{section.heading.replace(/:$/, "")}</a>
        </li>
      ))}
    </ol>
  );
}

function PolicyPage({ page }) {
  const { updated, lede, introRest, sections } = prepare(page);
  const tocSections = sections;
  return (
    <>
      <Hero page={page} lede={lede} updated={updated} />
      <div className="info-wrap info-shell">
        <aside className="info-nav" aria-label="Browse information pages">
          <PageNav current={page.slug} />
        </aside>

        <article className="info-prose">
          <details className="info-mobile-menu">
            <summary>Browse all pages</summary>
            <PageNav current={page.slug} />
          </details>
          <details className="info-mobile-menu">
            <summary>On this page</summary>
            <Toc sections={tocSections} className="info-toc-list" />
          </details>

          {introRest.length > 0 && <div className="info-intro">{introRest.map((block, i) => <NewsBlock key={i} block={block} />)}</div>}

          {sections.map((section) => {
            const Heading = section.level === 3 ? "h3" : "h2";
            return (
              <section key={section.id} id={section.id} className={`info-block${section.heading === "Contact" ? " info-block--contact" : ""}${section.level === 3 ? " is-sub" : ""}`}>
                <Heading>{section.heading.replace(/:$/, "")}</Heading>
                <div className="info-block-body">{section.blocks.map((block, i) => <NewsBlock key={i} block={block} />)}</div>
              </section>
            );
          })}
        </article>

        <aside className="info-rail">
          <div className="info-toc">
            <h2>On this page</h2>
            <Toc sections={tocSections} className="info-toc-list" />
          </div>
          <div className="info-help">
            <h2>Questions about this page?</h2>
            <p>Write to the editorial team and include the page and the passage you are asking about.</p>
            <a href={`mailto:${emails.editorial}`}>{emails.editorial}</a>
            <Link href="/contact">All contact options</Link>
          </div>
        </aside>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Entry point                                                          */
/* ------------------------------------------------------------------ */

export default function InformationPage({ page }) {
  const url = absoluteUrl(`/${page.slug}`);
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      publisherNode(),
      websiteNode(),
      breadcrumbNode([{ name: "Home", url: "/" }, { name: page.label, url: `/${page.slug}` }], url),
      {
        "@type": page.slug === "contact" ? "ContactPage" : page.slug === "about" ? "AboutPage" : "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        isPartOf: { "@id": websiteNode()["@id"] },
        inLanguage: "en-GB",
      },
    ],
  };

  const updated = prepare(page).updated;
  let body;
  if (page.slug === "about") body = <AboutPage page={page} />;
  else if (page.slug === "our-team") body = <TeamPage page={page} updated={updated} />;
  else if (page.slug === "contact") body = <ContactPage page={page} updated={updated} />;
  else body = <PolicyPage page={page} />;

  return (
    <main className="info-page">
      <JsonLd data={graph} />
      {body}
    </main>
  );
}
