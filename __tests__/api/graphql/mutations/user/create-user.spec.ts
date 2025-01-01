import { createUser } from "@/app/api/graphql/resolvers/mutations";

const mock = {
  _id: 1,
  name: "John Doe",
  email: "john@email.com",
  password: "123456",
};

jest.mock("../../../../../src/app/api/graphql/models/user.model", () => ({
  UserModel: {
    create: jest.fn().mockResolvedValue({
      toObject: () => mock,
    }),
  },
}));

describe("createUser", () => {
  it("should create a new user", async () => {
    const response = await createUser({}, { input: mock });
    expect(response).toEqual(mock);
  });
});
