"use client";

import {
  Course,
  useGetAllCoursesByInstructurIdQuery,
} from "@/generated/graphql";
import { CreateCourseDialog } from "../components/CreateCourseDialog";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Page() {
  const { data, loading, refetch } = useGetAllCoursesByInstructurIdQuery();

  const columns: ColumnDef<Course | null>[] = [
    {
      header: "TITLE",
      accessorKey: "title",
      cell: ({ row }) => {
        const course = row.original;
        if (!course) {
          return "Unknown";
        }

        return (
          <Link
            href={`/instructor/courses/${course.slug}`}
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {course.title}
          </Link>
        );
      },
    },
    {
      header: "COURSE CODE",
      accessorKey: "courseCode",
      cell: ({ row }) => {
        const course = row.original;
        if (!course?.courseCode) {
          return null;
        }

        return (
          <Badge
            variant="outline"
            className="bg-muted text-muted-foreground font-mono text-xs"
          >
            {course.courseCode}
          </Badge>
        );
      },
    },
    {
      header: "STATUS",
      accessorKey: "status",
      cell: ({ row }) => {
        const course = row.original;
        const status = course?.status;
        if (!status) {
          return <span>Unknown</span>;
        }

        let statusClass = "";
        switch (status) {
          case "DRAFT":
            statusClass =
              "bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700";
            break;
          case "PUBLISHED":
            statusClass =
              "bg-green-100 text-green-800 border-green-500 dark:bg-green-800 dark:text-green-200";
            break;
          case "ARCHIVED":
            statusClass =
              "bg-blue-100 text-blue-800 border-blue-500 dark:bg-blue-800 dark:text-blue-200";
            break;
          default:
            statusClass =
              "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
        }

        return (
          <Badge
            variant="outline"
            className={`text-xs font-medium ${statusClass}`}
          >
            {status}
          </Badge>
        );
      },
    },
  ];

  const table = useReactTable({
    data: (data?.getAllCoursesByInstructurId ?? []) as (Course | null)[],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {/* Header */}
      <section className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-8">
        <h1 className="text-slate-12 text-[28px] leading-[34px] font-bold tracking-[-0.416px]">
          Courses
        </h1>
        <CreateCourseDialog refetch={refetch} />
      </section>

      {/* Empty state */}
      <div className="mx-auto w-full max-w-full px-6 md:max-w-5xl">
        {/* <div className="mb-4 grid grid-cols-2 flex-col gap-3 sm:gap-2">
          Search input and filters here
        </div> */}
        <div>
          {data?.getAllCoursesByInstructurId?.length === 0 ? (
            <div className="flex flex-row space-x-8">
              <div className="border-slate-6 relative flex h-80 grow items-center justify-center rounded-lg border">
                <div className="mx-auto flex max-w-md flex-col space-y-8 text-center">
                  <div className="flex flex-col space-y-2">
                    <h2 className="text-slate-12 text-xl font-bold tracking-[-0.16px]">
                      No courses added yet
                    </h2>
                    <span className="text-slate-11 text-sm font-normal">
                      Start by creating your first course to publish or schedule
                      it later.
                    </span>
                  </div>
                  <CreateCourseDialog refetch={refetch} />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <table className="min-w-full border-separate border-spacing-0 text-sm">
                <thead className="bg-sidebar">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="border-slate-6 text-slate-11 h-8 w-fit border-t border-b px-3 py-2 text-left text-xs font-semibold first:rounded-l-md first:border-l last:rounded-r-md last:border-r md:w-[216px]"
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
                    <tr key={row.id} className="border-b">
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="max-w-[250px] border-b px-4 py-2"
                        >
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
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
