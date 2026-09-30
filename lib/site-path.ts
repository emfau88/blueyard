/** Native anchors and public assets need the same prefix as the export. */
export function sitePath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;
}
