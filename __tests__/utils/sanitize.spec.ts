// __tests__/sanitize.test.ts

import { sanitizeInput } from "../../src/utils/sanitize";

describe("sanitizeInput", () => {
  it("should escape HTML characters", () => {
    const input = "<script>alert('XSS');</script>";
    const expected =
      "&lt;script&gt;alert(&#x27;XSS&#x27;);&lt;&#x2F;script&gt;";
    expect(sanitizeInput(input)).toBe(expected);
  });

  it("should escape special characters", () => {
    const input = `"Hello" & 'World'`;
    const expected = `&quot;Hello&quot; &amp; &#x27;World&#x27;`;
    expect(sanitizeInput(input)).toBe(expected);
  });

  it("should handle an empty string", () => {
    const input = "";
    const expected = "";
    expect(sanitizeInput(input)).toBe(expected);
  });

  it("should not modify safe strings", () => {
    const input = "SafeString123";
    const expected = "SafeString123";
    expect(sanitizeInput(input)).toBe(expected);
  });
});
