// __tests__/get-all-subscribers.test.ts
import { getAllSubscribers } from "../../../../../src/app/api/graphql/resolvers/queries/subscriber/get-all-subscriber-query";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { SubscriberModel } from "@/app/api/graphql/models/subscriber.model";
import { GraphQLError } from "graphql";
import { Role, User } from "@/generated/graphql";

jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models/subscriber.model", () => ({
  SubscriberModel: {
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

describe("getAllSubscribers", () => {
  const adminUser: User = {
    _id: "admin-id",
    email: "admin@email.com",
    role: Role.Admin,
    studentId: "",
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws error if user is not authenticated", async () => {
    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new GraphQLError("Unauthenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      }),
    );

    await expect(
      getAllSubscribers(null, {}, { user: adminUser }),
    ).rejects.toThrow("Unauthenticated");
  });

  it("returns subscribers, totalCount, hasNextPage", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    const fakeSubscribers = [
      { _id: "1", email: "test1@email.com", subscribedAt: new Date() },
      { _id: "2", email: "test2@email.com", subscribedAt: new Date() },
    ];
    const fakeCount = 25;

    const findMock = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(fakeSubscribers),
    };

    (SubscriberModel.find as jest.Mock).mockReturnValue(findMock);
    (SubscriberModel.countDocuments as jest.Mock).mockResolvedValue(fakeCount);

    const result = await getAllSubscribers(
      null,
      { limit: 10, offset: 0 },
      { user: adminUser },
    );

    expect(SubscriberModel.find).toHaveBeenCalledWith({}, "email subscribedAt");
    expect(findMock.sort).toHaveBeenCalledWith({ subscribedAt: -1 });
    expect(findMock.skip).toHaveBeenCalledWith(0);
    expect(findMock.limit).toHaveBeenCalledWith(10);
    expect(result.subscribers).toEqual(fakeSubscribers);
    expect(result.totalCount).toBe(fakeCount);
    expect(result.hasNextPage).toBe(true);
  });

  it("handles search queries correctly", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const search = "test";
    const query = { $or: [{ email: { $regex: search, $options: "i" } }] };

    const findMock = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([]),
    };

    (SubscriberModel.find as jest.Mock).mockReturnValue(findMock);
    (SubscriberModel.countDocuments as jest.Mock).mockResolvedValue(0);

    await getAllSubscribers(null, { search }, { user: adminUser });

    expect(SubscriberModel.find).toHaveBeenCalledWith(
      query,
      "email subscribedAt",
    );
    expect(SubscriberModel.countDocuments).toHaveBeenCalledWith(query);
  });

  it("throws GraphQLError on unexpected failure", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    (SubscriberModel.find as jest.Mock).mockImplementation(() => {
      throw new Error("DB error");
    });

    await expect(
      getAllSubscribers(null, {}, { user: adminUser }),
    ).rejects.toThrow("Failed to fetch subscribers");
  });

  it("rethrows if error is already a GraphQLError", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    const mockError = new GraphQLError("Already handled error", {
      extensions: { code: "SOME_CODE" },
    });

    (SubscriberModel.find as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    await expect(getAllSubscribers(null, {}, { user: adminUser })).rejects.toBe(
      mockError,
    );
  });
});
