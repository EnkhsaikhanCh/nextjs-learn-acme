// app/api/mux/token/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { playbackId } = await req.json();
  if (!playbackId) {
    return NextResponse.json({ error: "Missing playbackId" }, { status: 400 });
  }

  const keyId = process.env.MUX_SIGNING_KEY_ID;
  const pkB64 = process.env.MUX_PRIVATE_KEY;
  if (!keyId || !pkB64) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 },
    );
  }

  let secretKey: string;
  try {
    secretKey = Buffer.from(pkB64, "base64").toString("ascii");
  } catch {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 },
    );
  }

  try {
    const token = jwt.sign(
      { sub: playbackId, aud: "v", exp: Math.floor(Date.now() / 1000) + 3600 },
      secretKey,
      { algorithm: "RS256", keyid: keyId },
    );
    return NextResponse.json({ token });
  } catch {
    return NextResponse.json(
      { error: "Could not sign token" },
      { status: 500 },
    );
  }
}
