"use client";

import { MetricCard } from "@/components/dashboard-widgets/MetricCard";
import { SearchInput } from "@/components/SearchInput";
import { SortSelect } from "@/components/SortSelect";
import { TablePagination } from "@/components/TablePagination";
import { Button } from "@/components/ui/button";
import { Role, useGetAllUserQuery, User } from "@/generated/graphql";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { Inbox, Loader, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";

export default function Page() {
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [debouncedSearch] = useDebounce(search, 400);
  const limit = 15;

  const {
    data: allUserData,
    loading,
    error,
    refetch,
  } = useGetAllUserQuery({
    variables: {
      limit,
      offset,
      sortBy,
      sortOrder,
      filter: {
        search: debouncedSearch,
        role: roleFilter !== "ALL" ? roleFilter : undefined,
      },
    },
    fetchPolicy: "cache-first",
  });

  // Define table columns
  const columns: ColumnDef<User>[] = [
    {
      header: "#",
      id: "rowNumber",
      cell: ({ row }) => offset + row.index + 1,
    },
    {
      header: "EMAIL",
      accessorKey: "email",
    },
    {
      header: "ROLE",
      accessorKey: "role",
    },
    {
      header: "STUDENT ID",
      accessorKey: "studentId",
    },
    {
      header: "VERIFY",
      accessorKey: "isVerified",
      cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
    },
    {
      header: "DATE",
      accessorKey: "createdAt",
      cell: ({ getValue }) => {
        const date = new Date(getValue() as string | number | Date);
        return date
          .toLocaleString("en-CA", {
            timeZone: "Asia/Ulaanbaatar",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
          .replace(",", "");
      },
    },
  ];

  const totalUsers = allUserData?.getAllUser.totalCount || 0;

  const { data: allUsersUnfiltered } = useGetAllUserQuery({
    variables: {
      limit: 1,
      offset: 0,
      filter: {},
    },
    fetchPolicy: "cache-first",
  });

  const table = useReactTable({
    data: allUserData?.getAllUser.users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalUsers / limit),
  });

  return (
    <main className="space-y-4 pb-20">
      <div className="mt-4 grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-3">
        <MetricCard
          title="Total Users"
          description="Нийт бүртгэлтэй хэрэглэгчдийн тоо"
          currentValue={allUsersUnfiltered?.getAllUser.totalCount || 0}
          targetValue={1000}
          valueFormatter={(v) => `${v} users`}
          indicatorColor="blue"
        />
      </div>
      <div className="mb-3 flex w-full items-center justify-between gap-2 px-4">
        {/* Search input and refresh button */}
        <div className="flex gap-2">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setOffset(0);
            }}
            placeholder="Search users..."
          />
          <Button onClick={() => refetch()} variant="outline" size="sm">
            Refresh
          </Button>
        </div>

        {/* Sorting and filter controls */}
        <div className="flex items-center gap-2">
          <SortSelect
            value={sortBy}
            onChange={(value) => {
              setSortBy(value);
              setOffset(0); // Reset to first page on sort change
            }}
            options={[
              { value: "email", label: "Email" },
              { value: "role", label: "Role" },
              { value: "createdAt", label: "Created Date" },
            ]}
          />

          <SortSelect
            value={roleFilter}
            onChange={(value) => {
              setRoleFilter(value as Role | "ALL");
              setOffset(0);
            }}
            options={[
              { value: "ALL", label: "All Roles" },
              { value: "STUDENT", label: "Student" },
              { value: "INSTRUCTOR", label: "Instructor" },
              { value: "ADMIN", label: "Admin" },
            ]}
          />

          <SortSelect
            value={sortOrder}
            onChange={(value) => {
              setSortOrder(value); // Update sort order without resetting offset
            }}
            options={[
              { value: "asc", label: "Ascending" },
              { value: "desc", label: "Descending" },
            ]}
          />
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="flex items-center gap-3 px-4 text-red-500">
          <TriangleAlert className="h-5 w-5" />
          Error: {error.message}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border-y">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-sidebar">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left font-semibold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    Loading...
                    <Loader className="h-4 w-4 animate-spin" />
                  </div>
                </td>
              </tr>
            )}
            {!loading && table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-4 text-center text-gray-500"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Inbox className="h-4 w-4" />
                    No users found.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="w-full px-4">
        <TablePagination
          offset={offset}
          limit={limit}
          totalCount={totalUsers}
          onPageChange={(newOffset) => setOffset(newOffset)}
        />
      </div>
    </main>
  );
}
