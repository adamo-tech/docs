import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// Sidebar sections for one docs version, whose pages live under `prefix`.
// The 1.0 docs (no prefix) have pages the 0.x docs lack.
const sections = (prefix) =>
  [
    { label: "Getting Started", items: ["index", "quickstart", "cameras", ...(prefix ? [] : ["local-streaming"])] },
    {
      label: "Building Robots",
      items: ["control", "audio", "ros", "data", "recording", ...(prefix ? [] : ["training", "inference"]), "state", "discovery"],
    },
    { label: "Operating Robots", items: ["web-interface", "direct-connection", "operator"] },
    { label: "SDK References", items: ["python-sdk", "rust-sdk", "c-sdk", "typescript-sdk"] },
  ].map(({ label, items }) => ({
    label,
    // The introductions live at / and /v0/.
    items: items.map((slug) => (slug === "index" ? (prefix ? prefix.slice(0, -1) : "index") : prefix + slug)),
  }));

// The 1.0 docs used to live under /v1/; keep those links working.
const v1Pages = sections("").flatMap(({ items }) => items).map((slug) => (slug === "index" ? "" : slug));
const v1Redirects = Object.fromEntries(
  v1Pages.map((slug) => [slug ? `/v1/${slug}` : "/v1", slug ? `/${slug}/` : "/"]),
);

export default defineConfig({
  site: "https://docs.adamohq.com",
  redirects: v1Redirects,
  integrations: [
    starlight({
      title: "Adamo",
      logo: {
        src: "./src/assets/logo.svg",
        alt: "Adamo",
        replacesTitle: true,
      },
      expressiveCode: {
        themes: ["ayu-mirage"],
        styleOverrides: {
          frames: {
            terminalTitlebarDotsOpacity: "0",
            editorTitlebarDotsOpacity: "0",
          },
        },
      },
      customCss: ["./src/styles/custom.css"],
      routeMiddleware: "./src/routeData.ts",
      components: {
        Header: "./src/components/Header.astro",
        Sidebar: "./src/components/Sidebar.astro",
        ThemeProvider: "./src/components/ThemeProvider.astro",
        ThemeSelect: "./src/components/ThemeSelect.astro",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/adamo-tech",
        },
      ],
      // One top-level group per docs version; src/routeData.ts shows only the
      // group for the version being viewed.
      sidebar: [
        { label: "0.x", items: sections("v0/") },
        { label: "1.0", items: sections("") },
      ],
    }),
  ],
});
