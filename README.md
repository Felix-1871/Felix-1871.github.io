# Personal website

My CV site, built with Astro and published on GitHub Pages. `DESIGN.md` describes what it does and how it is built.

## Setup

You need Node 22.12 or later.

```sh
npm install
npx playwright install chromium --only-shell
npm run dev
```

The Playwright step downloads the headless Chromium that the build uses to print the PDFs.

## Commands

- `npm run dev`: local dev server at http://localhost:4321
- `npm run build`: build the site into `dist/` and print a PDF per language into `dist/cv/`
- `npm run preview`: serve the built site
- `npx astro check`: type and template check
- `npm run format`: format with Prettier

Every push to `main` builds and deploys the site through `.github/workflows/deploy.yml`.

## Editing the CV

All CV content is in `src/content/cv/en.yaml`. If something doesn't match the schema in `src/content.config.ts`, the build fails and names the field.

`de.yaml` and `pl.yaml` in the same folder hold the German and Polish text. They only contain text that changes between languages; names, dates, links and email always come from `en.yaml`. Any text left out falls back to English, and the build prints a warning listing each untranslated field.
