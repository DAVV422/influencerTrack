import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/jsonDb";
import type { Publication } from "@/lib/types";

export async function GET() {
  const publications = readJson<Publication[]>("publications.json");
  return NextResponse.json(publications);
}

export async function POST(req: NextRequest) {
  const newPublication: Publication = await req.json();
  const publications = readJson<Publication[]>("publications.json");

  publications.unshift(newPublication); // agregamos al inicio
  writeJson("publications.json", publications);

  return NextResponse.json({ success: true, publication: newPublication });
}
