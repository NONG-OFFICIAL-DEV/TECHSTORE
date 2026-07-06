import { NextRequest, NextResponse } from "next/server";
import { parseCoordsFromGoogleMapsUrl, isGoogleMapsUrl } from "@/lib/google-maps-link";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url || !isGoogleMapsUrl(url)) {
    return NextResponse.json(
      { error: "Please paste a valid Google Maps link." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    const finalUrl = response.url || url;
    let coords = parseCoordsFromGoogleMapsUrl(finalUrl);

    // Some short links land on an interstitial page rather than encoding
    // coordinates directly in the final URL — check the page body too.
    if (!coords) {
      const html = await response.text();
      coords = parseCoordsFromGoogleMapsUrl(html);
    }

    if (!coords) {
      return NextResponse.json(
        {
          error:
            "Couldn't find coordinates in that link. Please re-share the location from the Google Maps app and try again.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json(coords);
  } catch (error) {
    console.error("Failed to resolve Google Maps link:", error);
    return NextResponse.json(
      { error: "Couldn't open that link. Please check it and try again." },
      { status: 500 }
    );
  }
}