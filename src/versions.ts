// Docs versions. The default version is served from the site root; the others
// mirror its pages under their own prefix.
export const versions = [
  { label: "0.x", prefix: "" },
  { label: "1.0", prefix: "v1/" },
];

export function versionOf(pathname: string) {
  const path = pathname.replace(/^\//, "");
  return versions.find((v) => v.prefix && path.startsWith(v.prefix)) ?? versions[0];
}

// The same page in another version.
export function pathIn(version: { prefix: string }, pathname: string) {
  const page = pathname.replace(/^\//, "").slice(versionOf(pathname).prefix.length);
  return "/" + version.prefix + page;
}
