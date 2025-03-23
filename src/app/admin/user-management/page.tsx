"use client";

import React, { useMemo, useState } from "react";
import {
  flexRender,
  useReactTable,
  ColumnDef,
  getCoreRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
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
import { useDebounce } from "use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  const pageSize = 10;
  const [pageIndex, setPageIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [debouncedSearch] = useDebounce(search, 300);

  const { data, loading, error } = useGetAllUserQuery({
    variables: {
      limit: pageSize,
      offset: pageIndex * pageSize,
      search: debouncedSearch,
      sortBy,
      sortOrder,
    },
  });

  const users = data?.getAllUser?.users ?? [];
  const totalCount = data?.getAllUser?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      { header: "Email", accessorKey: "email" },
      { header: "Student ID", accessorKey: "studentId" },
      {
        header: "Role",
        accessorKey: "role",
        cell: ({ getValue }) => {
          const isAdmin = getValue() === "ADMIN";
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

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const nextState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(nextState.pageIndex);
    },
  });

  const pagesToShow = useMemo(() => {
    const start = Math.max(0, pageIndex - 2);
    const end = Math.min(totalPages - 1, pageIndex + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [pageIndex, totalPages]);

  return (
    <main className="container mx-auto p-4">
      <h1 className="mb-4 text-xl font-bold">User List</h1>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <Input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPageIndex(0);
          }}
        />

        <div className="flex items-center gap-2">
          <Select
            onValueChange={(value) => {
              setSortBy(value);
              setPageIndex(0);
            }}
            value={sortBy}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="role">Role</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortOrder}
            onValueChange={(value) => {
              setSortOrder(value);
              setPageIndex(0);
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

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader className="animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-500">Failed to load users: {error.message}</p>
      ) : users.length === 0 ? (
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
        </>
      )}
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPageIndex((prev) => Math.max(0, prev - 1))}
              className="cursor-pointer"
            />
          </PaginationItem>

          {pagesToShow[0] > 0 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {pagesToShow.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === pageIndex}
                onClick={() => setPageIndex(page)}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {pagesToShow[pagesToShow.length - 1] < totalPages - 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setPageIndex((prev) => Math.min(totalPages - 1, prev + 1))
              }
              className="cursor-pointer"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}
