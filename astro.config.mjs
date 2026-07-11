import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

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
      sidebar: [
        {
          label: "Getting Started",
          items: ["index", "quickstart", "cameras"],
        },
        {
          label: "Building Robots",
          items: ["control", "ros", "data", "state", "discovery"],
        },
        {
          label: "Operating Robots",
          items: ["web-interface", "direct-connection", "operator"],
        },
        {
          label: "SDK References",
          items: ["python-sdk", "rust-sdk", "c-sdk", "typescript-sdk"],
        },
      ],
    }),
  ],
});
