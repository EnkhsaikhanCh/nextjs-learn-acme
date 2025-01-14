// src/app/dashboard/page.tsx
"use client";

import { useGetUserByIdQuery } from "@/generated/graphql";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Page() {
  const { data: session, status } = useSession();

  const userId = session?.user?.id;

  const { data, loading, error } = useGetUserByIdQuery({
    variables: { id: userId || "" },
    skip: !userId, // userId байхгүй үед хүсэлтийг алгасах
  });

  if (status === "loading") {
    return <p>Loading...</p>; // Session өгөгдөл ачаалж байна
  }

  if (!session) {
    return <p>You are not logged in</p>; // Session байхгүй үед
  }

  if (loading) {
    return <p>Loading user details...</p>;
  }

  if (error) {
    return <p>Error fetching user details: {error.message}</p>;
  }

  const user = data?.getUserById;

  return (
    <main>
      <h1>
        Welcome, <span className="font-bold">{session.user?.email}</span>
      </h1>
      <Table className="mt-4 w-[500px]">
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">{user?.email}</TableCell>
            <TableCell>{user?.studentId}</TableCell>
            <TableCell>{user?.role}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </main>
  );
}
