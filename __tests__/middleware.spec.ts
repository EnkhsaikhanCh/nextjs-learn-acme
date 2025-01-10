// __tests__/middleware.test.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { middleware } from "../src/middleware";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { NextURL } from "next/dist/server/web/next-url";

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

interface MutableNextRequest extends NextRequest {
  url: string;
}

describe("Middleware", () => {
  let req: Partial<MutableNextRequest>;

  beforeEach(() => {
    req = {
      cookies: {
        get: jest.fn(),
      } as unknown as RequestCookies,
      nextUrl: {
        pathname: "",
      } as unknown as NextURL,
      // req.url утгыг pathname-д дүйцүүлж тохируулна
      url: "http://localhost/",
    };

    jest.clearAllMocks();
  });

  it("Зөвхөн /login эсвэл /signup руу токенгүй үед нэвтрэхийг зөвшөөрөх, бусад тохиолдолд /login руу redirect хийх", async () => {
    req.cookies!.get = jest.fn().mockReturnValueOnce(undefined);

    // 1) token байхгүй үед /dashboard руу ороход /login руу redirect хийх жишээ
    req.nextUrl!.pathname = "/dashboard";
    req.url = "http://localhost/dashboard";

    await middleware(req as NextRequest);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL("/login", "http://localhost/dashboard"),
    );
    expect(NextResponse.next).not.toHaveBeenCalled();

    jest.clearAllMocks();

    // 2) token байхгүй үед /login руу ороход next() хийх жишээ
    req.nextUrl!.pathname = "/login";
    req.url = "http://localhost/login";

    await middleware(req as NextRequest);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.redirect).not.toHaveBeenCalled();

    jest.clearAllMocks();

    // 3) token байхгүй үед /signup руу ороход next() хийх жишээ
    req.nextUrl!.pathname = "/signup";
    req.url = "http://localhost/signup";

    await middleware(req as NextRequest);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it("Токен хүчинтэй үед /login эсвэл /signup руу орохыг оролдохоор /dashboard руу redirect хийх", async () => {
    const mockPayload = {
      userId: "mockUserId",
      email: "mock@example.com",
    };

    req.cookies!.get = jest.fn().mockReturnValueOnce({ value: "validToken" });
    (jwtVerify as jest.Mock).mockResolvedValueOnce({ payload: mockPayload });

    // /login руу орох үед
    req.nextUrl!.pathname = "/login";
    req.url = "http://localhost/login";

    await middleware(req as NextRequest);

    // Шинэ middleware нь new URL("/dashboard", req.url) гэж дуудна
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL("/dashboard", "http://localhost/login"),
    );
    expect(NextResponse.next).not.toHaveBeenCalled();

    jest.clearAllMocks();

    // /signup руу орох үед
    req.cookies!.get = jest.fn().mockReturnValueOnce({ value: "validToken" });
    (jwtVerify as jest.Mock).mockResolvedValueOnce({ payload: mockPayload });

    req.nextUrl!.pathname = "/signup";
    req.url = "http://localhost/signup";

    await middleware(req as NextRequest);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL("/dashboard", "http://localhost/signup"),
    );
    expect(NextResponse.next).not.toHaveBeenCalled();
  });

  it("Токен хүчинтэй, хамгаалалттай route (/dashboard) руу орвол NextResponse.next() ажиллах", async () => {
    const mockPayload = {
      userId: "mockUserId",
      email: "mock@example.com",
    };

    req.cookies!.get = jest.fn().mockReturnValueOnce({ value: "validToken" });
    (jwtVerify as jest.Mock).mockResolvedValueOnce({ payload: mockPayload });

    req.nextUrl!.pathname = "/dashboard";
    req.url = "http://localhost/dashboard";

    const response = await middleware(req as NextRequest);

    expect(NextResponse.next).toHaveBeenCalled();
    // redirect дуудахгүй
    expect(NextResponse.redirect).not.toHaveBeenCalled();
    // response дээрээ headers.set гэж дуудахгүй (жишээ тест)
    expect(response.headers.set).not.toHaveBeenCalled();
  });

  it("Токен буруу/хугацаа дууссан үед /login руу redirect хийх", async () => {
    req.cookies!.get = jest.fn().mockReturnValueOnce({ value: "invalidToken" });
    (jwtVerify as jest.Mock).mockRejectedValueOnce(new Error("Invalid token"));

    req.nextUrl!.pathname = "/dashboard";
    req.url = "http://localhost/dashboard";

    await middleware(req as NextRequest);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL("/login", "http://localhost/dashboard"),
    );
    expect(NextResponse.next).not.toHaveBeenCalled();
  });
});
