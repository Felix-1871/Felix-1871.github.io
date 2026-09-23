// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  // Canonical URLs, hreflang and the sitemap are built from this, so it must
  // change to the custom domain once that is set up.
  site: "https://felix-1871.github.io",
  output: "static",
});
