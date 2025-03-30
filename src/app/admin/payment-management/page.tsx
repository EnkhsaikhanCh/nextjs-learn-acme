"use client";

import { SearchInput } from "@/components/SearchInput";
import { TablePagination } from "@/components/TablePagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Payment,
  PaymentStatus,
  useGetAllPaymentsQuery,
} from "@/generated/graphql";
import { formatTimeAgo } from "@/utils/format-time-ago";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { Inbox, LineChart, Loader, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { UpdatePaymentStatus } from "./_components/UpdatePaymentStatus";
import { SortSelect } from "@/components/SortSelect";

export default function Page() {
  const [search, setSearch] = useState<string>("");
  const [offset, setOffset] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">(
    "ALL",
  );
  const [debouncedSearch] = useDebounce(search, 400);
  const limit = 15;

  const {
    data: allPaymentsData,
    loading,
    error,
    refetch,
  } = useGetAllPaymentsQuery({
    variables: {
      limit,
      offset,
      filter: {
        search: debouncedSearch,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
      },
    },
  });

  const columnHelper = createColumnHelper<Payment>();

  const columns = [
    {
      id: "rowNumber",
      header: "#",
      cell: ({ row }: { row: Row<Payment> }) => offset + row.index + 1,
    },
    columnHelper.accessor((row) => row.userId.email, {
      header: "EMAIL",
    }),
    columnHelper.accessor((row) => row.courseId.title, {
      header: "COURSE",
    }),
    columnHelper.accessor("amount", {
      header: "AMOUNT",
    }),
    columnHelper.accessor("transactionNote", {
      header: "TRANSACTION NOTE",
    }),
    columnHelper.accessor("status", {
      header: "STATUS",
      cell: ({ row, getValue }) => {
        const payment = row.original;
        const status = getValue()?.toUpperCase();
        let colorClasses = "";

        switch (status) {
          case "SUCCESS":
            colorClasses =
              "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
            break;
          case "PENDING":
            colorClasses =
              "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
            break;
          case "FAILED":
            colorClasses =
              "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
            break;
          case "APPROVED":
            colorClasses =
              "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
            break;
          case "REFUNDED":
            colorClasses =
              "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
            break;
          default:
            colorClasses =
              "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
        }

        return (
          <div className="flex items-center gap-2">
            <span
              className={`inline-block rounded-full px-3 text-xs font-semibold ${colorClasses}`}
            >
              {status}
            </span>
            <UpdatePaymentStatus
              payment={payment}
              paymentId={payment._id}
              currentStatus={payment.status}
              currentRefundReason={payment.refundReason || ""}
              refetch={() => {
                refetch();
                setOffset((prev) => prev);
              }}
            />
          </div>
        );
      },
    }),

    columnHelper.accessor("createdAt", {
      header: "DATE",
      cell: (info) => {
        const date = new Date(info.getValue());
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
    }),
    columnHelper.accessor("createdAt", {
      id: "timeAgo",
      header: "AGO",
      cell: (info) => {
        const raw = new Date(info.getValue());
        const ulaanbaatar = new Date(
          raw.toLocaleString("en-US", { timeZone: "Asia/Ulaanbaatar" }),
        );
        return formatTimeAgo(ulaanbaatar);
      },
    }),
  ];

  const totalPayments = allPaymentsData?.getAllPayments.totalCount || 0;
  const totalAmount = allPaymentsData?.getAllPayments.totalAmount || 0;

  const table = useReactTable({
    data: (allPaymentsData?.getAllPayments.payments as Payment[]) || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalPayments / limit),
  });

  return (
    <main className="space-y-4 pb-20">
      <div className="mt-4 grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Нийт орлого</CardTitle>
            <LineChart className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₮{totalAmount.toLocaleString("mn-MN")}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-3 flex w-full items-center justify-between gap-2 px-4">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value);
            setOffset(0);
          }}
          placeholder="e.g: 101010-001"
        />

        <div className="flex items-center gap-2">
          <SortSelect
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value as PaymentStatus | "ALL");
              setOffset(0);
            }}
            options={[
              { value: "ALL", label: "All Roles" },
              { value: "APPROVED", label: "APPROVED" },
              { value: "PENDING", label: "PENDING" },
              { value: "REFUNDED", label: "REFUNDED" },
              { value: "FAILED", label: "FAILED" },
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
                    No payments found.
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
          totalCount={totalPayments}
          onPageChange={(newOffset) => setOffset(newOffset)}
        />
      </div>
    </main>
  );
}
