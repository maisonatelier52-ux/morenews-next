#!/usr/bin/env python3
"""
One-off converter: More News (HTML-in-JSON) -> Washington Insider style structured data.

Reads the OLD public/data/*.json (articles/authors/people/companies/profiles/pages/home)
and writes the NEW structured files:
  news.json, authors.json, categories.json, people.json, companies.json, profiles.json, pages.json
"""
import json, re, os, sys, math, collections
from bs4 import BeautifulSoup, NavigableString

SRC = sys.argv[1]
DST = sys.argv[2]
os.makedirs(DST, exist_ok=True)

load = lambda n: json.load(open(os.path.join(SRC, n + ".json"), encoding="utf-8"))
def dump(n, d):
    with open(os.path.join(DST, n + ".json"), "w", encoding="utf-8") as f:
        json.dump(d, f, ensure_ascii=False, indent=2)
        f.write("\n")

def ws(s):
    return re.sub(r"\s+", " ", s or "").strip()

def inner(el):
    return ws("".join(str(c) for c in el.children))

def text(el):
    return ws(el.get_text(" ")) if el is not None else ""

ENTITY_ROOT_FIX = {}  # filled later: '/britannia-financial-group' -> '/company/...'

CATEGORY_SLUGS = set()

def fix_href(h):
    if not h:
        return h
    if h in ENTITY_ROOT_FIX:
        return ENTITY_ROOT_FIX[h]
    m = re.fullmatch(r"/([a-z-]+)/\1", h)   # old "/uk/uk" style category links
    if m and m.group(1) in CATEGORY_SLUGS:
        return "/" + m.group(1)
    return h

def fix_html_links(html):
    def rep(m):
        return 'href="%s"' % fix_href(m.group(1))
    return re.sub(r'href="([^"]+)"', rep, html)

articles = load("articles")
authors_old = load("authors")
categories = load("categories")
people_old = load("people")
companies_old = load("companies")
profiles_old = load("profiles")
pages_old = load("pages")

for c in companies_old:
    ENTITY_ROOT_FIX["/" + c["slug"]] = "/company/" + c["slug"]
for p in people_old:
    ENTITY_ROOT_FIX["/" + p["slug"]] = "/people/" + p["slug"]
CATEGORY_SLUGS.update(c["slug"] for c in categories)
# hero link in bancredito page uses short slug
ENTITY_ROOT_FIX["/bancredito-international-bank-trust"] = "/company/bancredito-international-bank-and-trust"

cat_name = {c["slug"]: c["name"] for c in categories}
author_slug_fix = {"daniel-rowcroft-investigation-journalist": "daniel-rowcroft"}

# ---------------------------------------------------------------------------
# AUTHORS
# ---------------------------------------------------------------------------
ROLE_FROM_TITLE = re.compile(r"^.+?\s[–-]\s(.+?)(?:\sat More News)?$")
authors = []
for i, a in enumerate(authors_old, 1):
    s = BeautifulSoup(a["html"], "html.parser")
    bio = text(s.select_one(".bio-text"))
    social = {}
    for link in s.select(".bio-panel .share-btn"):
        social[(link.get("title") or "").lower()] = link.get("href")
    hidden_h2 = s.select_one("main > h2")
    hidden_h3 = s.select_one("main > h3")
    m = ROLE_FROM_TITLE.match(a["title"])
    authors.append({
        "id": i,
        "slug": a["slug"],
        "name": a["name"],
        "role": m.group(1) if m else "Journalist",
        "location": "United Kingdom",
        "image": a["image"],
        "bio": bio,
        "metaTitle": a["title"],
        "metaDescription": a["description"],
        "social": social,
        "seoHeading": text(hidden_h2) if hidden_h2 else "",
        "seoTopic": text(hidden_h3) if hidden_h3 else "",
    })

