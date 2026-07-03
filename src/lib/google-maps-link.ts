/**
 * Utilities for extracting coordinates from Google Maps share links.
 *
 * Long-form links (e.g. https://www.google.com/maps/place/.../@11.56,104.92,17z)
 * already contain coordinates and can be parsed with no network call.
 *
 * Shortened links (e.g. https://maps.app.goo.gl/xxxx) redirect to a long-form
 * URL — the browser can't read where a cross-origin redirect lands, so those
 * must be resolved server-side (see /api/resolve-map-link).
 */

export function parseCoordsFromGoogleMapsUrl(
  url: string
): { lat: number; lng: number } | null {
  const patterns = [
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/, // precise pin coords embedded in place data
    /@(-?\d+\.\d+),(-?\d+\.\d+)/, // map center in the URL path
    /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/, // simple pin query param
    /[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/, // legacy ll param
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        return { lat, lng };
      }
    }
  }

  return null;
}

export function isGoogleMapsShortLink(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname === "maps.app.goo.gl" || hostname === "goo.gl";
  } catch {
    return false;
  }
}

export function isGoogleMapsUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return (
      hostname === "maps.app.goo.gl" ||
      hostname === "goo.gl" ||
      hostname === "maps.google.com" ||
      hostname === "google.com" ||
      hostname === "www.google.com"
    );
  } catch {
    return false;
  }
}