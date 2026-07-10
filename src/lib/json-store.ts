import fs from "node:fs/promises";
import path from "node:path";

// Small local-file "database" for a store this size — avoids pulling in a
// real DB just to persist orders/messages. Not safe under concurrent writes;
// fine for low-traffic use, not for production scale.
const DATA_DIR = path.join(process.cwd(), ".data");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readJsonFile<T>(fileName: string, fallback: T): Promise<T> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, fileName);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw error;
  }
}

export async function writeJsonFile<T>(fileName: string, data: T): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function appendJsonRecord<T>(fileName: string, record: T): Promise<void> {
  const records = await readJsonFile<T[]>(fileName, []);
  records.push(record);
  await writeJsonFile(fileName, records);
}