# desk byline used by one article
authors.append({
    "id": len(authors) + 1,
    "slug": "more-news-business-desk",
    "name": "More News Business Desk",
    "role": "Business desk",
    "location": "United Kingdom",
    "image": "/images/logo.webp",
    "desk": True,
    "bio": "The More News Business Desk covers UK companies, markets, energy, industry and the economy.",
    "metaTitle": "More News Business Desk – Business reporting at More News",
    "metaDescription": "Business reporting from the More News Business Desk covering UK companies, markets, energy and industry.",
    "social": {},
    "seoHeading": "",
    "seoTopic": "",
})
author_by_slug = {a["slug"]: a for a in authors}

# ---------------------------------------------------------------------------
# ARTICLES
# ---------------------------------------------------------------------------
def date_only(v):
    return v[:10]

def parse_paragraph_children(container, blocks):
    for e in container.children:
        if not getattr(e, "name", None):
            continue
        cls = e.get("class", [])
        if e.name == "p":
            html = inner(e)
            if html:
                blocks.append({"type": "paragraph", "html": fix_html_links(html)})
        elif e.name in ("h2", "h3"):
            b = {"type": "heading", "level": int(e.name[1]), "text": text(e)}
            if cls:
                b["className"] = " ".join(cls)
            blocks.append(b)
        elif e.name == "hr":
            blocks.append({"type": "divider"})
        elif "share-dropdown-x" in cls:
            continue
        else:
            raise SystemExit("unhandled element in story text: %s %s" % (e.name, cls))

def parse_standard(x):
    s = BeautifulSoup(x["html"], "html.parser")
    main = s.find("main")
    blocks, summary, seen_hero = [], None, False
    for c in main.children:
        if not getattr(c, "name", None):
            continue
        cls = c.get("class", [])
        if "image-wrapper" in cls:
            img = c.find("img")
            if not seen_hero:
                seen_hero = True
                continue
            blocks.append({"type": "image", "src": img["src"], "alt": ws(img.get("alt", ""))})
        elif "writer-block" in cls:
            box = c.select_one(".aio-box")
            if box:
                summary = {"heading": text(box.find("h2")), "text": text(box.find("p"))}
            w = c.select_one(".story-text-wrap")
            if w:
                parse_paragraph_children(w, blocks)
    return summary, blocks

def bullet_items_from_ul(ul):
    items = []
    for li in ul.find_all("li", recursive=False):
        strong = li.find("strong")
        span = li.find("span")
        items.append({"value": text(strong) if strong else "", "label": text(span) if span else "",
                      "accent": "seal" if "var(--seal)" in (li.get("style") or "") else "brass"})
    return items

