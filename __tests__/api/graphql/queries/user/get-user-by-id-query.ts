import { getUserById } from "@/app/api/graphql/resolvers/queries/user/get-user-by-id-query";

const mockUser = {
  _id: "1",
  name: "Test User",
  email: "test@example.com",
  password: "123456",
  createdAt: new Date(),
  updatedAt: new Date(),
};

jest.mock("../../../../../src/app/api/graphql/models/user.model", () => {
  const actualModule = jest.requireActual(
    "../../../../../src/app/api/graphql/models/user.model",
  );
  return {
    ...actualModule,
    UserModel: {
      findById: jest.fn(),
    },
  };
});

describe("getUserById query", () => {
  beforeEach(() => {
    const {
      UserModel,
    } = require("../../../../../src/app/api/graphql/models/user.model");
    UserModel.findById.mockResolvedValue(mockUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a user by ID", async () => {
    const result = await getUserById({}, { id: mockUser._id });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("_id", mockUser._id);
    expect(result).toHaveProperty("name", mockUser.name);
    expect(result).toHaveProperty("email", mockUser.email);
  });

  it("should return null if user not found", async () => {
    const {
      UserModel,
    } = require("../../../../../src/app/api/graphql/models/user.model");
    UserModel.findById.mockResolvedValueOnce(null);

    const result = await getUserById({}, { id: "nonexistent-id" });

    expect(result).toBeNull();
  });
});
