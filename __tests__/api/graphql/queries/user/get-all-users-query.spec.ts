import { getAllUser } from "../../../../../src/app/api/graphql/resolvers/queries/user/get-all-users-query";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { UserV2Model } from "../../../../../src/app/api/graphql/models";
import { GraphQLError } from "graphql";
import { Role, User } from "../../../../../src/generated/graphql";

// Mock the dependencies
jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models", () => ({
  UserV2Model: {
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
    createdAt: new Date(),
    updatedAt: new Date(),
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

    // Build a chainable find mock
    const findMock = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue(fakeUsers),
    };

    // Since the projection is applied via .select(), find() should be called with only the query.
    (UserV2Model.find as jest.Mock).mockReturnValue(findMock);
    (UserV2Model.countDocuments as jest.Mock).mockResolvedValue(fakeCount);

    const args = {
      limit: 10,
      offset: 0,
      sortBy: "createdAt",
      sortOrder: "desc",
      filter: {}, // No filter criteria
    };

    const result = await getAllUser(null, args, { user: adminUser });

    // buildUserQuery(filter) returns {} when filter is empty
    expect(UserV2Model.find).toHaveBeenCalledWith({});
    expect(findMock.skip).toHaveBeenCalledWith(0);
    expect(findMock.limit).toHaveBeenCalledWith(10);
    expect(findMock.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(findMock.select).toHaveBeenCalledWith("-password");
    expect(UserV2Model.countDocuments).toHaveBeenCalledWith({});
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

    (UserV2Model.find as jest.Mock).mockReturnValue(findMock);
    (UserV2Model.countDocuments as jest.Mock).mockResolvedValue(fakeCount);

    const args = {
      limit: 10,
      offset: 0,
      sortBy: "invalidField",
      sortOrder: "asc",
      filter: {},
    };

    await getAllUser(null, args, { user: adminUser });
    // Expected safe sort field: "createdAt" and ascending order (1)
    expect(findMock.sort).toHaveBeenCalledWith({ createdAt: 1 });
  });

  // 4. Build query when search is provided in filter
  it("builds query correctly when search term is provided in filter", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    const fakeUsers: any[] = [];
    const fakeCount = 0;
    const findMock = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue(fakeUsers),
    };

    (UserV2Model.find as jest.Mock).mockReturnValue(findMock);
    (UserV2Model.countDocuments as jest.Mock).mockResolvedValue(fakeCount);

    const searchTerm = "test";
    const args = { filter: { search: searchTerm } };

    await getAllUser(null, args, { user: adminUser });
    const expectedQuery = {
      $or: [
        { email: { $regex: searchTerm, $options: "i" } },
        { studentId: { $regex: searchTerm, $options: "i" } },
      ],
    };
    expect(UserV2Model.find).toHaveBeenCalledWith(expectedQuery);
    expect(UserV2Model.countDocuments).toHaveBeenCalledWith(expectedQuery);
  });

  // 5. Error test: throws an error if database query fails
  it("throws an error if database query fails", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    // Simulate a database error in the chain by making select() reject
    const findMock = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockRejectedValue(new Error("Database error")),
    };
    (UserV2Model.find as jest.Mock).mockReturnValue(findMock);
    (UserV2Model.countDocuments as jest.Mock).mockResolvedValue(0);

    const args = {
      limit: 10,
      offset: 0,
      sortBy: "createdAt",
      sortOrder: "desc",
      filter: {},
    };

    await expect(
      getAllUser(null, args, { user: adminUser }),
    ).rejects.toMatchObject({
      message: "Failed to fetch users",
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  });

  it("builds query correctly when filter contains role and isVerified", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);

    const fakeUsers: any[] = [];
    const fakeCount = 0;
    const findMock = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue(fakeUsers),
    };

    (UserV2Model.find as jest.Mock).mockReturnValue(findMock);
    (UserV2Model.countDocuments as jest.Mock).mockResolvedValue(fakeCount);

    const args = { filter: { role: "student", isVerified: true } };

    await getAllUser(null, args, { user: adminUser });
    const expectedQuery = {
      role: "STUDENT",
      isVerified: true,
    };

    // Expect find to be called with the query only.
    expect(UserV2Model.find).toHaveBeenCalledWith(expectedQuery);
    // And check that select("-password") was called on the chain.
    expect(findMock.select).toHaveBeenCalledWith("-password");
    expect(UserV2Model.countDocuments).toHaveBeenCalledWith(expectedQuery);
  });
});
