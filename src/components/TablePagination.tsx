"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface TablePaginationProps {
  offset: number;
  limit: number;
  totalCount: number;
  onPageChange: (newOffset: number) => void;
}

export const TablePagination = ({
  offset,
  limit,
  totalCount,
  onPageChange,
}: TablePaginationProps) => {
  const canPrev = offset > 0;
  const canNext = offset + limit < totalCount;

  return (
    <div className="flex w-full flex-row items-center justify-end gap-4">
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.max(0, offset - limit))}
        disabled={!canPrev}
        size="sm"
      >
        <ArrowLeft size={16} />
      </Button>

      <span className="text-sm text-gray-600">
        Showing {offset + 1}–{Math.min(offset + limit, totalCount)} of{" "}
        {totalCount}
      </span>

      <Button
        variant="outline"
        onClick={() => onPageChange(offset + limit)}
        disabled={!canNext}
        size="sm"
      >
        <ArrowRight size={16} />
      </Button>
    </div>
  );
};
