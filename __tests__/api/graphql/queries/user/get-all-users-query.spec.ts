import { getAllUser } from "../../../../../src/app/api/graphql/resolvers/queries/user/get-all-users-query";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { UserModel } from "../../../../../src/app/api/graphql/models/user.model";
import { GraphQLError } from "graphql";
import { Role, User } from "../../../../../src/generated/graphql";

// Mock the dependencies
jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models/user.model", () => ({
  UserModel: {
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

describe("getAllUser", () => {
  const adminUser: User = {
    _id: "admin-id",
    email: "admin@example.com",
    role: Role.Admin,
    studentId: "admin-student-id",
    isVerified: true,
    createdAt: "",
    updatedAt: "",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Authentication Failure
  it("throws an error if user is not authenticated", async () => {
    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new GraphQLError("Unauthenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      }),
    );

    await expect(getAllUser(null, {}, { user: adminUser })).rejects.toThrow(
      "Unauthenticated",
    );
  });

  // 2. Successful query with default parameters
  it("returns users, totalCount, and hasNextPage with default args", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    const fakeUsers = [
      {
        _id: "user1",
        email: "user1@example.com",
        password: "hashed",
        studentId: "stud1",
      },
      {
        _id: "user2",
        email: "user2@example.com",
        password: "hashed",
        studentId: "stud2",
      },
    ];
    const fakeCount = 20;

    // Create a chainable find mock
    const findMock = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue(fakeUsers),
    };

    (UserModel.find as jest.Mock).mockReturnValue(findMock);
    (UserModel.countDocuments as jest.Mock).mockResolvedValue(fakeCount);

    const args = {
      limit: 10,
      offset: 0,
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    const result = await getAllUser(null, args, { user: adminUser });

    expect(UserModel.find).toHaveBeenCalledWith({});
    expect(findMock.skip).toHaveBeenCalledWith(0);
    expect(findMock.limit).toHaveBeenCalledWith(10);
    expect(findMock.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(findMock.select).toHaveBeenCalledWith("-password");
    expect(UserModel.countDocuments).toHaveBeenCalledWith({});
    expect(result.users).toEqual(fakeUsers);
    expect(result.totalCount).toEqual(fakeCount);
    expect(result.hasNextPage).toBe(true); // 0 + 10 < 20
  });

  // 3. Use safeSortField if sortBy is not allowed
  it("defaults to sorting by 'createdAt' if sortBy is invalid", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    const fakeUsers: any[] = [];
    const fakeCount = 0;
    const findMock = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue(fakeUsers),
    };

    (UserModel.find as jest.Mock).mockReturnValue(findMock);
    (UserModel.countDocuments as jest.Mock).mockResolvedValue(fakeCount);

    const args = {
      limit: 10,
      offset: 0,
      search: "",
      sortBy: "invalidField",
      sortOrder: "asc",
    };

    await getAllUser(null, args, { user: adminUser });
    // Expected safe sort field: "createdAt" and ascending order (1)
    expect(findMock.sort).toHaveBeenCalledWith({ createdAt: 1 });
  });

  // 4. Build query when search is provided
  it("builds query correctly when search term is provided", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    const fakeUsers: any[] = [];
    const fakeCount = 0;
    const findMock = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue(fakeUsers),
    };

    (UserModel.find as jest.Mock).mockReturnValue(findMock);
    (UserModel.countDocuments as jest.Mock).mockResolvedValue(fakeCount);

    const searchTerm = "test";
    const args = { search: searchTerm };

    await getAllUser(null, args, { user: adminUser });
    const expectedQuery = {
      $or: [
        { email: { $regex: searchTerm, $options: "i" } },
        { studentId: { $regex: searchTerm, $options: "i" } },
      ],
    };
    expect(UserModel.find).toHaveBeenCalledWith(expectedQuery);
    expect(UserModel.countDocuments).toHaveBeenCalledWith(expectedQuery);
  });

  // 5. Error test: throws an error if database query fails
  it("throws an error if database query fails", async () => {
    // Mock authentication to pass
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    // Mock UserModel.find to simulate a database error
    const findMock = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockRejectedValue(new Error("Database error")),
    };
    (UserModel.find as jest.Mock).mockReturnValue(findMock);

    // Mock countDocuments (though it may not be called due to Promise.all rejection)
    (UserModel.countDocuments as jest.Mock).mockResolvedValue(0);

    // Define typical arguments
    const args = {
      limit: 10,
      offset: 0,
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    // Expect the resolver to reject with the appropriate GraphQLError
    await expect(
      getAllUser(null, args, { user: adminUser }),
    ).rejects.toMatchObject({
      message: "Failed to fetch users",
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  });
});
