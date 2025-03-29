import { updateOrCreateEnrollment } from "../../../../../src/app/api/graphql/resolvers/mutations/payment/updateOrCreateEnrollment";
import { EnrollmentModel } from "../../../../../src/app/api/graphql/models/enrollment.model";
import { createEnrollment } from "../../../../../src/app/api/graphql/resolvers/mutations/enrollment/create-enrollment";

// Mock EnrollmentModel and createEnrollment
jest.mock("../../../../../src/app/api/graphql/models/enrollment.model", () => ({
  EnrollmentModel: {
    findOne: jest.fn(),
  },
}));

jest.mock(
  "../../../../../src/app/api/graphql/resolvers/mutations/enrollment/create-enrollment",
  () => ({
    createEnrollment: jest.fn(),
  }),
);

describe("updateOrCreateEnrollment", () => {
  const userId = "user-id";
  const courseId = "course-id";

  beforeAll(() => {
    // Fix the system time to June 15, 2023
    jest.useFakeTimers().setSystemTime(new Date("2023-06-15T00:00:00Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates existing enrollment when enrollment exists", async () => {
    // Existing enrollment with an expiry date before the current date
    const existingEnrollment: {
      _id: string;
      expiryDate: Date | undefined;
      status: string;
      save: jest.Mock;
    } = {
      _id: "enroll-1",
      expiryDate: new Date("2023-06-01T00:00:00Z"),
      status: "INACTIVE",
      save: jest.fn().mockResolvedValue(undefined),
    };
    (EnrollmentModel.findOne as jest.Mock).mockResolvedValue(
      existingEnrollment,
    );

    const updatedEnrollment = await updateOrCreateEnrollment(userId, courseId);

    // currentDate is fixed at 2023-06-15; so new expiry should be 2023-06-15 plus 1 month → 2023-07-15
    const expectedExpiryDate = new Date("2023-06-15T00:00:00Z");
    expectedExpiryDate.setMonth(expectedExpiryDate.getMonth() + 1);

    expect(existingEnrollment.status).toBe("ACTIVE");
    expect(existingEnrollment.expiryDate?.getTime()).toBe(
      expectedExpiryDate.getTime(),
    );
    expect(existingEnrollment.save).toHaveBeenCalled();
    expect(updatedEnrollment).toBe(existingEnrollment);
  });

  it("creates a new enrollment if none exists", async () => {
    // No existing enrollment found
    (EnrollmentModel.findOne as jest.Mock).mockResolvedValue(null);

    const newEnrollment: {
      _id: string;
      expiryDate: Date | undefined;
      status: string;
      save: jest.Mock;
    } = {
      _id: "enroll-2",
      expiryDate: undefined,
      status: "PENDING",
      save: jest.fn().mockResolvedValue(undefined),
    };
    (createEnrollment as jest.Mock).mockResolvedValue(newEnrollment);

    const result = await updateOrCreateEnrollment(userId, courseId);

    // Expected expiry date: current fixed date (2023-06-15) plus 1 month → 2023-07-15
    const expectedExpiryDate = new Date("2023-06-15T00:00:00Z");
    expectedExpiryDate.setMonth(expectedExpiryDate.getMonth() + 1);

    expect(newEnrollment.expiryDate?.getTime()).toBe(
      expectedExpiryDate.getTime(),
    );
    expect(newEnrollment.save).toHaveBeenCalled();
    expect(result).toBe(newEnrollment);
  });

  it("updates existing enrollment when enrollment exists but without expiryDate", async () => {
    // Existing enrollment with no expiryDate defined
    const existingEnrollment: {
      _id: string;
      expiryDate: Date | undefined;
      status: string;
      save: jest.Mock;
    } = {
      _id: "enroll-3",
      expiryDate: undefined, // This branch wasn't covered before
      status: "INACTIVE",
      save: jest.fn().mockResolvedValue(undefined),
    };
    (EnrollmentModel.findOne as jest.Mock).mockResolvedValue(
      existingEnrollment,
    );

    const updatedEnrollment = await updateOrCreateEnrollment(userId, courseId);

    // Since currentDate is fixed at 2023-06-15 (from beforeAll),
    // the expected expiry date is 2023-06-15 plus 1 month → 2023-07-15
    const expectedExpiryDate = new Date("2023-06-15T00:00:00Z");
    expectedExpiryDate.setMonth(expectedExpiryDate.getMonth() + 1);

    expect(existingEnrollment.status).toBe("ACTIVE");
    expect(existingEnrollment.expiryDate?.getTime()).toBe(
      expectedExpiryDate.getTime(),
    );
    expect(existingEnrollment.save).toHaveBeenCalled();
    expect(updatedEnrollment).toBe(existingEnrollment);
  });
});
