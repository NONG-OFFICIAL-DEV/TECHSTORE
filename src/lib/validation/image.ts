/** next/image throws a hard runtime error for any src that isn't a root-relative
 * path or an absolute http(s) URL — validate at the API boundary so bad input
 * can never reach the database and crash a page that renders it later. */
export function isValidImagePath(value: string): boolean {
  if (value.startsWith("/")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
