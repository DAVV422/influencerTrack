import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/jsonDb";
import type { Influencer } from "@/lib/types";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const data = await req.json(); // { clic_descargas: { instagram: 1 } }

  const influencers = readJson<Influencer[]>("influencers.json");
  const influencer = influencers.find(i => i.id === id);
  if (!influencer) return NextResponse.json({ error: "Influencer no encontrado" }, { status: 404 });

  // Actualiza clic_descargas
  influencer.clic_descargas = {
    ...influencer.clic_descargas,
    ...data.clic_descargas,
  };

  writeJson("influencers.json", influencers);

  return NextResponse.json({ success: true, influencer });
}
