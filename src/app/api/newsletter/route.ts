import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/json-store";

const SUBSCRIBERS_FILE = "newsletter-subscribers.json";

interface Subscriber {
  email: string;
  subscribedAt: string;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = body?.email?.trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const subscribers = await readJsonFile<Subscriber[]>(SUBSCRIBERS_FILE, []);

  if (!subscribers.some((s) => s.email === email)) {
    subscribers.push({ email, subscribedAt: new Date().toISOString() });
    await writeJsonFile(SUBSCRIBERS_FILE, subscribers);
  }

  return NextResponse.json({ ok: true });
}
