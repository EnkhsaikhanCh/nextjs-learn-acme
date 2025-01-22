"use client";

import React, { useMemo, useState } from "react";
import {
  flexRender,
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetAllUserQuery } from "@/generated/graphql";
import { Loader } from "lucide-react";

export default function Page() {
  const { data, loading, error, refetch } = useGetAllUserQuery();
  const [search, setSearch] = useState("");

  // Define your table columns
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Student ID",
        accessorKey: "studentId",
      },
      {
        header: "Role",
        accessorKey: "role",
        cell: ({ getValue }) => {
          const isAdmin = getValue() === "admin";
          return (
            <span
              className={isAdmin ? "font-bold text-blue-500" : "text-gray-500"}
            >
              {String(getValue())}
            </span>
          );
        },
      },
      {
        header: "Verified",
        accessorKey: "isVerified",
        cell: ({ getValue }) =>
          getValue() ? (
            <span className="text-green-500">Verified</span>
          ) : (
            <span className="text-red-500">Not Verified</span>
          ),
      },
    ],
    [],
  );

  // Filter users client-side based on "search" value
  const filteredUsers = useMemo(() => {
    if (!data?.getAllUser) return [];
    const searchLower = search.toLowerCase();
    return data.getAllUser.filter((user) => {
      return (
        user.email.toLowerCase().includes(searchLower) ||
        user.studentId.toLowerCase().includes(searchLower)
      );
    });
  }, [data, search]);

  // Initialize React Table
  const table = useReactTable({
    data: filteredUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
    },
  });

  // Clear search handler
  const handleClearSearch = () => {
    setSearch("");
  };

  // Basic pagination range logic: show pages from currentPage-2 to currentPage+2
  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  const pagesToShow = useMemo(() => {
    const start = Math.max(0, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);
    const pages: number[] = [];

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <main className="container mx-auto p-4">
      <h1 className="mb-4 text-xl font-bold">User List</h1>

      <p className="mb-4 text-gray-700">
        Total Users:{" "}
        <span className="font-semibold">{filteredUsers.length}</span>
      </p>

      <div className="mb-4 flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <Button variant="outline" onClick={handleClearSearch}>
            Clear
          </Button>
        )}
      </div>

      {/* Show loading state, error state, or table of users */}
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader className="animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-500">Failed to load users: {error.message}</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination using shadcn/ui components */}
          <Pagination className="mt-4">
            <PaginationContent>
              {/* Previous button */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => table.previousPage()}
                  className="cursor-pointer"
                />
              </PaginationItem>

              {/* Ellipsis before if needed */}
              {pagesToShow[0] > 0 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Page number links */}
              {pagesToShow.map((pageIndex) => (
                <PaginationItem key={pageIndex}>
                  <PaginationLink
                    isActive={pageIndex === currentPage}
                    onClick={() => table.setPageIndex(pageIndex)}
                  >
                    {pageIndex + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {/* Ellipsis after if needed */}
              {pagesToShow[pagesToShow.length - 1] < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Next button */}
              <PaginationItem>
                <PaginationNext
                  onClick={() => table.nextPage()}
                  className="cursor-pointer"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}

      <Button onClick={() => refetch()} className="mt-4 bg-blue-500 text-white">
        Refresh Users
      </Button>
    </main>
  );
}
