# Personal website

My CV site, built with Astro and published on GitHub Pages. `DESIGN.md` describes what it does and how it is built.

## Setup

You need Node 22.12 or later.

```sh
npm install
npm run dev
```

## Commands

- `npm run dev`: local dev server at http://localhost:4321
- `npm run build`: build the site into `dist/`
- `npm run preview`: serve the built site
- `npx astro check`: type and template check
- `npm run format`: format with Prettier

Every push to `main` builds and deploys the site through `.github/workflows/deploy.yml`.

## Editing the CV

All CV content is in `src/content/cv/en.yaml`. If something doesn't match the schema in `src/content.config.ts`, the build fails and names the field.
