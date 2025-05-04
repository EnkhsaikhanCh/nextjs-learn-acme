// __tests__/api/graphql/queries/user/get-user-v2-by-id-query.spec.ts
import { GraphQLError } from "graphql";
import { UserV2, UserV2Role } from "@/generated/graphql";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import { getUserV2ById } from "@/app/api/graphql/resolvers/queries/userV2/get-user-v2-by-id-query";
import { UserV2Model } from "@/app/api/graphql/models/userV2.model";

jest.mock("../../../../../src/lib/auth-userV2-utils", () => ({
  requireAuthAndRolesV2: jest.fn(),
}));
jest.mock("../../../../../src/app/api/graphql/models/userV2.model", () => ({
  UserV2Model: { findById: jest.fn() },
}));

describe("getUserV2ById", () => {
  const contextUser: UserV2 = {
    _id: "user1",
    email: "user1@example.com",
    role: UserV2Role.Student,
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
      getUserV2ById(null, { _id: "any" }, { user: contextUser }),
    ).rejects.toThrow("Unauthenticated");
  });

  it("throws USER_NOT_FOUND if user does not exist", async () => {
    (UserV2Model.findById as jest.Mock).mockResolvedValue(null);
    await expect(
      getUserV2ById(null, { _id: "notfound" }, { user: contextUser }),
    ).rejects.toMatchObject({
      message: "User not found.",
      extensions: { code: "USER_NOT_FOUND" },
    });
  });

  it("throws FORBIDDEN if requesting another user's data", async () => {
    const otherUser = { _id: "other", email: "o@example.com" };
    (UserV2Model.findById as jest.Mock).mockResolvedValue(otherUser);
    await expect(
      getUserV2ById(null, { _id: "other" }, { user: contextUser }),
    ).rejects.toMatchObject({
      message: "Access denied.",
      extensions: { code: "FORBIDDEN" },
    });
  });

  it("returns the user when IDs match", async () => {
    const found = { _id: contextUser._id, email: contextUser.email };
    (UserV2Model.findById as jest.Mock).mockResolvedValue(found);
    const result = await getUserV2ById(
      null,
      { _id: contextUser._id },
      { user: contextUser },
    );
    expect(requireAuthAndRolesV2).toHaveBeenCalledWith(contextUser, [
      UserV2Role.Student,
      UserV2Role.Instructor,
      UserV2Role.Admin,
    ]);
    expect(UserV2Model.findById).toHaveBeenCalledWith(contextUser._id);
    expect(result).toBe(found);
  });

  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (UserV2Model.findById as jest.Mock).mockRejectedValue(
      new Error("DB error"),
    );
    await expect(
      getUserV2ById(null, { _id: contextUser._id }, { user: contextUser }),
    ).rejects.toMatchObject({
      message: "Failed to fetch user.",
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  });
});
