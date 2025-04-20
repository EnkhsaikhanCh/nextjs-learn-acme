import { User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { video } from "@/lib/mux";
import { GraphQLError } from "graphql";

export const createMuxUploadUrl = async (
  _: unknown,
  args: {
    playbackPolicy: ("SIGNED" | "PUBLIC")[];
    corsOrigin: string;
  },
  context: { user?: User },
) => {
  const { user } = context;
  await requireAuthAndRoles(user, ["INSTRUCTOR"]);

  const { playbackPolicy = ["SIGNED"], corsOrigin = "*" } = args;

  const playback_policies = playbackPolicy.map(
    (p) => p.toLowerCase() as "public" | "signed",
  );

  try {
    const upload = await video.uploads.create({
      cors_origin: corsOrigin,
      new_asset_settings: {
        playback_policies,
      },
    });

    return {
      uploadId: upload.id,
      uploadUrl: upload.url,
    };
  } catch (error) {
    console.error("Mux upload creation failed:", error);

    throw new GraphQLError("Failed to create Mux upload URL", {
      extensions: { code: "MUX_UPLOAD_ERROR" },
    });
  }
};
