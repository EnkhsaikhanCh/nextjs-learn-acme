// src/app/dashboard/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";

export default function Page() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <main>
      <h1>
        Welcome, <span className="font-bold">{user.email}</span>!
      </h1>
      <p>
        Your role is: <span className="font-bold">{user.role}</span> .
      </p>
    </main>
  );
}
