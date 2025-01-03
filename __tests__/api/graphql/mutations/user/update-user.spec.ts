import { updateUser } from "@/app/api/graphql/resolvers/mutations";
import { UpdateInput } from "@/app/api/graphql/schemas/user.schema";

const mockUser = {
  _id: "1",
  name: "Updated User",
  email: "updated@example.com",
  password: "hashedpassword",
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
      findByIdAndUpdate: jest.fn(),
    },
  };
});

describe("updateUser mutation", () => {
  beforeEach(() => {
    const {
      UserModel,
    } = require("../../../../../src/app/api/graphql/models/user.model");
    UserModel.findByIdAndUpdate.mockResolvedValue(mockUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update a user", async () => {
    const input: UpdateInput = { name: mockUser.name, email: mockUser.email };
    const result = await updateUser({}, { input, _id: mockUser._id });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("_id", mockUser._id);
    expect(result).toHaveProperty("name", mockUser.name);
    expect(result).toHaveProperty("email", mockUser.email);
  });

  it("should throw an error if user not found", async () => {
    jest
      .spyOn(
        require("../../../../../src/app/api/graphql/models/user.model")
          .UserModel,
        "findByIdAndUpdate",
      )
      .mockResolvedValueOnce(null);

    const input: UpdateInput = {
      name: "Nonexistent User",
      email: "nonexistent@example.com",
    };

    await expect(
      updateUser({}, { input, _id: "nonexistent-id" }),
    ).rejects.toThrow("User not found");
  });
});
