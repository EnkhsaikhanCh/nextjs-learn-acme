// app/api/mux/token/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const MUX_SIGNING_KEY_ID = process.env.MUX_SIGNING_KEY_ID!;
const MUX_PRIVATE_KEY = process.env.MUX_PRIVATE_KEY!;

const secretKey = Buffer.from(MUX_PRIVATE_KEY, "base64").toString("ascii");

export async function POST(req: NextRequest) {
  const { playbackId } = await req.json();

  if (!playbackId) {
    return NextResponse.json({ error: "Missing playbackId" }, { status: 400 });
  }

  try {
    const token = jwt.sign(
      {
        sub: playbackId,
        aud: "v",
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
        kid: MUX_SIGNING_KEY_ID,
      },
      secretKey,
      {
        algorithm: "RS256",
        keyid: MUX_SIGNING_KEY_ID,
      },
    );

    return NextResponse.json({ token });
  } catch {
    return NextResponse.json(
      { error: "Could not sign token" },
      { status: 500 },
    );
  }
}
