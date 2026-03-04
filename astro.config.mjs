import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://docs.adamohq.com",
  integrations: [
    starlight({
      title: "Adamo",
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
          label: "Using Adamo",
          items: ["web-interface", "control"],
        },
        {
          label: "SDKs",
          items: ["python-sdk", "typescript-sdk"],
        },
        {
          label: "Reference",
          items: ["config-reference"],
        },
      ],
    }),
  ],
});
