"use client";

import { useState } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { useGetAllSubscribersQuery } from "@/generated/graphql";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, SearchIcon } from "lucide-react";
import { MetricCard } from "@/components/dashboard-widgets/MetricCard";

interface Subscriber {
  email: string;
  subscribedAt: string | number | Date;
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "саяхан";
  if (diffMin < 60) return `${diffMin} минутын өмнө`;
  if (diffHr < 24) return `${diffHr} цагийн өмнө`;
  return `${diffDay} өдрийн өмнө`;
}

export default function Page() {
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [debouncedSearch] = useDebounce(search, 400);
  const limit = 15;

  const { data: subscribersData, loading } = useGetAllSubscribersQuery({
    variables: { limit, offset, search: debouncedSearch },
  });

  const totalSub = subscribersData?.getAllSubscribers.totalCount || 0;
  const hasNextPage = subscribersData?.getAllSubscribers?.hasNextPage || false;

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
        return getTimeAgo(ulaanbaatar);
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

  return (
    <main className="pb-20">
      <div className="space-y-3">
        <div className="mt-4 grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-3">
          <MetricCard
            title="Subscribers"
            description="Шинээр нэмэгдсэн захиалагчдын тоо"
            currentValue={totalSub}
            targetValue={1000}
            unit="subscribers"
            colorClass="bg-blue-500"
          />
        </div>

        <div className="mt-4 px-4">
          <div className="relative max-w-[300px]">
            <Input
              className="peer h-8 ps-9 pe-9"
              placeholder="Search..."
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOffset(0);
              }}
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
          </div>
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
                    No subscribers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="w-full px-4">
          <div className="flex w-full flex-col items-center justify-end gap-4 md:flex-row">
            <Button
              variant={"outline"}
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
              className="disabled:opacity-50"
              size={"sm"}
            >
              <ArrowLeft />
            </Button>

            <p className="text-center text-sm text-gray-500">
              Showing {offset + 1}–{Math.min(offset + limit, totalSub)} of{" "}
              {totalSub} subscribers
            </p>

            <Button
              variant={"outline"}
              onClick={() => setOffset(offset + limit)}
              disabled={!hasNextPage}
              className="disabled:opacity-50"
              size={"sm"}
            >
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
