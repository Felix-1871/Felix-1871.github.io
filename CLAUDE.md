# CLAUDE.md

Personal CV site. `DESIGN.md` is the source of truth for **what** to build; this file covers **how**. If they conflict on scope or design, `DESIGN.md` wins. If something is ambiguous, ask instead of guessing.

## Workflow

- Work one milestone at a time from `DESIGN.md`. Branch `mN-short-name`, one PR per milestone, then stop and wait for review. Never merge.
- Start each milestone by restating its "Done when" criteria. End it by checking every criterion and reporting how you verified each one.
- Never claim something works without running it. If you couldn't verify something, say so plainly.
- Keep diffs scoped to the milestone. Don't reformat, rename or tidy files you weren't asked to touch.
- Ask before adding any dependency not listed in `DESIGN.md`.

## Commands

- `npm run dev`: local dev server
- `npm run build`: Astro build plus PDF generation
- `npm run preview`: serve the built site
- `npx astro check`: type and template check (must pass before every PR)

## Content: never invent

- Never write CV facts I haven't given you: no employers, dates, metrics, clients, testimonials, logos or "years of experience".
- Placeholders say what belongs there, prefixed `TODO:`. Example: `TODO: one-line summary of current role`. No lorem ipsum.
- No fake social proof: no "50+ projects", "100% satisfaction", or skill percentages.

## Copy rules

These apply to every visible string, meta description, alt text, commit message and PR description.

- Plain, specific, first person where natural. Say what I do, not how passionate I am about it.
- **Banned words:** passionate, leverage, seamless, cutting-edge, innovative, dynamic, elevate, unlock, empower, delve, journey, crafting, bespoke, synergy, world-class, results-driven, game-changer, "in today's digital landscape", "let's build something amazing together".
- **Banned patterns:**
  - "Not just X, but Y"
  - reflexive groups of three
  - rhetorical questions
  - exclamation marks
  - em dashes in UI copy
  - "Hi, I'm …" openers
  - emoji
- Use sentence case for headings, buttons and labels. No Title Case, and no ALL-CAPS labels.
- Section headings are plain nouns: "Experience", not "My journey" or "Where I've been".
- Buttons say exactly what happens: "Download CV (PDF)", "Get in touch". Never "Learn more" or "Get started".
- Write German and Polish as idiomatic text, not word-for-word translation. Don't choose formal or informal address yourself; ask if it isn't settled.

## Visual rules

These add to `DESIGN.md`. Its tokens and type choices are fixed.

- **No decoration:**
  - no gradients (including gradient text)
  - no glassmorphism, backdrop blur, glow or drop shadows
  - no blobs, particles, noise textures or illustrations
- **No cards.** Entries are text blocks separated by whitespace and the `--rule` hairline. Nothing gets a box, a shadow or a rounded border.
- **No icons.** Links are words. No icon next to each heading or contact link.
- **No hero clichés:**
  - no waving hand
  - no typewriter effect or rotating job titles
  - no avatar placeholder
  - no bouncing "scroll down" chevron
- **No template chrome:**
  - no eyebrow labels above headings or tracked-out caps
  - no numbered markers (01 / 02) unless the content really is a sequence
  - no `→` appended to links
  - no `·` separators in meta lines; the language switcher is three plain links separated by space
  - no monospace for dates or labels
  - no single accented word in a heading
- **No skill bars, ratings or logo grids.** Skills are short text lists.
- **Motion:**
  - no scroll-triggered or entrance animations
  - no hover lift or scale
  - hover only changes the link underline, as `DESIGN.md` describes
- **Layout:** left-aligned text throughout. Don't centre body content.
- Colours come only from the token table. Spacing and type sizes come only from the scale in `global.css`. No magic numbers.

## Code rules

- Semantic HTML first: `header`, `main`, `section`, `ol`/`ul`, `time`, `a`. No div soup, and no ARIA where a native element already does the job.
- No client-side JavaScript. The only `<script>` allowed is JSON-LD.
- **CSS:**
  - custom properties from `global.css` only
  - no `!important`
  - no unused selectors
  - keep specificity low and flat
- **TypeScript:**
  - strict
  - no `any`
  - derive types from the Zod schema rather than duplicating them
- Don't add abstractions, props, config options or helpers "for flexibility". Build what the milestone needs; three similar lines beat a premature abstraction.
- **Comments:** explain why, never what. No commented-out code, and no `TODO`s except content placeholders.
- No `console.log` left behind. Don't swallow errors; the build should fail loudly on bad data.
- Don't create extra files nobody asked for (SUMMARY.md, NOTES.md, CHANGELOG, docs folders). The README stays a short setup section.

## Commits and PRs

- **Commits:** imperative, specific, no emoji. Example: `Add CV content schema`, not `✨ Implement comprehensive content system`.
- **PR descriptions:** what changed, how to check it locally, and what's deliberately left out. No hype words, and no claims you didn't verify.

## Before opening a PR

1. `npm run build` and `npx astro check` pass.
2. The banned-word check returns nothing:
   `grep -rniE "passionate|leverage|seamless|cutting-edge|innovative|elevate|unlock|empower|delve|journey|crafting|bespoke|world-class" src/`
3. No hex colours outside the tokens:
   `grep -rnE "#[0-9a-fA-F]{3,8}\b" src/ --include=*.astro --include=*.css | grep -v global.css`
4. Check the page at 320 px and 1440 px, in light and dark mode, and using only the keyboard.
5. Read every visible string once more and ask whether a person would actually write it that way. Rewrite it if not.
