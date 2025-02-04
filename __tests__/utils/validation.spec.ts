// utils.test.ts
import {
  sanitizeInput,
  validateName,
  validationEmail,
  validatePassword,
} from "../../src/utils/validation";

describe("sanitizeInput", () => {
  test("should trim leading and trailing whitespaces", () => {
    const input = "   Hello World   ";
    const sanitized = sanitizeInput(input);
    expect(sanitized).toBe("Hello World");
  });

  test("should escape HTML characters to prevent XSS", () => {
    const input = `<script>alert("XSS");</script>`;
    const sanitized = sanitizeInput(input);
    // <script> стаагаар шууд харуулахын оронд escaped тэмдэгт болж хувирахыг шалгана
    expect(sanitized).not.toContain("<script>");
    // Жишээ нь, &lt;script&gt; гэх мэтчлэн escape хийгдсэн байх ёстой
    expect(sanitized).toContain("&lt;script&gt;");
  });
});

describe("validateName", () => {
  test("should return true for a valid name with letters, numbers, spaces, dot, dash", () => {
    expect(validateName("John Doe-123.")).toBe(true);
  });

  test("should return false for invalid characters", () => {
    expect(validateName("John$Doe")).toBe(false);
    expect(validateName("John@Doe")).toBe(false);
  });

  test("should handle empty string correctly", () => {
    expect(validateName("")).toBe(false);
  });
});

describe("validationEmail", () => {
  test("should return true for a valid email", () => {
    expect(validationEmail("test@example.com")).toBe(true);
    expect(validationEmail("john.doe@gmail.com")).toBe(true);
  });

  test("should return false for an invalid email", () => {
    expect(validationEmail("not an email")).toBe(false);
    expect(validationEmail("test@@example.com")).toBe(false);
    expect(validationEmail("test@example")).toBe(false);
  });
});

describe("validatePassword", () => {
  test("should return true for a valid password (>=8 chars)", () => {
    // minLength=8, бусад нөхцөл (доод, дээд үсэг, тоо, символ) 0 тул зөвхөн уртад л анхаарч шалгана
    expect(validatePassword("abcdefgh")).toBe(true);
    expect(validatePassword("12345678")).toBe(true);
    expect(validatePassword("passwordLongerThan8Chars")).toBe(true);
  });

  test("should return false for a password shorter than 8 chars", () => {
    expect(validatePassword("abc")).toBe(false);
    expect(validatePassword("1234567")).toBe(false);
  });

  test("should return false if password length > 128", () => {
    const longPassword = "a".repeat(129);
    expect(validatePassword(longPassword)).toBe(false);
  });

  test("should return true for exactly 128 chars password", () => {
    const maxAllowedPassword = "a".repeat(128);
    expect(validatePassword(maxAllowedPassword)).toBe(true);
  });
});
