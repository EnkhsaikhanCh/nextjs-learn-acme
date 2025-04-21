import Mux from "@mux/mux-node";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { LessonV2Model } from "@/app/api/graphql/models/lessonV2.model";

const mux = new Mux();

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.MUX_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add MUX_WEBHOOK_SECRET from Mux Dashboard to .env or .env.local",
    );
  }

  const headerPayload = await headers();
  const payload = await req.json();
  const body = JSON.stringify(payload);

  try {
    mux.webhooks.verifySignature(body, headerPayload, WEBHOOK_SECRET);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  const { type, data } = payload;

  try {
    switch (type) {
      case "video.asset.created":
      case "video.asset.ready": {
        const lesson = await LessonV2Model.findOne({
          passthrough: data.passthrough,
        }).populate({
          path: "sectionId",
          populate: { path: "courseId", select: "slug" },
        });

        if (!lesson) {
          return new Response("Lesson not found!", { status: 400 });
        }

        if (type === "video.asset.created") {
          lesson.status = data.status;
        }

        if (type === "video.asset.ready") {
          lesson.status = data.status;
          lesson.duration = data.duration;
          lesson.muxAssetId = data.id;
          lesson.muxPlaybackId = data.playback_ids?.[0]?.id;
        }

        await lesson.save();

        const courseSlug = lesson.sectionId?.courseId?.slug;
        if (courseSlug) {
          revalidatePath(
            `/instructor/courses/${courseSlug}/lesson/${lesson._id}/edit`,
          );
        }

        break;
      }

      case "video.upload.cancelled": {
        const lesson = await LessonV2Model.findOne({
          passthrough: data.passthrough,
        });

        if (!lesson) {
          return new Response("Lesson not found!", { status: 400 });
        }

        lesson.isPublished = false;

        await lesson.save();

        break;
      }

      default:
        break;
    }

    return new Response("", { status: 200 });
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
}
