// __tests__/api/graphql/mutations/userV2/update-instructor-payout-info-mutation.spec.ts
import { updateInstructorPayoutInfo } from "@/app/api/graphql/resolvers/mutations/userV2/update-instructor-payout-info-mutation";
import { InstructorUserV2 } from "@/app/api/graphql/models";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import { GraphQLError } from "graphql";
import {
  BankName,
  PayoutMethod,
  UpdateInstructorPayoutInfoInput,
  UpdateUserV2Response,
  UserV2,
  UserV2Role,
} from "@/generated/graphql";

jest.mock("../../../../../src/lib/auth-userV2-utils", () => ({
  requireAuthAndRolesV2: jest.fn(),
}));
jest.mock("../../../../../src/app/api/graphql/models", () => ({
  InstructorUserV2: { findById: jest.fn() },
}));

describe("updateInstructorPayoutInfo", () => {
  const user: UserV2 = {
    _id: "instr-1",
    email: "inst@example.com",
    role: UserV2Role.Instructor,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (requireAuthAndRolesV2 as jest.Mock).mockResolvedValue(undefined);
  });

  it("throws if not authenticated/instructor", async () => {
    (requireAuthAndRolesV2 as jest.Mock).mockRejectedValue(
      new GraphQLError("No auth"),
    );
    await expect(
      updateInstructorPayoutInfo(
        null,
        { input: {} as UpdateInstructorPayoutInfoInput },
        { user },
      ),
    ).rejects.toThrow("No auth");
  });

  it("returns validation error on bad accountNumber", async () => {
    const badInput: UpdateInstructorPayoutInfoInput = {
      accountNumber: "abc123",
    };
    const res = await updateInstructorPayoutInfo(
      null,
      { input: badInput },
      { user },
    );
    expect(res).toEqual<UpdateUserV2Response>({
      success: false,
      message: "Account number must contain only digits.",
    });
  });

  it("returns validation error on too-short accountNumber", async () => {
    const badInput: UpdateInstructorPayoutInfoInput = {
      accountNumber: "123",
    };
    const res = await updateInstructorPayoutInfo(
      null,
      { input: badInput },
      { user },
    );
    expect(res).toEqual<UpdateUserV2Response>({
      success: false,
      message: "Account number must be at least 10 digits long.",
    });
  });

  it("returns User not found when no record", async () => {
    (InstructorUserV2.findById as jest.Mock).mockResolvedValue(null);
    const res = await updateInstructorPayoutInfo(null, { input: {} }, { user });
    expect(InstructorUserV2.findById).toHaveBeenCalledWith(user._id);
    expect(res).toEqual<UpdateUserV2Response>({
      success: false,
      message: "User not found.",
    });
  });

  it("updates only provided fields and succeeds", async () => {
    const mockInstructor = {
      _id: user._id,
      payout: { accountHolderName: "Old Name" },
      save: jest.fn().mockResolvedValue(undefined),
    };
    (InstructorUserV2.findById as jest.Mock).mockResolvedValue(mockInstructor);

    const input: UpdateInstructorPayoutInfoInput = {
      accountHolderName: "New Name",
      accountNumber: "1234567890",
      bankName: BankName.KhanBank,
      payoutMethod: PayoutMethod.BankTransfer,
    };

    const res = await updateInstructorPayoutInfo(null, { input }, { user });

    expect(mockInstructor.payout).toEqual({
      accountHolderName: "New Name",
      accountNumber: "1234567890",
      bankName: BankName.KhanBank,
      payoutMethod: PayoutMethod.BankTransfer,
    });
    expect(mockInstructor.save).toHaveBeenCalled();
    expect(res).toEqual<UpdateUserV2Response>({
      success: true,
      message: "Payout info updated successfully",
    });
  });

  it("handles unexpected errors gracefully", async () => {
    (InstructorUserV2.findById as jest.Mock).mockImplementation(() => {
      throw new Error("DB down");
    });
    const res = await updateInstructorPayoutInfo(null, { input: {} }, { user });
    expect(res).toEqual<UpdateUserV2Response>({
      success: false,
      message: "Internal error: DB down",
    });
  });
});
