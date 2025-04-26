// lib/mux.ts
import Mux from "@mux/mux-node";

if (
  !process.env.MUX_TOKEN_ID ||
  !process.env.MUX_TOKEN_SECRET ||
  !process.env.MUX_SIGNING_KEY_ID ||
  !process.env.MUX_PRIVATE_KEY
) {
  throw new Error(
    "Missing one of MUX_TOKEN_ID, MUX_TOKEN_SECRET, MUX_SIGNING_KEY_ID or MUX_PRIVATE_KEY",
  );
}

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
  jwtSigningKey: process.env.MUX_PRIVATE_KEY.replace(/\\n/g, "\n"),
});

export const video = mux.video;
export const jwt = mux.jwt;
