import { defineRouteMiddleware } from "@astrojs/starlight/route-data";
import { versionOf } from "./versions";

// Show only the current version's sidebar group, and keep previous/next links
// within that version.
export const onRequest = defineRouteMiddleware((context) => {
  const route = context.locals.starlightRoute;
  const { label } = versionOf(context.url.pathname);
  const group = route.sidebar.find((entry) => entry.type === "group" && entry.label === label);
  if (group?.type !== "group") return;
  route.sidebar = group.entries;

  const links = [];
  const collect = (entries) => {
    for (const entry of entries) {
      if (entry.type === "link") links.push(entry);
      else collect(entry.entries);
    }
  };
  collect(group.entries);
  const current = links.findIndex((link) => link.isCurrent);
  if (current === -1) return;
  route.pagination.prev = links[current - 1];
  route.pagination.next = links[current + 1];
});
