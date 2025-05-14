// __tests__/api/graphql/mutations/userV2/update-instructor-user-v2-mutation.spec.ts
import { updateInstructorUserV2 } from "@/app/api/graphql/resolvers/mutations/userV2/update-instructor-user-v2-mutation";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import { UserV2Model } from "@/app/api/graphql/models";
import { UserV2, UserV2Role, UpdateUserV2Response } from "@/generated/graphql";

jest.mock("../../../../../src/lib/auth-userV2-utils", () => ({
  requireAuthAndRolesV2: jest.fn(),
}));
jest.mock("../../../../../src/app/api/graphql/models", () => ({
  UserV2Model: { findById: jest.fn() },
}));

describe("updateInstructorUserV2", () => {
  const instructor: UserV2 = {
    _id: "inst1",
    email: "inst@example.com",
    role: UserV2Role.Instructor,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (requireAuthAndRolesV2 as jest.Mock).mockResolvedValue(undefined);
  });

  it("throws if authentication fails", async () => {
    (requireAuthAndRolesV2 as jest.Mock).mockRejectedValue(
      new Error("No auth"),
    );
    await expect(
      updateInstructorUserV2(null, { input: {} }, { user: instructor }),
    ).rejects.toThrow("No auth");
  });

  it("returns validation error when fullName is empty string", async () => {
    const res = await updateInstructorUserV2(
      null,
      { input: { fullName: "" } },
      { user: instructor },
    );
    expect(res).toEqual<UpdateUserV2Response>({
      success: false,
      message: "Instructor full name is required.",
    });
  });

  it("returns validation error when bio is empty string", async () => {
    const res = await updateInstructorUserV2(
      null,
      { input: { bio: "" } },
      { user: instructor },
    );
    expect(res).toEqual<UpdateUserV2Response>({
      success: false,
      message: "Instructor profile bio is required.",
    });
  });

  it("returns user not found when findById returns null", async () => {
    (UserV2Model.findById as jest.Mock).mockResolvedValue(null);
    const res = await updateInstructorUserV2(
      null,
      { input: { fullName: "New Name" } },
      { user: instructor },
    );
    expect(UserV2Model.findById).toHaveBeenCalledWith(instructor._id);
    expect(res).toEqual<UpdateUserV2Response>({
      success: false,
      message: "User not found.",
    });
  });

  it("updates only provided fields and returns success", async () => {
    const existing = { fullName: "Old", bio: "OldBio", save: jest.fn() };
    (UserV2Model.findById as jest.Mock).mockResolvedValue(existing);
    const res = await updateInstructorUserV2(
      null,
      { input: { fullName: "NewName" } },
      { user: instructor },
    );
    expect(existing.fullName).toBe("NewName");
    expect(existing.bio).toBe("OldBio");
    expect(existing.save).toHaveBeenCalled();
    expect(res).toEqual<UpdateUserV2Response>({
      success: true,
      message: "Instructor profile updated successfully.",
    });
  });

  it("returns internal error when save throws", async () => {
    const existing = {
      fullName: "F",
      bio: "B",
      save: jest.fn().mockRejectedValue(new Error("db fail")),
    };
    (UserV2Model.findById as jest.Mock).mockResolvedValue(existing);
    const res = await updateInstructorUserV2(
      null,
      { input: { bio: "NewBio" } },
      { user: instructor },
    );
    expect(res).toEqual<UpdateUserV2Response>({
      success: false,
      message: "Internal error: db fail",
    });
  });
});
