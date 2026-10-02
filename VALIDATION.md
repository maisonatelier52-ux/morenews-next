# Validation

- Production build completed: 141 static pages generated, plus the dynamic search route.
- `npm run check:data` passed for 78 articles, 8 categories, 10 authors and 12 information pages. All local image references and internal links in content resolve.
- Compared every standard article paragraph against the supplied HTML: no missing paragraphs.
- Verified all three dossier article data objects and all people / company / profile / author data match the supplied Next.js project.
- Category pagination: 13 UK stories across pages 1 and 2, without repeated stories.
- All 137 routes in the production prerender manifest returned HTTP 200; invalid category / author page numbers returned 404. The legacy category redirect and restored-body search passed.
- Author pagination: 14 James Thornton stories across pages 1 and 2, without repeated stories.
- Mobile search found `24A5430a`, a term in the restored Apple article body, and closed the menu after navigation.
- Checked home, category, standard article and author layouts at desktop and mobile widths, including gutters, logo alignment and social icons.
- The home page shows 40 distinct archive stories, without repeated stories across sections. The news sidebar fills the column and the footer uses six matching SVG social icons.

The ZIP contains source and public assets. It excludes `node_modules` and `.next`; install dependencies and build using the commands in README.md.
