import { SubscribeInput } from "@/generated/graphql";
import { normalizeEmail, validateEmail } from "@/utils/validation";
import { GraphQLError } from "graphql";
import { SubscriberModel } from "../../../models";

export const createSubscriber = async (
  _: unknown,
  { input }: { input: SubscribeInput },
) => {
  const { email } = input;

  if (!email) {
    throw new GraphQLError("Email is required", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !validateEmail(normalizedEmail)) {
    throw new GraphQLError(
      "Please enter a valid email address (e.g., user@example.com)",
      {
        extensions: { code: "BAD_USER_INPUT" },
      },
    );
  }

  try {
    const existingSubscriber = await SubscriberModel.findOne({
      email: normalizedEmail,
    });

    if (existingSubscriber) {
      throw new GraphQLError("This email is already subscribed", {
        extensions: { code: "CONFLICT" },
      });
    }

    const newSubscriber = await SubscriberModel.create({
      email: normalizedEmail,
    });

    return {
      success: true,
      message: "Successfully subscribed!",
      subscriber: newSubscriber,
    };
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    console.error("create subscriber error: ", (error as Error).message);
    throw new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
