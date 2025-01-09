import { GraphQLError } from "graphql";
import { requireUser } from "../../../src/app/api/graphql/auth";
import { Context } from "../../../src/app/api/graphql/schemas/user.schema";

describe("requireUser", () => {
  it("throws UNAUTHENTICATED error if user is not present in context", () => {
    const mockContext: Context = {}; // user байхгүй context

    expect(() => requireUser(mockContext)).toThrowError(
      new GraphQLError("UNAUTHORIZED", {
        extensions: { code: "UNAUTHENTICATED" },
      }),
    );
  });

  it("does not throw an error if user is present in context", () => {
    const mockContext: Context = {
      user: {
        _id: "mockUserId",
        email: "mock@example.com",
        studentId: "123456",
        role: "student",
        password: "hashedPassword",
      },
    };

    expect(() => requireUser(mockContext)).not.toThrow();
  });
});
