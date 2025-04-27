"use client";

import { useState } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useGetAllSubscribersQuery } from "@/generated/graphql";
import { useDebounce } from "use-debounce";
import { Loader } from "lucide-react";
import { MetricCard } from "@/components/dashboard-widgets/MetricCard";
import { SearchInput } from "@/components/SearchInput";
import { TablePagination } from "@/components/TablePagination";
import { formatTimeAgo } from "@/utils/format-time-ago";

interface Subscriber {
  email: string;
  subscribedAt: string | number | Date;
}

export default function Page() {
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [debouncedSearch] = useDebounce(search, 400);
  const limit = 15;

  const { data: subscribersData, loading } = useGetAllSubscribersQuery({
    variables: { limit, offset, search: debouncedSearch },
    fetchPolicy: "cache-first",
  });

  const totalSub = subscribersData?.getAllSubscribers.totalCount || 0;

  const columns: ColumnDef<Subscriber>[] = [
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
      header: "DATE",
      accessorKey: "subscribedAt",
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
    {
      header: "AGO",
      id: "timeAgo",
      accessorKey: "subscribedAt",
      cell: ({ getValue }) => {
        const raw = new Date(getValue() as string | number | Date);
        const ulaanbaatar = new Date(
          raw.toLocaleString("en-US", { timeZone: "Asia/Ulaanbaatar" }),
        );
        return formatTimeAgo(ulaanbaatar);
      },
    },
  ];

  const table = useReactTable({
    data: subscribersData?.getAllSubscribers.subscribers || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalSub / limit),
  });

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("en-US").format(num);

  return (
    <main className="pb-20">
      <div className="space-y-3">
        <div className="mt-4 grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-3">
          <MetricCard
            title="Subscribers"
            description="Шинээр нэмэгдсэн захиалагчдын тоо"
            currentValue={totalSub}
            targetValue={1000}
            valueFormatter={(v) => `${formatNumber(v)} subscribers`}
            indicatorColor="blue"
          />
        </div>

        <div className="mt-4 px-4">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setOffset(0);
            }}
            placeholder="Search subscribers..."
          />
        </div>

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
                      {flexRender(
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
                    <td key={cell.id} className="max-w-[250px] px-4 py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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
                    No subscribers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="w-full px-4">
          <TablePagination
            offset={offset}
            limit={limit}
            totalCount={totalSub}
            onPageChange={(newOffset) => setOffset(newOffset)}
          />
        </div>
      </div>
    </main>
  );
}
