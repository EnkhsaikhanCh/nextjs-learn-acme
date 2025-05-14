// __tests__/api/graphql/mutations/userV2/update-instructor-profile-picture-mutation.spec.ts
import { updateInstructorProfilePicture } from "@/app/api/graphql/resolvers/mutations/userV2/update-instructor-profile-picture-mutation";
import { UserV2Model } from "@/app/api/graphql/models";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import { cloudinary } from "@/lib/cloudinary";
import {
  UploadProfilePictureInput,
  UpdateUserV2Response,
  UserV2,
  UserV2Role,
} from "@/generated/graphql";

jest.mock("../../../../../src/lib/auth-userV2-utils", () => ({
  requireAuthAndRolesV2: jest.fn(),
}));
jest.mock("../../../../../src/app/api/graphql/models", () => ({
  UserV2Model: { findById: jest.fn() },
}));
jest.mock("../../../../../src/lib/cloudinary", () => ({
  cloudinary: { uploader: { destroy: jest.fn() } },
}));

describe("updateInstructorProfilePicture", () => {
  const instructor: UserV2 = {
    _id: "inst-1",
    email: "inst@example.com",
    role: UserV2Role.Instructor,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const validInput: UploadProfilePictureInput = {
    publicId: "valid12345",
    width: 200,
    height: 200,
    format: "png",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (requireAuthAndRolesV2 as jest.Mock).mockResolvedValue(undefined);
  });

  it("throws if auth fails", async () => {
    (requireAuthAndRolesV2 as jest.Mock).mockRejectedValue(
      new Error("No auth"),
    );
    await expect(
      updateInstructorProfilePicture(
        null,
        { _id: instructor._id, input: validInput },
        { user: instructor },
      ),
    ).rejects.toThrow("No auth");
  });

  it("returns error if _id is missing", async () => {
    const res = await updateInstructorProfilePicture(
      null,
      { _id: "", input: validInput },
      { user: instructor },
    );
    expect(res).toEqual<UpdateUserV2Response>({
      success: false,
      message: "User ID is missing.",
    });
  });

  it("returns validation error on bad input", async () => {
    const res = await updateInstructorProfilePicture(
      null,
      { _id: instructor._id, input: { ...validInput, publicId: "sh" } },
      { user: instructor },
    );
    expect(res).toEqual<UpdateUserV2Response>({
      success: false,
      message: expect.stringMatching(/at least 5/),
    });
  });

  it("returns not found when user does not exist", async () => {
    (UserV2Model.findById as jest.Mock).mockResolvedValue(null);
    const res = await updateInstructorProfilePicture(
      null,
      { _id: instructor._id, input: validInput },
      { user: instructor },
    );
    expect(UserV2Model.findById).toHaveBeenCalledWith(instructor._id);
    expect(res).toEqual<UpdateUserV2Response>({
      success: false,
      message: "User not found.",
    });
  });

  it("returns access denied when updating another's picture", async () => {
    const other = { _id: "other", save: jest.fn() };
    (UserV2Model.findById as jest.Mock).mockResolvedValue(other);
    const res = await updateInstructorProfilePicture(
      null,
      { _id: other._id, input: validInput },
      { user: instructor },
    );
    expect(res).toEqual<UpdateUserV2Response>({
      success: false,
      message: "Access denied: cannot update another instructor’s picture.",
    });
  });

  it("skips destroy if no previous picture and saves successfully", async () => {
    const userRec = {
      _id: instructor._id,
      save: jest.fn(),
      profilePicture: undefined,
    };
    (UserV2Model.findById as jest.Mock).mockResolvedValue(userRec);
    const res = await updateInstructorProfilePicture(
      null,
      { _id: instructor._id, input: validInput },
      { user: instructor },
    );
    expect(cloudinary.uploader.destroy).not.toHaveBeenCalled();
    expect(userRec.profilePicture).toEqual(validInput);
    expect(userRec.save).toHaveBeenCalled();
    expect(res).toEqual<UpdateUserV2Response>({
      success: true,
      message: "Profile picture updated successfully.",
    });
  });

  it("destroys old picture when publicId differs", async () => {
    const userRec = {
      _id: instructor._id,
      profilePicture: {
        publicId: "old123",
        width: 10,
        height: 10,
        format: "jpg",
      },
      save: jest.fn(),
    };
    (UserV2Model.findById as jest.Mock).mockResolvedValue(userRec);
    const res = await updateInstructorProfilePicture(
      null,
      { _id: instructor._id, input: validInput },
      { user: instructor },
    );
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("old123");
    expect(userRec.profilePicture).toEqual(validInput);
    expect(userRec.save).toHaveBeenCalled();
    expect(res.success).toBe(true);
  });

  it("returns error if destroy fails", async () => {
    const userRec = {
      _id: instructor._id,
      profilePicture: {
        publicId: "old123",
        width: 10,
        height: 10,
        format: "jpg",
      },
      save: jest.fn(),
    };
    (UserV2Model.findById as jest.Mock).mockResolvedValue(userRec);
    (cloudinary.uploader.destroy as jest.Mock).mockRejectedValue(
      new Error("X"),
    );
    const res = await updateInstructorProfilePicture(
      null,
      { _id: instructor._id, input: validInput },
      { user: instructor },
    );
    expect(res).toEqual<UpdateUserV2Response>({
      success: false,
      message: "Failed to delete previous thumbnail.",
    });
    expect(userRec.save).not.toHaveBeenCalled();
  });

  it("handles unexpected errors gracefully", async () => {
    (UserV2Model.findById as jest.Mock).mockImplementation(() => {
      throw new Error("DB");
    });
    const res = await updateInstructorProfilePicture(
      null,
      { _id: instructor._id, input: validInput },
      { user: instructor },
    );
    expect(res).toEqual<UpdateUserV2Response>({
      success: false,
      message: "Internal error: DB",
    });
  });
});
