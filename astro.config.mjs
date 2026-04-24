import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://docs.adamohq.com",
  integrations: [
    starlight({
      title: "Adamo",
      logo: {
        src: "./src/assets/logo.svg",
      },
      expressiveCode: {
        styleOverrides: {
          frames: {
            terminalTitlebarDotsOpacity: "0",
            editorTitlebarDotsOpacity: "0",
          },
        },
      },
      customCss: ["./src/styles/custom.css"],
      components: {
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
          items: ["control", "data", "discovery"],
        },
        {
          label: "Operating Robots",
          items: ["web-interface", "operator"],
        },
        {
          label: "SDK References",
          items: ["python-sdk", "rust-sdk", "c-sdk", "typescript-sdk"],
        },
        {
          label: "Advanced",
          items: ["config-reference"],
        },
      ],
    }),
  ],
});
