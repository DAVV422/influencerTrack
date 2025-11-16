import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/jsonDb";
import type { Publication } from "@/lib/types";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();

  const publications = readJson<Publication[]>("publications.json");
  const publication = publications.find(p => p.id === id);
  if (!publication) return NextResponse.json({ error: "Publication no encontrada" }, { status: 404 });

  Object.assign(publication, data);

  writeJson("publications.json", publications);

  return NextResponse.json({ success: true, publication });
}
