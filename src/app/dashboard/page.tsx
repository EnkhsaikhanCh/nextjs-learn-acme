// src/app/dashboard/page.tsx
"use client";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>; // Session өгөгдөл ачаалж байна
  }

  if (!session) {
    return <p>You are not logged in</p>; // Session байхгүй үед
  }

  return (
    <main>
      <h1>
        Welcome, <span className="font-bold">{session.user?.email}</span>!
      </h1>
    </main>
  );
}
