// Runs after `astro build`: serves dist/, prints each language's page to an
// A4 PDF with the print stylesheet, and writes it to dist/cv/cv-<locale>.pdf.
import { preview } from "astro";
import { chromium } from "playwright";
import { locales } from "../src/i18n/ui.ts";

// Chromium writes one uncompressed "/Type /Page" object per page.
function countPages(pdf: Uint8Array) {
  const text = new TextDecoder("latin1").decode(pdf);
  return text.match(/\/Type\s*\/Page(?!s)/g)?.length ?? 0;
}

const server = await preview({ logLevel: "warn" });
const browser = await chromium.launch();

try {
  const page = await browser.newPage();

  for (const locale of locales) {
    const path = locale === "en" ? "/" : `/${locale}/`;
    const response = await page.goto(`http://localhost:${server.port}${path}`, {
      waitUntil: "networkidle",
    });
    if (!response?.ok()) {
      throw new Error(`${path} returned ${response?.status()}.`);
    }
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    const file = `cv-${locale}.pdf`;
    // npm runs scripts from the project root, so this lands in dist/cv/.
    const pdf = await page.pdf({
      path: `dist/cv/${file}`,
      preferCSSPageSize: true,
    });

    const pages = countPages(pdf);
    console.info(`${file}: ${pages} ${pages === 1 ? "page" : "pages"}`);
    if (locale === "en" && pages > 2) {
      console.warn(
        `${file} has ${pages} pages. The English CV should fit on two.`,
      );
    }
  }
} finally {
  await browser.close();
  await server.stop();
}
