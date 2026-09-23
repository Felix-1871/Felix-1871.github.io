// Runs after `astro build`: renders the Open Graph image for each language
// from its built page, so the name and role always match the CV data.
import { preview } from "astro";
import { chromium } from "playwright";
import { locales } from "../src/i18n/ui.ts";

const server = await preview({ logLevel: "warn" });
const browser = await chromium.launch();

try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    colorScheme: "light",
  });

  for (const locale of locales) {
    const path = locale === "en" ? "/" : `/${locale}/`;
    const response = await page.goto(`http://localhost:${server.port}${path}`, {
      waitUntil: "networkidle",
    });
    if (!response?.ok()) {
      throw new Error(`${path} returned ${response?.status()}.`);
    }

    // Keeps the page's stylesheet and fonts, and replaces the body with the
    // name and role set in Newsreader on the page background.
    await page.evaluate(async () => {
      const name = document.querySelector("h1")?.textContent ?? "";
      const role = document.querySelector(".role")?.textContent ?? "";
      const nameLine = document.createElement("p");
      const roleLine = document.createElement("p");
      nameLine.textContent = name;
      roleLine.textContent = role;
      nameLine.style.cssText =
        "font-size: 88px; line-height: var(--leading-tight); text-wrap: balance;";
      roleLine.style.cssText =
        "margin-block-start: 24px; font-size: 44px; color: var(--text-muted);";
      document.body.style.cssText =
        "max-inline-size: none; block-size: 100vh; box-sizing: border-box; margin: 0; padding: 0 96px; display: flex; flex-direction: column; justify-content: center; font-family: var(--font-display);";
      document.body.replaceChildren(nameLine, roleLine);
      await document.fonts.ready;
    });

    // npm runs scripts from the project root, so this lands in dist/og/.
    await page.screenshot({ path: `dist/og/og-${locale}.png` });
    console.info(`og-${locale}.png`);
  }
} finally {
  await browser.close();
  await server.stop();
}
