// src/middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Нэвтэрч амжаагүй үед чиглүүлэх зам
  },
  callbacks: {
    authorized: ({ token }) => {
      // Зөвхөн нэвтэрсэн хэрэглэгчийг зөвшөөрөх
      if (!token) return false;

      // Нэмэлт шалгуур: Зөвхөн admin эсвэл student role-тай хэрэглэгчдийг зөвшөөрөх
      if (token.role === "admin" || token.role === "student") {
        return true;
      }

      return false;
    },
  },
});

export const config = {
  matcher: ["/dashboard/:path*"], // Зөвхөн `dashboard` болон түүний дэд замуудыг хамгаална
};
