"use client";

import type React from "react";
import { useRouter } from "next/navigation";
// import { useState } from "react";
// import type { Lesson } from "@/types/course";
import { Button } from "@/components/ui/button";
// import { LessonForm } from "@/components/course-management/lesson-form";
// import { DeleteConfirmation } from "@/components/course-management/delete-confirmation";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Loader2,
  LockOpen,
  // GripVertical,
  Pencil,
  Trash2,
  //   Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LessonType, LessonV2 } from "@/generated/graphql";
import { DeleteConfirmation } from "@/components/delete-confirmation";
import { useState } from "react";
import { getLessonTypeColor, getLessonTypeIcon } from "@/utils/lesson";

interface LessonItemProps {
  lesson: LessonV2;
  //   onDragStart: () => void;
  //   onDragOver: (e: React.DragEvent) => void;
  //   onDragEnd: () => void;
  //   onDrop: (e: React.DragEvent) => void;
  //   isDragging: boolean;
  //   isDragOver: boolean;
  //   onEdit: () => void;
  onDelete: (id: string) => void;
  deletingLessonId: string | null;
  deleting: boolean;
  mainRefetch: () => void;
}

export function LessonItem({
  lesson,
  //   onDragStart,
  //   onDragOver,
  //   onDragEnd,
  //   onDrop,
  //   isDragging,
  //   isDragOver,
  //   onEdit,
  onDelete,
  deletingLessonId,
  deleting,
  mainRefetch,
}: LessonItemProps) {
  //   const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const router = useRouter();

  function formatToMMSS(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <>
      <div
        className={cn(
          "bg-card flex items-center justify-between rounded-md border p-3 transition-all duration-200",
          //   isDragging ? "opacity-50" : "opacity-100",
          //   isDragOver
          //     ? "border-emerald-500 bg-emerald-50"
          //     : "border-gray-200 hover:bg-gray-50",
        )}
        // draggable
        // onDragStart={onDragStart}
        // onDragOver={onDragOver}
        // onDragEnd={onDragEnd}
        // onDrop={onDrop}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {/* <div
            className="cursor-grab rounded-md p-1 transition-colors hover:bg-gray-100 active:cursor-grabbing"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div> */}

          <div className="flex-shrink-0">{getLessonTypeIcon(lesson.type)}</div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{lesson.title}</p>
            <div className="mt-1 flex items-center gap-1.5">
              {lesson.type === LessonType.Video &&
              "duration" in lesson &&
              typeof lesson.duration === "number" ? (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{formatToMMSS(lesson.duration)}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>Video not upload</span>
                </div>
              )}

              <Badge
                variant="outline"
                className={cn(
                  "px-1.5 py-0 text-xs",
                  getLessonTypeColor(lesson.type),
                )}
              >
                {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
              </Badge>

              {lesson.isPublished ? (
                <Badge className="border border-green-400 bg-green-200 px-1.5 py-0 text-xs text-black dark:border-green-900 dark:bg-green-950 dark:text-green-400">
                  Published
                </Badge>
              ) : (
                <Badge className="border border-yellow-400 bg-yellow-200 px-1.5 py-0 text-xs text-black hover:bg-yellow-200 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-400">
                  Unpublished
                </Badge>
              )}

              {lesson.isFree && (
                <Badge className="gap-1 border border-orange-400 bg-orange-200 px-1.5 py-0 text-xs text-black dark:border-orange-900 dark:bg-orange-950 dark:text-orange-400">
                  <LockOpen className="h-2.5 w-2.5 text-orange-500" />
                  Free
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="ml-2 flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"outline"}
                  size="icon"
                  className="h-7 w-7"
                  disabled={deletingLessonId === lesson._id}
                  onClick={() => {
                    router.push(
                      `/instructor/courses/${lesson.sectionId?.courseId?.slug}/lesson/${lesson._id}/edit`,
                    );
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="sr-only">Edit lesson</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit lesson</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"outline"}
                  size="icon"
                  className="h-7 w-7 hover:text-red-600"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                >
                  {deletingLessonId !== lesson._id ? (
                    <>
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete lesson</span>
                    </>
                  ) : (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete lesson</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* <LessonForm
        open={isEditLessonOpen}
        onOpenChange={setIsEditLessonOpen}
        onSubmit={onEdit}
        title="Edit Lesson"
        defaultValues={lesson}
      /> */}

      <DeleteConfirmation
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={async () => {
          await onDelete(lesson._id);
          await mainRefetch();
          setIsDeleteConfirmOpen(false);
        }}
        loading={deleting}
        confirmName={lesson.title}
        title="Delete Lesson"
        description={`Are you sure you want to delete "${lesson.title}"? This action cannot be undone.`}
      />
    </>
  );
}
