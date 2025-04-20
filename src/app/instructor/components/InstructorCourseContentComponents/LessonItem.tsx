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
  // GripVertical,
  Pencil,
  Trash2,
  //   Clock,
  Play,
  FileText,
  FileQuestion,
  File,
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
  deleting: boolean;
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
  deleting,
}: LessonItemProps) {
  //   const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const router = useRouter();

  // Get lesson icon based on type
  const getLessonIcon = () => {
    switch (lesson.type) {
      case LessonType.Video:
        return <Play className="h-4 w-4 text-blue-500" />;
      case LessonType.Text:
        return <FileText className="h-4 w-4 text-emerald-500" />;
      case LessonType.File:
        return <File className="h-4 w-4 text-purple-500" />;
      case LessonType.Quiz:
        return <FileQuestion className="h-4 w-4 text-amber-500" />;
      case LessonType.Assignment:
        return <File className="h-4 w-4 text-gray-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get badge color based on lesson type
  const getBadgeClasses = () => {
    switch (lesson.type) {
      case LessonType.Video:
        return "bg-blue-50 border-blue-300 dark:border-blue-500/30 dark:bg-blue-950";
      case LessonType.Text:
        return "bg-emerald-50  border-emerald-300 dark:border-emerald-500/30 dark:bg-emerald-950";
      case LessonType.File:
        return "bg-purple-50  border-purple-300 dark:border-purple-500/30 dark:bg-purple-950";
      case LessonType.Quiz:
        return "bg-amber-50  border-amber-300 dark:border-amber-500/30 dark:bg-amber-950";
      case LessonType.Assignment:
        return "bg-gray-50  border-gray-300 dark:border-gray-600 dark:bg-gray-900";
      default:
        return "bg-gray-50 border-gray-300 dark:border-gray-600 dark:bg-gray-900";
    }
  };

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between rounded-md border p-3 transition-all duration-200",
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

          <div className="flex-shrink-0">{getLessonIcon()}</div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{lesson.title}</p>
            <div className="mt-1 flex items-center gap-3">
              {/* {lesson.type === LessonType.Video && lesson.duration && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{lesson.duration}</span>
                </div>
              )} */}
              <Badge
                variant="outline"
                className={cn("px-1.5 py-0 text-xs", getBadgeClasses())}
              >
                {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="ml-2 flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-500 hover:text-gray-900"
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
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-500 hover:text-red-600"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Delete lesson</span>
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
