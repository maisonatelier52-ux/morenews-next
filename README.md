# More News — Next.js

The supplied More News theme, with complete content restored from `morenews-main (6).zip`.
The project uses Next.js 14.2.35, React 18 and the App Router.

## Run locally

```bash
npm ci
npm run check:data
npm run dev
```

For production:

```bash
npm run build
npm start
```

Open http://localhost:3000. Set `NEXT_PUBLIC_SITE_URL` to override https://www.morenews.org.

## Changes in this version

- Restored the 64 missing article bodies. All 78 articles have their supplied content; all 75 standard articles have full paragraphs, headings, lists, supplementary images and relevant source / update boxes.
- Restored the text on all 12 information and policy pages, using their existing page component.
- Recovered full metadata and summaries, including six summaries previously cut off at apostrophes.
- Matched the HTML category layout: a lead story, compact side stories, and a news list. Eight stories appear per category page, with numbered Previous / Next links when needed.
- Added eight-story pagination to author article lists while retaining the author biography and page layout.
- Added shared page gutters, space around rules and news columns, readable Georgia paragraph text on the home and standard news pages, and consistent image proportions. Existing heading font families remain.
- Added distinct archive stories to the original home news sections and to Business / Health sections. Homepage story selection prevents duplicates.
- Centered the mobile masthead and moved search into the menu. The menu supports Escape, keyboard focus, and a backdrop close button.
- Replaced mixed social images / icon fonts with one local monochrome SVG family in the footer, article, author and shared social controls.
- Retained client / dossier and entity page content and layouts. Their style files and dossier article component are unchanged; social glyphs use the shared icon family.

## Content and pagination

Content lives in `public/data/`. Standard article blocks are rendered by `components/NewsBlock.jsx`.
Append new articles to `news.json`; home, categories, author pages, search, sitemap and RSS use the same archive.
Run `npm run check:data` after editing data to check empty bodies, references, images and imported markup.

Pagination size is set in `lib/pagination.js`. Page 1 uses `/uk` or `/author/james-thornton`; later pages use `/uk/page/2` and `/author/james-thornton/page/2`.
Later pages have their own canonical URLs and sitemap entries. Rebuild after adding content so static pages update.

Home sections and pinned lead stories are set in `lib/homeData.js`. Page-specific layout refinements are in `app/refinements.css`.
Legacy `.html` article, category, author and information links redirect to the Next.js routes.

The archive contains the user-supplied news reporting. This update restores that reporting; it does not rewrite it or add newly researched stories.
