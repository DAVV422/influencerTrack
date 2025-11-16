import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/jsonDb";
import type { Campaign } from "@/lib/types";

export async function GET() {
  const campaigns = readJson<Campaign[]>("campaigns.json");
  return NextResponse.json(campaigns);
}

export async function POST(req: NextRequest) {
  const newCampaign: Campaign = await req.json();
  const campaigns = readJson<Campaign[]>("campaigns.json");

  campaigns.unshift(newCampaign);
  writeJson("campaigns.json", campaigns);

  return NextResponse.json({ success: true, campaign: newCampaign });
}
