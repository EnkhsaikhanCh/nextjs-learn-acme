import Mux from "@mux/mux-node";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { LessonV2Model } from "@/app/api/graphql/models/lessonV2.model";

// Initialize Mux client with your tokens
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.MUX_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add MUX_WEBHOOK_SECRET from Mux Dashboard to .env or .env.local",
    );
  }

  // Extract headers and raw payload
  const headerPayload = await headers();
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify signature
  try {
    mux.webhooks.verifySignature(body, headerPayload, WEBHOOK_SECRET);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  const { type, data } = payload;

  switch (type) {
    case "video.asset.created": {
      // Optionally handle asset.created
      break;
    }

    case "video.asset.ready": {
      // Find corresponding lesson by upload ID
      const lesson = await LessonV2Model.findOne({
        muxUploadId: data.upload_id,
      }).populate({
        path: "sectionId",
        populate: { path: "courseId", select: "slug" },
      });
      if (!lesson) {
        return new Response("Lesson not found!", { status: 400 });
      }

      // Update asset and playback IDs
      lesson.muxAssetId = data.id;
      lesson.muxPlaybackId = data.playback_ids?.[0]?.id;
      await lesson.save();

      // Revalidate ISR for the edit page
      const courseSlug = lesson.sectionId.courseId.slug;
      revalidatePath(
        `/instructor/courses/${courseSlug}/lesson/${lesson._id}/edit`,
      );
      break;
    }

    case "video.upload.cancelled": {
      const lesson = await LessonV2Model.findOne({
        muxUploadId: data.upload_id,
      });
      if (!lesson) {
        return new Response("Lesson not found!", { status: 400 });
      }
      // Optionally update status
      lesson.isPublished = false;
      await lesson.save();
      break;
    }

    default:
      break;
  }

  return new Response("", { status: 200 });
}
