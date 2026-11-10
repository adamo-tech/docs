// The 1.0 docs are served from the site root; the 0.x docs live under /v0/.
export const versions = [
  { label: "0.x", prefix: "v0/" },
  { label: "1.0", prefix: "" },
];

const latest = versions.find((v) => !v.prefix)!;

export function versionOf(pathname: string) {
  const path = pathname.replace(/^\//, "");
  return versions.find((v) => v.prefix && (path === v.prefix.slice(0, -1) || path.startsWith(v.prefix))) ?? latest;
}

// The same page in another version.
export function pathIn(version: { prefix: string }, pathname: string) {
  const page = pathname.replace(/^\//, "").slice(versionOf(pathname).prefix.length);
  return "/" + version.prefix + page;
}
