import {
  EnrollmentV2Status,
  GetMuxTokenResponse,
  UserV2,
  UserV2Role,
} from "@/generated/graphql";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import jwt from "jsonwebtoken";
import { EnrollmentV2Model } from "../../../models";

export const getMuxPlaybackToken = async (
  _: unknown,
  { courseId, playbackId }: { courseId: string; playbackId: string },
  context: { user?: UserV2 },
): Promise<GetMuxTokenResponse> => {
  const { user } = context;

  // ✅ Access control
  await requireAuthAndRolesV2(user, [
    UserV2Role.Student,
    UserV2Role.Instructor,
  ]);

  // ✅ Validate input
  if (!courseId || !playbackId) {
    return {
      success: false,
      message: "Playback ID is required",
      token: null,
    };
  }

  // ✅ Read env
  const keyId = process.env.MUX_SIGNING_KEY_ID;
  const pkB64 = process.env.MUX_PRIVATE_KEY;
  if (!keyId || !pkB64) {
    return {
      success: false,
      message: "Server misconfiguration",
      token: null,
    };
  }

  // ✅ Decode private key
  let secretKey: string;
  try {
    secretKey = Buffer.from(pkB64, "base64").toString("ascii");
  } catch {
    return {
      success: false,
      message: "Invalid private key encoding",
      token: null,
    };
  }

  // ✅ Check user role
  if (user?.role === UserV2Role.Student) {
    const isEnrolled = await EnrollmentV2Model.findOne({
      userId: user._id,
      courseId,
      isDeleted: false,
      status: {
        $in: [EnrollmentV2Status.Active, EnrollmentV2Status.Completed],
      },
    });

    if (!isEnrolled) {
      return {
        success: false,
        message: "You are not enrolled in this course",
        token: null,
      };
    }
  }

  // ✅ Generate JWT
  try {
    const token = jwt.sign(
      {
        sub: playbackId,
        aud: "v",
        exp: Math.floor(Date.now() / 1000) + 1800, // ⏱️ 30 minutes validity
      },
      secretKey,
      { algorithm: "RS256", keyid: keyId },
    );

    return {
      success: true,
      message: "Token generated successfully",
      token,
    };
  } catch {
    return {
      success: false,
      message: "Failed to sign JWT token",
      token: null,
    };
  }
};
