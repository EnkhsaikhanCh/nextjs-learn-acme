import {
  sanitizeInput,
  validateName,
  validationEmail,
  validationPassword,
} from "../../src/utils/validation";

describe("Validation Utility Functions", () => {
  describe("sanitizeInput", () => {
    it("should remove invalid characters", () => {
      expect(sanitizeInput("hello@world!.com")).toBe("hello@world.com");
      expect(sanitizeInput("test<>test")).toBe("testtest");
      expect(sanitizeInput("valid_input123")).toBe("valid_input123");
    });

    it("should return an empty string if input contains only invalid characters", () => {
      expect(sanitizeInput("!#$%^&*()")).toBe("");
    });
  });

  describe("validateName", () => {
    it("should return true for valid names", () => {
      expect(validateName("John Doe")).toBe(true);
      expect(validateName("Jane-Doe")).toBe(true);
      expect(validateName("Valid.Name")).toBe(true);
    });

    it("should return false for invalid names", () => {
      expect(validateName("Invalid@Name")).toBe(false);
      expect(validateName("Name!123")).toBe(false);
    });
  });

  describe("validationEmail", () => {
    it("should return true for valid email addresses", () => {
      expect(validationEmail("test@example.com")).toBe(true);
      expect(validationEmail("user.name+alias@domain.co")).toBe(true);
    });

    it("should return false for invalid email addresses", () => {
      expect(validationEmail("invalid-email")).toBe(false);
      expect(validationEmail("test@com")).toBe(false);
      expect(validationEmail("test@.com")).toBe(false);
    });
  });

  describe("validationPassword", () => {
    it("should return true for strong passwords", () => {
      expect(validationPassword("Str0ng!Passw0rd")).toBe(true);
      expect(validationPassword("Valid123!@#")).toBe(true);
    });

    it("should return false for weak passwords", () => {
      expect(validationPassword("weak")).toBe(false);
      expect(validationPassword("NoNumbersOrSymbols")).toBe(true);
      expect(validationPassword("short1!")).toBe(false);
    });

    it("should return false for passwords longer than 128 characters", () => {
      const longPassword = "A".repeat(129);
      expect(validationPassword(longPassword)).toBe(false);
    });
  });
});
