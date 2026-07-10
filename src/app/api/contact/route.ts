import { NextRequest, NextResponse } from "next/server";
import { appendJsonRecord } from "@/lib/json-store";

const MESSAGES_FILE = "contact-messages.json";

interface ContactMessage {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  message: string;
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body?.name?.trim() || !body?.email?.trim() || !body?.message?.trim()) {
    return NextResponse.json(
      { error: "Please fill in your name, email, and message." },
      { status: 400 }
    );
  }

  const entry: ContactMessage = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: body.name,
    email: body.email,
    message: body.message,
  };

  await appendJsonRecord<ContactMessage>(MESSAGES_FILE, entry);

  return NextResponse.json({ ok: true });
}
