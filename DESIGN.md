# Personal Website — Design Document

_Last updated: 2026-09-23_

## Overview & goals

The site is an online CV and professional profile: who I am, what I've done, and how to reach me. It serves two audiences equally: employers and recruiters, and potential clients. English is the default language, with German and Polish versions. It is minimal and typographic, built with Astro, and hosted on GitHub Pages.

- **Scannable:** role, experience and skills are clear within the first screen.
- **Easy to update:** changing the CV means editing one data file, never markup.
- **Downloadable:** a PDF CV per language is generated from the same page at build time, so there is no separate document to keep in sync.
- **Lightweight and private:** no cookies, tracking or third-party requests, so no consent banner is needed.
- **Simple to maintain:** few dependencies, and a push to `main` deploys the site.

## Content & information architecture

Each language gets one page with in-page section anchors, plus a 404 page. English lives at `/`, German at `/de/` and Polish at `/pl/`.

| Section | Contents |
| --- | --- |
| Header | Name, role, one-line summary, language switcher (EN · DE · PL), two actions: "Get in touch" and "Download CV (PDF)" |
| About | 2–3 sentences on what I do and for whom, written for both employers and clients |
| Experience | Roles, newest first: title, organisation, dates, location, 2–4 concrete achievements each |
| Selected work | Projects with a one-line description, my role and a link |
| Skills | Short grouped lists, for example design, development and tools |
| Education | Degrees and certifications with dates |
| Languages | Spoken languages and level |
| Contact | Email, LinkedIn and GitHub, open to both job offers and project enquiries, plus a link to my business site for clients |

- **Navigation:** a skip link, then the name and anchor links to each section. On small screens the links wrap; there is no hamburger menu.
- **Language switcher:** plain links that point to the same page in the other language. The site never redirects based on browser language.
- **Content source:** all CV content lives in one YAML file per language, validated against one shared schema. Headings and button labels come from a small UI-strings file. English must be complete. German and Polish may leave fields out, and any missing field falls back to English, marked `lang="en"` so screen readers pronounce it correctly. The build prints a warning listing every untranslated field.

## Visual design

Typography carries the design. There is no decorative imagery; hierarchy comes from type size, weight and whitespace alone.

- **Layout:** a single column with a line length of about 65–75 characters. Content comes first, and the layout stays one column on every screen size.
- **Type:** Newsreader (variable, with optical sizes) for the name and section headings, and Inter (variable) for everything else. Both are OFL-licensed and self-hosted. Sizes follow a modular scale of about 1.25, and dates use Inter's tabular numerals so they line up.
- **Colour:** warm near-black on off-white, with rust as the only accent, used for links and focus rings. Links are underlined, and the underline thickens on hover. Tokens are in the table below. Dark mode follows `prefers-color-scheme`.
- **Motion:** only subtle hover and focus transitions, switched off under `prefers-reduced-motion`.
- **Print:** a dedicated print stylesheet hides navigation, shows link URLs and avoids page breaks inside entries.
- **Photo:** none. The name, set large in Newsreader, is the visual anchor.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | `#FAFAF7` | `#151514` | Page background |
| `--text` | `#1A1A18` | `#EDEDE8` | Name, headings, body text |
| `--text-muted` | `#5F5E5A` | `#A3A29B` | Dates, locations, secondary text |
| `--rule` | `#E4E3DD` | `#2C2C2A` | Hairlines between entries |
| `--accent` | `#A8431C` | `#F2A07F` | Links, focus ring (2 px outline, 2 px offset) |

All text colours reach at least 4.5:1 contrast on their background in both themes.

## Tech stack & architecture

The site uses current stable Astro with static output and plain CSS, and it ships no client-side JavaScript.

- **Framework:** Astro with `output: 'static'` and TypeScript in strict mode. No UI framework and no islands.
- **Styling:** one global stylesheet holds the design tokens (type scale, colours, spacing) as CSS custom properties. Components use scoped styles. No Tailwind and no CSS framework.
- **Content:** Astro content collections with one Zod schema for the CV (English validates against the full schema, German and Polish against a deep-partial version of it), loading `en.yaml`, `de.yaml` and `pl.yaml`.
- **Languages:** Astro's built-in i18n routing with `defaultLocale: 'en'` and locales `en`, `de` and `pl`. English has no URL prefix.
- **Fonts:** Newsreader and Inter as self-hosted variable WOFF2 files, subset to Latin plus Latin Extended-A so German and Polish characters (ä, ß, ą, ę, ł, ś, ż) render. Uses `font-display: swap` and preloads the Inter file used for body text.
- **PDF:** after `astro build`, a script serves `dist/` locally and opens each language page in headless Chromium through Playwright. It saves each page as an A4 PDF using the print stylesheet, to `dist/cv/cv-en.pdf`, `cv-de.pdf` and `cv-pl.pdf`. `npm run build` runs both steps. The header links to the PDF for the current language.
- **Dependencies:** `@astrojs/sitemap`, plus `playwright` as a dev dependency. Any other dependency needs approval first.
- **Tooling:** npm, Prettier, and `astro check` in CI.