def parse_dossier(x):
    s = BeautifulSoup(x["html"], "html.parser")
    d = s.select_one("article.dossier")
    out = {}
    out["eyebrow"] = text(d.select_one(".dossier-eyebrow"))
    out["dateLabel"] = text(d.select_one(".dossier-date"))
    out["tags"] = {
        "category": [text(t) for t in d.select(".dossier-tag-category")],
        "key": [text(t) for t in d.select(".dossier-tag-key")],
    }
    out["standfirst"] = text(d.select_one(".dossier-standfirst"))
    cap = d.select_one(".dossier-hero figcaption")
    out["heroCaption"] = text(cap) if cap else ""
    chart = []
    for card in d.select(".dossier-chart-card"):
        role = text(card.select_one(".dossier-chart-role"))
        nm = card.select_one(".dossier-chart-name")
        tt = card.select_one(".dossier-chart-title")
        item = {"role": role, "name": text(nm), "title": text(tt), "nameHtml": fix_html_links(inner(nm)),
                "titleHtml": fix_html_links(inner(tt)), "chair": "dossier-chart-card--chair" in card.get("class", [])}
        chart.append(item)
    if chart:
        out["chart"] = chart

    css = x.get("inlineStyles") or ""
    m = re.search(r'\.dossier-chart::before\s*\{\s*content:\s*"([^"]*)"', css)
    if m: out["chartLabel"] = m.group(1)
    m = re.search(r'chair::after\s*\{\s*content:\s*"([^"]*)"', css)
    if m: out["chartBadge"] = m.group(1)
    if ".dossier-body a {" in css:
        out["linkedBody"] = True
    out["closing"] = [inner(p) for p in d.select(".dossier-closing p")]
    sources = []
    for li in d.select(".dossier-sources-list li"):
        a_ = li.find("a")
        if a_:
            sources.append({"name": text(a_), "url": a_["href"]})
        else:
            num = li.select_one(".dossier-source-num")
            if num: num.extract()
            sources.append({"name": text(li)})
    out["sources"] = sources

    side = []
    for blk in d.select(".dossier-side-block"):
        heading = text(blk.select_one(".dossier-side-heading"))
        if blk.select_one(".dossier-facts-list"):
            side.append({"type": "facts", "heading": heading, "items": [
                {"label": text(li.select_one(".dossier-fact-label")), "value": text(li.select_one(".dossier-fact-value"))}
                for li in blk.select(".dossier-facts-list li")]})
        elif blk.select_one(".dossier-related-list"):
            items = []
            for li in blk.select(".dossier-related-list li"):
                a_ = li.find("a")
                tag = a_.select_one(".dossier-related-tag")
                tagtxt = text(tag)
                tag.extract()
                item = {"href": fix_href(a_["href"]), "tag": tagtxt, "label": text(a_)}
                if a_.get("target") == "_blank": item["external"] = True
                items.append(item)
            side.append({"type": "related", "heading": heading, "items": items})
        elif blk.select_one(".dossier-share-icons"):
            side.append({"type": "share", "heading": heading,
                         "networks": [a_.get("data-share") for a_ in blk.select(".dossier-share-icons a") if a_.get("data-share")]})
        else:
            side.append({"type": "text", "heading": heading, "text": text(blk.find("p"))})
    out["sidebar"] = side
    return out

news = []
for x in articles:
    slug = x["slug"]
    aslug = author_slug_fix.get(x["authorSlug"], x["authorSlug"])
    item = {
        "id": x["id"],
        "slug": slug,
        "title": x["title"],
        "metaTitle": x["metaTitle"],
        "metaDescription": x["metaDescription"],
        "excerpt": x["excerpt"],
        "category": x["category"],
        "authorSlug": aslug,
        "publishedAt": x["publishedAt"],
        "updatedAt": x.get("updatedAt") or x["publishedAt"],
        "image": x["image"],
        "imageAlt": x["imageAlt"],
        "keywords": x.get("tags") or [],
        "articleType": x["articleType"],
        "layout": "standard",
    }
    html = x.get("html") or ""
    if html and BeautifulSoup(html, "html.parser").select_one("article.dossier"):
        item["layout"] = "dossier"
        item["dossier"] = parse_dossier(x)
        item["body"] = {"blocks": []}  # filled by dossier_blocks() below
    elif html:
        summary, blocks = parse_standard(x)
        item["body"] = {"blocks": blocks}
        if summary:
            item["body"]["summary"] = summary
    else:
        item["body"] = {"blocks": []}
    news.append(item)

# The dossier body blocks: re-run to capture blocks (parse_dossier returns them in 'dossier' minus body)
def dossier_blocks(x):
    s = BeautifulSoup(x["html"], "html.parser")
    d = s.select_one("article.dossier")
    blocks = []
    for e in d.select_one(".dossier-body").children:
        if not getattr(e, "name", None):
            continue
        cls = e.get("class", [])
        if e.name == "p":
            if "dossier-pullquote" in cls:
                blocks.append({"type": "pullquote", "html": inner(e)})
            else:
                blocks.append({"type": "paragraph", "html": fix_html_links(inner(e))})
        elif e.name == "h2":
            blocks.append({"type": "heading", "text": text(e)})
        elif e.name == "ul" and "dossier-timeline" in cls:
            items = []
            for li in e.find_all("li", recursive=False):
                sp = li.find("span", class_="dossier-timeline-date")
                d_ = text(sp)
                sp.extract()
                items.append({"date": d_, "text": inner(li)})
            blocks.append({"type": "timeline", "items": items})
        elif e.name == "ul":
            blocks.append({"type": "stats", "items": bullet_items_from_ul(e)})
        elif e.name == "table":
            rows = []
            for tr in e.find_all("tr"):
                tds = tr.find_all("td")
                if tds:
                    rows.append({"claim": inner(tds[0]), "status": inner(tds[1]),
                                 "tone": (tds[1].get("class") or ["status-unverified"])[0].replace("status-", "")})
            head = [text(th) for th in e.find_all("th")]
            blocks.append({"type": "table", "head": head, "rows": rows})
        elif "dossier-faq" in cls:
            items = []
            for det in e.select(".dossier-faq-item"):
                q = det.select_one(".dossier-faq-question > span")
                num = q.select_one(".dossier-faq-num")
                if num: num.extract()
                ans = det.select_one(".dossier-faq-answer")
                items.append({"question": text(q), "answer": fix_html_links(inner(ans)), "open": det.has_attr("open")})
            blocks.append({"type": "faq", "items": items})
        else:
            raise SystemExit("unhandled dossier body element %s %s" % (e.name, cls))
    return blocks

