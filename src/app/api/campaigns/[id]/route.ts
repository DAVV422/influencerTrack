import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/jsonDb";
import type { Campaign } from "@/lib/types";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json(); // por ejemplo: { influencerIds: ["id1", "id2"] }

  const campaigns = readJson<Campaign[]>("campaigns.json");
  const campaign = campaigns.find(c => c.id === id);
  if (!campaign) return NextResponse.json({ error: "Campaign no encontrada" }, { status: 404 });

  Object.assign(campaign, data); // actualiza las propiedades enviadas

  writeJson("campaigns.json", campaigns);

  return NextResponse.json({ success: true, campaign });
}
