// @ts-check
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  // Canonical URLs, hreflang, Open Graph and the sitemap are built from this.
  site: "https://felix1871.moe",
  output: "static",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "pl"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: { en: "en", de: "de", pl: "pl" },
      },
    }),
  ],
});