by_slug_old = {x["slug"]: x for x in articles}
for item in news:
    if item["layout"] == "dossier":
        item["body"] = {"blocks": dossier_blocks(by_slug_old[item["slug"]])}
    # reading time
    words = 0
    for b in item["body"]["blocks"]:
        if b["type"] in ("paragraph", "pullquote"):
            words += len(re.sub(r"<[^>]+>", " ", b["html"]).split())
        elif b["type"] == "faq":
            for q in b["items"]:
                words += len(re.sub(r"<[^>]+>", " ", q["answer"]).split())
    if words:
        item["readingTime"] = "%d min read" % max(1, math.ceil(words / 220))

# Homepage lead is the pinned client article
for item in news:
    item["featured"] = item["slug"] in (
        "britannia-leadership-julio-cesar-herrera-lord-stanley-fink",
        "isabela-herrera-banvelca-patient-capital",
    )

news.sort(key=lambda a: a["publishedAt"], reverse=True)
dump("news", news)
dump("authors", authors)

# ---------------------------------------------------------------------------
# CATEGORIES (add nav label, order kept)
# ---------------------------------------------------------------------------
dump("categories", categories)

# ---------------------------------------------------------------------------
# ENTITIES (people / companies / profiles)
# ---------------------------------------------------------------------------
def parse_entity(e, kind):
    s = BeautifulSoup(e["html"], "html.parser")
    out = {
        "slug": e["slug"],
        "kind": kind,
        "name": e["name"],
        "metaTitle": e["title"],
        "metaDescription": e["description"],
        "image": e.get("image"),
    }
    crumbs = s.select("nav ol li")
    out["breadcrumbLabel"] = text(crumbs[2].find("span")) if len(crumbs) > 2 else ""
    hero = s.select_one("section.profile-hero")
    img = hero.find("img")
    if img:
        out["heroImage"] = img["src"]
        out["heroImageAlt"] = ws(img.get("alt", ""))
    ps = hero.select("p")
    out["kicker"] = text(ps[0])
    out["heading"] = text(hero.find("h1"))
    out["jobTitle"] = text(ps[1])
    out["tagline"] = text(ps[2])
    links = []
    for a in hero.select("a.profile-link"):
        icon = a.find("i")
        links.append({"href": fix_href(a["href"]), "label": text(a), "icon": " ".join(icon.get("class", [])) if icon else "",
                      "external": a.get("target") == "_blank"})
    out["links"] = links

    sections = []
    main_col = s.select_one(".lg\\:col-span-2")
    for sec in main_col.find_all("section", recursive=False):
        heading = text(sec.find("h2"))
        if sec.select_one("div.font-sans"):
            paras = [fix_html_links(inner(p)) for p in sec.select("div.font-sans p")]
            sections.append({"type": "paragraphs", "heading": heading, "items": [p for p in paras if p]})
        elif sec.find("ul"):
            items = [fix_html_links(inner(li.find("div"))) for li in sec.select("ul > li")]
            sections.append({"type": "bullets", "heading": heading, "items": items})
        elif sec.find("article"):
            items = []
            for art in sec.select("article"):
                a_ = art.find("a")
                items.append({"href": fix_href(a_["href"]), "tag": text(a_.find("span")), "title": text(a_.find("h3")), "excerpt": text(a_.find("p"))})
            sections.append({"type": "coverage", "heading": heading, "items": items})
        elif sec.find("a", recursive=False) is not None:
            items = []
            for a_ in sec.find_all("a", recursive=False):
                items.append({"href": fix_href(a_["href"]), "tag": text(a_.find("span")), "title": text(a_.find("h3")), "excerpt": text(a_.find("p"))})
            sections.append({"type": "coverage", "variant": "link", "heading": heading, "items": items})
        elif sec.select_one("div.grid"):
            items = []
            for a_ in sec.select("div.grid > a"):
                items.append({"href": fix_href(a_["href"]), "tag": text(a_.find("span")), "title": text(a_.find("h3")), "excerpt": text(a_.find("p"))})
            sections.append({"type": "cards", "heading": heading, "items": items})
        else:
            raise SystemExit("unknown entity section %s in %s" % (heading, e["slug"]))
    out["sections"] = sections

    side = []
    for blk in s.select("aside > div"):
        heading = text(blk.find("h3"))
        if blk.find("dl"):
            side.append({"type": "facts", "heading": heading, "items": [
                {"label": text(d.find("dt")), "value": text(d.find("dd"))} for d in blk.select("dl > div")]})
        elif blk.select_one("div.flex.flex-wrap"):
            side.append({"type": "themes", "heading": heading, "items": [text(sp) for sp in blk.select("span")]})
        elif blk.find("ul"):
            items = []
            cls0 = blk.select_one("li a").get("class", [])
            style = "flex" if "flex" in cls0 else "plain"
            sp = "space-y-2" if "space-y-2" in blk.find("ul").get("class", []) else "space-y-3"
            for a_ in blk.select("li a"):
                icon = a_.find("i")
                items.append({"href": fix_href(a_["href"]), "label": text(a_), "icon": " ".join(i for i in icon.get("class", []) if i not in ("w-5", "text-center")) if icon else "",
                              "external": a_.get("target") == "_blank"})
            side.append({"type": "links", "heading": heading, "style": style, "spacing": sp, "items": items})
        else:
            raise SystemExit("unknown aside block %s in %s" % (heading, e["slug"]))
    out["sidebar"] = side
    schema = e.get("schema")
    if isinstance(schema, str):
        import ast
        schema = ast.literal_eval(schema)
    out["schema"] = schema or {}
    return out

