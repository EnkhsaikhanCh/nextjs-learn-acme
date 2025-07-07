import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import { EnrollmentV2Model } from "@/app/api/graphql/models";
import jwt from "jsonwebtoken";
import { UserV2Role } from "@/generated/graphql";
import { getMuxPlaybackToken } from "@/app/api/graphql/resolvers/queries/mux/get-mux-playback-token-query";

jest.mock("../../../../../src/lib/auth-userV2-utils", () => ({
  requireAuthAndRolesV2: jest.fn(),
}));
jest.mock("../../../../../src/app/api/graphql/models", () => ({
  EnrollmentV2Model: { findOne: jest.fn() },
}));
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("getMuxPlaybackToken", () => {
  const student = {
    _id: "user1",
    email: "s@example.com",
    isVerified: true,
    role: UserV2Role.Student,
  };

  const instructor = {
    _id: "user2",
    email: "i@example.com",
    isVerified: true,
    role: UserV2Role.Instructor,
  };

  const playbackId = "mux123";
  const courseId = "course123";

  const envBackup = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...envBackup,
      MUX_SIGNING_KEY_ID: "kid",
      MUX_PRIVATE_KEY: Buffer.from("privateKey").toString("base64"),
    };
    (requireAuthAndRolesV2 as jest.Mock).mockResolvedValue(undefined);
  });

  afterAll(() => {
    process.env = envBackup;
  });

  it("throws if authentication fails", async () => {
    (requireAuthAndRolesV2 as jest.Mock).mockRejectedValue(
      new Error("Unauthorized"),
    );
    await expect(
      getMuxPlaybackToken(null, { courseId, playbackId }, { user: student }),
    ).rejects.toThrow("Unauthorized");
  });

  it("returns error if missing playbackId", async () => {
    const res = await getMuxPlaybackToken(
      null,
      { courseId, playbackId: "" },
      { user: student },
    );
    expect(res).toEqual({
      success: false,
      message: "Playback ID is required",
      token: null,
    });
  });

  it("returns error if env is misconfigured", async () => {
    delete process.env.MUX_SIGNING_KEY_ID;
    const res = await getMuxPlaybackToken(
      null,
      { courseId, playbackId },
      { user: student },
    );
    expect(res).toEqual({
      success: false,
      message: "Server misconfiguration",
      token: null,
    });
  });

  it("returns error if base64 decoding fails", async () => {
    // valid env
    process.env.MUX_PRIVATE_KEY = "invalid_b64";

    // mock enrollment success
    (EnrollmentV2Model.findOne as jest.Mock).mockResolvedValue({
      _id: "enroll1",
    });

    // 🧨 override Buffer.from to throw error
    const origBufferFrom = Buffer.from;
    jest.spyOn(Buffer, "from").mockImplementation(() => {
      throw new Error("decoding failed");
    });

    const res = await getMuxPlaybackToken(
      null,
      { courseId, playbackId },
      { user: student },
    );

    expect(res.success).toBe(false);
    expect(res.message).toContain("Invalid private key encoding");

    // 🧹 Restore Buffer.from
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions, @typescript-eslint/no-explicit-any
    (Buffer.from as any).mockRestore?.() ?? (Buffer.from = origBufferFrom);
  });

  it("rejects student if not enrolled", async () => {
    (EnrollmentV2Model.findOne as jest.Mock).mockResolvedValue(null);
    const res = await getMuxPlaybackToken(
      null,
      { courseId, playbackId },
      { user: student },
    );
    expect(EnrollmentV2Model.findOne).toHaveBeenCalledWith({
      userId: student._id,
      courseId,
      isDeleted: false,
      status: { $in: ["ACTIVE", "COMPLETED"] },
    });
    expect(res).toEqual({
      success: false,
      message: "You are not enrolled in this course",
      token: null,
    });
  });

  it("allows instructor without enrollment check", async () => {
    (jwt.sign as jest.Mock).mockReturnValue("signed.jwt.token");
    const res = await getMuxPlaybackToken(
      null,
      { courseId, playbackId },
      { user: instructor },
    );
    expect(EnrollmentV2Model.findOne).not.toHaveBeenCalled();
    expect(res).toEqual({
      success: true,
      message: "Token generated successfully",
      token: "signed.jwt.token",
    });
  });

  it("allows student if enrolled", async () => {
    (EnrollmentV2Model.findOne as jest.Mock).mockResolvedValue({ _id: "en1" });
    (jwt.sign as jest.Mock).mockReturnValue("student.token");
    const res = await getMuxPlaybackToken(
      null,
      { courseId, playbackId },
      { user: student },
    );
    expect(res.token).toBe("student.token");
    expect(res.success).toBe(true);
  });

  it("returns error if JWT signing fails", async () => {
    (jwt.sign as jest.Mock).mockImplementation(() => {
      throw new Error("sign fail");
    });

    (EnrollmentV2Model.findOne as jest.Mock).mockResolvedValue({ _id: "en1" });

    const res = await getMuxPlaybackToken(
      null,
      { courseId, playbackId },
      { user: student },
    );
    expect(res).toEqual({
      success: false,
      message: "Failed to sign JWT token",
      token: null,
    });
  });
});