```text
.github/workflows/deploy.yml   build, generate PDFs, deploy to Pages
public/                        fonts, favicon, robots.txt, OG image
scripts/generate-pdf.ts        prints each locale to dist/cv/*.pdf
src/
  content.config.ts            CV schema (Zod)
  content/cv/                  en.yaml · de.yaml · pl.yaml
  i18n/ui.ts                   UI strings per locale + helpers
  layouts/Base.astro           <html lang>, meta, hreflang, fonts
  components/                  Header, Section, ExperienceItem, ...
  pages/index.astro            English page
  pages/[lang]/index.astro     German + Polish via getStaticPaths
  pages/404.astro
  styles/global.css            tokens, base type, print rules
astro.config.mjs
```

## SEO, performance & accessibility

Targets: Lighthouse 100 in all four categories on mobile, and WCAG 2.2 AA in both themes.

- **Semantic HTML:** one `h1` per page, one heading per section, lists for entries, and `<time datetime>` for dates. All content is in the static HTML, so search engines and AI crawlers can read it without JavaScript.
- **Accessibility:** a skip link, visible focus styles, and text contrast of at least 4.5:1. Each page sets `lang`, and switcher links carry `hreflang` and `lang`.
- **SEO:** a unique title and description per locale, and a canonical URL. `hreflang` alternates include `x-default` pointing to English.
- **Discovery:** `sitemap.xml`, `robots.txt`, Open Graph tags with a typographic OG image (name and role in Newsreader on the page background), and JSON-LD `Person` markup generated from the CV data.
- **Budget:** HTML plus CSS under 50 KB compressed per page, fonts under 150 KB per page (split by `unicode-range`, so each page loads only the subsets it uses), and zero layout shift.

## Hosting, domain & deployment

GitHub Pages serves the site on my own custom domain. A GitHub Actions workflow builds and deploys it on every push to `main`.

- **Workflow:** a custom workflow that checks out, sets up Node, runs `npm ci`, installs Playwright's Chromium and runs `npm run build`. Then `actions/upload-pages-artifact` uploads `dist/` and `actions/deploy-pages` publishes it. The stock `withastro/action` is not enough, because the build includes the PDF step. In the repo settings, the Pages source is "GitHub Actions".
- **Domain:** a custom domain with the apex (`yourname.com`) as primary, and `www` redirecting to it. It is set under Settings → Pages. Sites published by an Actions workflow ignore a `CNAME` file, so the repo has none. `site` in `astro.config.mjs` is `https://<domain>`, because canonical URLs, hreflang and the sitemap depend on it.
- **DNS (my manual steps, not Claude Code's):** verify the domain in GitHub account settings, add it to the repo, then set the DNS records. The apex gets four `A` records (185.199.108.153 to 185.199.111.153) and four `AAAA` records (2606:50c0:8000::153 to 2606:50c0:8003::153). `www` gets a `CNAME` to `<username>.github.io`, and GitHub redirects between the two. No wildcard records. Turn on "Enforce HTTPS" once it appears, which can take up to 24 hours.
- **Repository:** `<username>.github.io`. With a custom domain the site serves from the root, so no `base` path is needed.
- **Checks:** pull requests must pass `astro check` and a clean build, including PDF generation, before merge.
- **Preview:** Pages has no preview deploys, so review is local with `npm run build && npm run preview`.

Source: [GitHub Docs: Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

## Milestones & Claude Code workflow

The build runs as six milestones. Claude Code stops after each one for review, with one branch and one pull request per milestone, and I merge.

| # | Milestone | Done when |
| --- | --- | --- |
| M1 | Scaffold & deploy | Astro project in strict TypeScript, the repo structure above and the deploy workflow are in place, and a placeholder page is live on GitHub Pages |
| M2 | Content model | The CV schema and an English YAML file with placeholder data exist, every section renders as semantic unstyled HTML, and invalid data fails the build |
| M3 | Visual design | Tokens, type scale, layout, self-hosted font and light and dark themes are done, and the page holds up from 320 px to 1440 px wide |
| M4 | Languages | German and Polish routes, UI strings, the language switcher and hreflang work, and all three pages build from their YAML files, with missing German and Polish fields falling back to English and listed in a build warning |
| M5 | Print & PDF | The print stylesheet works, the build generates a PDF per language, and the English PDF fits on at most two A4 pages |
| M6 | SEO & polish | Meta tags, Open Graph, JSON-LD, sitemap, robots.txt and the 404 page are done, and the site scores Lighthouse 100 and passes an accessibility check |

- **Branches:** `m1-scaffold`, `m2-content-model` and so on. Each PR description lists what changed and how to check it locally.
- **No invented content:** Claude Code never makes up CV facts. It uses placeholder text marked `TODO`, which I replace.
- **Scope discipline:** no dependencies beyond this document without asking first, and no work from a later milestone pulled into an earlier one.

## Out of scope & open questions

Not in v1: a blog, a CMS, analytics, a contact form, client-side frameworks, and automatic language redirects. Pages has no backend, so contact goes through `mailto` and profile links.

- [ ] Fill in the domain name and the business site URL before M6. Until then, the site runs on `<username>.github.io`.