people = [parse_entity(e, "people") for e in people_old]
companies = [parse_entity(e, "company") for e in companies_old]
profiles = [parse_entity(e, "profile") for e in profiles_old]
dump("people", people)
dump("companies", companies)
dump("profiles", profiles)

# ---------------------------------------------------------------------------
# PAGES (static information pages) - source html is empty; keep metadata only
# ---------------------------------------------------------------------------
ABOUT_PAGES = ["about", "our-team", "contact", "privacy-policy", "terms-and-conditions"]
def label_of(slug):
    return " ".join(w[:1].upper() + w[1:] for w in slug.split("-"))
pages = [{"slug": p["slug"], "label": label_of(p["slug"]), "group": "about" if p["slug"] in ABOUT_PAGES else "policy",
          "title": p["title"], "description": p["description"], "sections": []} for p in pages_old]
POLICY_PAGES = ["editorial-policy", "corrections-policy", "source-methodology", "ownership-and-funding", "advertising-policy", "right-of-reply", "legal"]
ORDER = ABOUT_PAGES + POLICY_PAGES
pages.sort(key=lambda p: ORDER.index(p["slug"]) if p["slug"] in ORDER else 99)
dump("pages", pages)

print("articles", len(news), collections.Counter(a["layout"] for a in news))
print("with body:", sum(1 for a in news if a["body"]["blocks"]))
print("authors", len(authors), "people", len(people), "companies", len(companies), "profiles", len(profiles), "pages", len(pages))
