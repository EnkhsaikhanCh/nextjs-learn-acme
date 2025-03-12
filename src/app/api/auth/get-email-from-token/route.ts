import { redis } from "@/lib/redis";

export async function POST(req: Request) {
  const { token } = await req.json();
  const email = await redis.get(`temp-token:${token}`);

  if (!email) {
    return new Response(
      JSON.stringify({ error: "Token буруу эсвэл хугацаа дууссан" }),
      {
        status: 400,
      },
    );
  }

  return Response.json({ email });
}
