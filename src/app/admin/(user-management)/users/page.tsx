"use client";

import { MetricCard } from "@/components/dashboard-widgets/MetricCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role, useGetAllUserQuery } from "@/generated/graphql";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { ArrowLeft, ArrowRight, SearchIcon } from "lucide-react";
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
  });

  // Define table columns
  const columns: ColumnDef<any>[] = [
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
  });

  const table = useReactTable({
    data: allUserData?.getAllUser.users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalUsers / limit),
  });

  return (
    <main className="pb-20">
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
      {/* Search input and refresh button */}
      <div className="mb-4 flex w-full items-center justify-between gap-2 px-4 pt-4">
        <div className="flex gap-2">
          <div className="relative max-w-[300px]">
            <Input
              className="peer h-9 ps-9 pe-9"
              placeholder="Search users..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOffset(0); // Reset to first page on search
              }}
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            Refresh
          </Button>
        </div>

        {/* Sorting and filter controls */}
        <div className="flex items-center gap-2">
          <Select
            onValueChange={(value) => {
              setSortBy(value);
              setOffset(0); // Reset to first page on sort change
            }}
            value={sortBy}
          >
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="role">Role</SelectItem>
              <SelectItem value="createdAt">Created Date</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={roleFilter}
            onValueChange={(value) => {
              setRoleFilter(value as Role | "ALL");
              setOffset(0);
            }}
          >
            <SelectTrigger className="min-w-[140px]">
              <SelectValue placeholder="Filter role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="STUDENT">Student</SelectItem>
              <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortOrder}
            onValueChange={(value) => {
              setSortOrder(value); // Update sort order without resetting offset
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error display */}
      {error && <div className="p-4 text-red-500">Error: {error.message}</div>}

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
                  Loading...
                </td>
              </tr>
            )}
            {!loading && table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-4 text-center text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="w-full px-4">
        <div className="mt-4 flex w-full flex-row items-center justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
            size={"sm"}
          >
            <ArrowLeft size={16} />
          </Button>

          <span className="text-sm text-gray-600">
            Showing {offset + 1}–{Math.min(offset + limit, totalUsers)} of{" "}
            {totalUsers}
          </span>

          <Button
            variant="outline"
            onClick={() => setOffset(offset + limit)}
            disabled={offset + limit >= totalUsers}
            size={"sm"}
          >
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </main>
  );
}
