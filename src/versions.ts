// The site root redirects to 1.0. Legacy pages retain their unprefixed URLs,
// with the 0.x introduction available at /v0/.
export const versions = [
  { label: "0.x", prefix: "" },
  { label: "1.0", prefix: "v1/" },
];

export function versionOf(pathname: string) {
  const path = pathname.replace(/^\//, "");
  return versions.find((v) => v.prefix && (path === v.prefix.slice(0, -1) || path.startsWith(v.prefix))) ?? versions[0];
}

// The same page in another version.
export function pathIn(version: { prefix: string }, pathname: string) {
  if (["", "v0", "v1"].includes(pathname.replace(/^\/+|\/+$/g, ""))) {
    return version.prefix ? "/" + version.prefix : "/v0/";
  }
  const page = pathname.replace(/^\//, "").slice(versionOf(pathname).prefix.length);
  return "/" + version.prefix + page;
}
