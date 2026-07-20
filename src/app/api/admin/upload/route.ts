import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/dal";
import { getSupabaseAdmin, IMAGE_BUCKET } from "@/lib/supabase-admin";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_FOLDERS = new Set(["products", "categories"]);

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  const folder = formData?.get("folder");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WEBP, or GIF images are allowed." },
      { status: 400 }
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Image must be 5MB or smaller." }, { status: 400 });
  }

  const safeFolder = typeof folder === "string" && ALLOWED_FOLDERS.has(folder) ? folder : "misc";
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${safeFolder}/${randomUUID()}.${ext}`;

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    return NextResponse.json(
      { error: "Image uploads aren't configured yet. Set up Supabase Storage first." },
      { status: 503 }
    );
  }

  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    console.error("Supabase Storage upload failed:", error);
    return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
  }

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
