// __tests__/api/graphql/queries/user/get-instructor-user-v2-info-by-id-query.spec.ts
import { GraphQLError } from "graphql";
import { UserV2Role, UserV2 } from "@/generated/graphql";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import { getInstructorUserV2InfoById } from "@/app/api/graphql/resolvers/queries/userV2/get-instructor-user-v2-info-by-id-query";
import { UserV2Model } from "@/app/api/graphql/models/userV2.model";

jest.mock("../../../../../src/lib/auth-userV2-utils", () => ({
  requireAuthAndRolesV2: jest.fn(),
}));
jest.mock("../../../../../src/app/api/graphql/models/userV2.model", () => ({
  UserV2Model: { findById: jest.fn() },
}));

describe("getInstructorUserV2InfoById", () => {
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
      new GraphQLError("Unauthenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      }),
    );
    await expect(
      getInstructorUserV2InfoById(null, { _id: "any" }, { user: instructor }),
    ).rejects.toThrow("Unauthenticated");
  });

  it("throws USER_NOT_FOUND if no instructor is found", async () => {
    (UserV2Model.findById as jest.Mock).mockResolvedValue(null);
    await expect(
      getInstructorUserV2InfoById(
        null,
        { _id: "nonexistent" },
        { user: instructor },
      ),
    ).rejects.toMatchObject({
      message: "Instructor not found.",
      extensions: { code: "USER_NOT_FOUND" },
    });
  });

  it("throws FORBIDDEN if user requests someone else's info", async () => {
    const other = { _id: "other", name: "Other" };
    (UserV2Model.findById as jest.Mock).mockResolvedValue(other);
    await expect(
      getInstructorUserV2InfoById(null, { _id: "other" }, { user: instructor }),
    ).rejects.toMatchObject({
      message: "Access denied.",
      extensions: { code: "FORBIDDEN" },
    });
  });

  it("returns the instructor when IDs match", async () => {
    const found = { _id: instructor._id, name: "Me" };
    (UserV2Model.findById as jest.Mock).mockResolvedValue(found);
    const result = await getInstructorUserV2InfoById(
      null,
      { _id: instructor._id },
      { user: instructor },
    );
    expect(requireAuthAndRolesV2).toHaveBeenCalledWith(instructor, [
      UserV2Role.Instructor,
    ]);
    expect(UserV2Model.findById).toHaveBeenCalledWith(instructor._id);
    expect(result).toBe(found);
  });

  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (UserV2Model.findById as jest.Mock).mockRejectedValue(new Error("DB fail"));
    await expect(
      getInstructorUserV2InfoById(
        null,
        { _id: instructor._id },
        { user: instructor },
      ),
    ).rejects.toMatchObject({
      message: "Failed to fetch instructor.",
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  });
});
