import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// Sidebar sections for one docs version, whose pages live under `prefix`.
const sections = (prefix) =>
  [
    { label: "Getting Started", items: ["index", "quickstart", "cameras", ...(prefix ? ["local-streaming"] : [])] },
    {
      label: "Building Robots",
      items: ["control", "audio", "ros", "data", "recording", ...(prefix ? ["training"] : []), "state", "discovery"],
    },
    { label: "Operating Robots", items: ["web-interface", "direct-connection", "operator"] },
    { label: "SDK References", items: ["python-sdk", "rust-sdk", "c-sdk", "typescript-sdk"] },
  ].map(({ label, items }) => ({
    label,
    // A version's index page has the slug "v1", not "v1/index".
    items: items.map((slug) => (prefix && slug === "index" ? prefix.slice(0, -1) : prefix + slug)),
  }));

export default defineConfig({
  site: "https://docs.adamohq.com",
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
        { label: "0.x", items: sections("") },
        { label: "1.0", items: sections("v1/") },
      ],
    }),
  ],
});
