import { redis } from "@/lib/redis";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const { email } = await req.json();
  const token = uuidv4();

  // Redis-д 10 минутын хугацаатай хадгална
  await redis.set(`temp-token:${token}`, email, "EX", 600);
  return Response.json({ token });
}
