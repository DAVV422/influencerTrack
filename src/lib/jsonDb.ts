import fs from "fs";
import path from "path";

export function readJson<T>(fileName: string): T {
  const filePath = path.join(process.cwd(), "src", "data", fileName);
  try {
    const json = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(json) as T;
  } catch (err) {
    console.error(`Error leyendo ${fileName}:`, err);
    return [] as unknown as T;
  }
}

export function writeJson<T>(fileName: string, data: T) {
  const filePath = path.join(process.cwd(), "src", "data", fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
