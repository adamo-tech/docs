import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ site }) => {
  const pages = (await getCollection("docs")).filter((page) => !page.slug.startsWith("v0"));
  const lines = pages.map((page) => `- [${page.data.title}](${new URL(`${page.slug}.md`, site)}): ${page.data.description ?? ""}`);
  return new Response(`# Adamo\n\n> Adamo streams, teleoperates and records robots, and trains and serves policies on the recordings. Each page below is plain markdown.\n\n${lines.join("\n")}\n`);
};
