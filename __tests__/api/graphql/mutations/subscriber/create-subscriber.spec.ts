import { createSubscriber } from "../../../../../src/app/api/graphql/resolvers/mutations/subscriber/create-subscriber-mutation";
import { normalizeEmail, validateEmail } from "@/utils/validation";
import { SubscriberModel } from "../../../../../src/app/api/graphql/models";
import { SubscribeInput } from "../../../../../src/generated/graphql";

// Mock validation utilities
jest.mock("../../../../../src/utils/validation", () => ({
  normalizeEmail: jest.fn(),
  validateEmail: jest.fn(),
}));

// Mock the SubscriberModel
jest.mock("../../../../../src/app/api/graphql/models", () => ({
  SubscriberModel: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe("createSubscriber", () => {
  const validEmail = "user@example.com";
  const normalizedEmail = "user@example.com"; // Assume normalization doesn't change it.
  const subscribeInput: SubscribeInput = { email: validEmail };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Missing email
  it("throws BAD_USER_INPUT if email is missing", async () => {
    await expect(
      createSubscriber(null, { input: { email: "" } }),
    ).rejects.toThrow("Email is required");
  });

  // 2. Invalid email: normalization returns falsy
  it("throws BAD_USER_INPUT if normalized email is falsy", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue("");
    await expect(
      createSubscriber(null, { input: { email: validEmail } }),
    ).rejects.toThrow(
      "Please enter a valid email address (e.g., user@example.com)",
    );
  });

  // 3. Invalid email: validateEmail returns false
  it("throws BAD_USER_INPUT if email fails validation", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(validEmail);
    (validateEmail as jest.Mock).mockReturnValue(false);
    await expect(
      createSubscriber(null, { input: { email: validEmail } }),
    ).rejects.toThrow(
      "Please enter a valid email address (e.g., user@example.com)",
    );
  });

  // 4. Already subscribed
  it("throws CONFLICT if the email is already subscribed", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    (SubscriberModel.findOne as jest.Mock).mockResolvedValue({
      _id: "subscriber-id",
      email: normalizedEmail,
    });

    await expect(
      createSubscriber(null, { input: { email: validEmail } }),
    ).rejects.toThrow("This email is already subscribed");
  });

  // 5. Successful creation
  it("creates subscriber successfully with valid email", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    (SubscriberModel.findOne as jest.Mock).mockResolvedValue(null);

    const newSubscriber = { _id: "new-subscriber-id", email: normalizedEmail };
    (SubscriberModel.create as jest.Mock).mockResolvedValue(newSubscriber);

    const result = await createSubscriber(null, {
      input: { email: validEmail },
    });

    expect(SubscriberModel.create).toHaveBeenCalledWith({
      email: normalizedEmail,
    });
    expect(result).toEqual({
      success: true,
      message: "Successfully subscribed!",
      subscriber: newSubscriber,
    });
  });

  // 6. Unexpected error handling
  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(normalizedEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    (SubscriberModel.findOne as jest.Mock).mockRejectedValue(
      new Error("DB error"),
    );

    await expect(
      createSubscriber(null, { input: { email: validEmail } }),
    ).rejects.toThrow("Internal server error");
  });
});
