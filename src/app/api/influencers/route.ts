import { NextRequest, NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/jsonDb";
import type { Influencer } from "@/lib/types";

export async function GET() {
  const influencers = readJson<Influencer[]>("influencers.json");
  return NextResponse.json(influencers);
}

export async function POST(req: NextRequest) {
  const newInfluencer: Influencer = await req.json();
  const influencers = readJson<Influencer[]>("influencers.json");

  influencers.unshift(newInfluencer);
  writeJson("influencers.json", influencers);

  return NextResponse.json({ success: true, influencer: newInfluencer });
}
