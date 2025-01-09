import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { middleware } from "../src/middleware";

jest.mock("jose", () => ({
  jwtVerify: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    next: jest.fn(() => ({ headers: { set: jest.fn() } })),
    redirect: jest.fn(),
  },
}));

describe("Middleware", () => {
  const MOCK_URL = "http://localhost/dashboard";

  let req: any;

  beforeEach(() => {
    req = {
      cookies: {
        get: jest.fn(),
      },
      url: MOCK_URL,
    };

    jest.clearAllMocks();
  });

  it("redirects to /login if no token is present", async () => {
    req.cookies.get.mockReturnValueOnce(undefined);

    const response = await middleware(req as unknown as NextRequest);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL("/login", MOCK_URL),
    );
    expect(NextResponse.next).not.toHaveBeenCalled();
  });

  it("calls NextResponse.next() and sets headers if token is valid", async () => {
    const MOCK_PAYLOAD = {
      userId: "mockUserId",
      email: "mock@example.com",
      role: "user",
    };

    req.cookies.get.mockReturnValueOnce({ value: "mockToken" });

    (jwtVerify as jest.Mock).mockResolvedValueOnce({ payload: MOCK_PAYLOAD });

    const response = await middleware(req as unknown as NextRequest);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(response.headers.set).toHaveBeenCalledWith(
      "X-User-Id",
      MOCK_PAYLOAD.userId,
    );
    expect(response.headers.set).toHaveBeenCalledWith(
      "X-User-Email",
      MOCK_PAYLOAD.email,
    );
    expect(response.headers.set).toHaveBeenCalledWith(
      "X-User-Role",
      MOCK_PAYLOAD.role,
    );
  });

  it("redirects to /login if token is invalid", async () => {
    req.cookies.get.mockReturnValueOnce({ value: "invalidToken" });

    (jwtVerify as jest.Mock).mockRejectedValueOnce(new Error("Invalid token"));

    const response = await middleware(req as unknown as NextRequest);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL("/login", MOCK_URL),
    );
    expect(NextResponse.next).not.toHaveBeenCalled();
  });
});
