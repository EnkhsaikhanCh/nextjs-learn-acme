import { GraphQLError } from "graphql";
import { requireUser } from "../../../src/app/api/graphql/auth";
import { Context } from "../../../src/app/api/graphql/schemas/user.schema";

describe("requireUser function", () => {
  const validUserContext: Context = {
    user: {
      _id: "mockUserId",
      email: "mock@example.com",
      studentId: "123456",
      role: "student",
      password: "hashedPassword",
    },
  };

  const invalidUserContext: Context = {}; // user байхгүй context

  it("should throw UNAUTHENTICATED error if user is not present in context", () => {
    expect(() => requireUser(invalidUserContext)).toThrowError(
      new GraphQLError("UNAUTHORIZED", {
        extensions: { code: "UNAUTHENTICATED" },
      }),
    );
  });

  it("should not throw an error if user is present in context", () => {
    expect(() => requireUser(validUserContext)).not.toThrow();
  });
});
