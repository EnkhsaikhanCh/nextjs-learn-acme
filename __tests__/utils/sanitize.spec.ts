// __tests__/sanitize.test.ts
import { sanitizeInput } from "../../src/utils/sanitize";

describe("sanitizeInput", () => {
  it("should escape HTML characters and convert to lowercase", () => {
    const input = "<script>alert('XSS');</script>";
    const expected =
      "&lt;script&gt;alert(&#x27;xss&#x27;);&lt;&#x2F;script&gt;";
    expect(sanitizeInput(input)).toBe(expected);
  });

  it("should escape special characters, trim spaces, and convert to lowercase", () => {
    const input = ` "Hello" & 'World' `;
    const expected = `&quot;hello&quot; &amp; &#x27;world&#x27;`;
    expect(sanitizeInput(input)).toBe(expected);
  });

  it("should handle an empty string", () => {
    const input = "";
    const expected = "";
    expect(sanitizeInput(input)).toBe(expected);
  });

  it("should handle undefined and return empty string", () => {
    const input = undefined;
    const expected = "";
    expect(sanitizeInput(input)).toBe(expected);
  });

  it("should handle null and return empty string", () => {
    const input = null;
    const expected = "";
    expect(sanitizeInput(input)).toBe(expected);
  });

  it("should not modify safe strings except converting to lowercase", () => {
    const input = "SafeString123";
    const expected = "safestring123";
    expect(sanitizeInput(input)).toBe(expected);
  });

  it("should trim leading and trailing spaces", () => {
    const input = "  Hello World  ";
    const expected = "hello world";
    expect(sanitizeInput(input)).toBe(expected);
  });
});
