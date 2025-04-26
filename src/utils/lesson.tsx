// src/utils/lesson.ts

import { LessonType } from "@/generated/graphql";
import { Video, FileText, File, HelpCircle, BookOpen } from "lucide-react";

export function getLessonTypeColor(type?: LessonType): string {
  switch (type) {
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
}

export function getLessonTypeIcon(type?: LessonType | null) {
  switch (type) {
    case LessonType.Video:
      return <Video className="h-4 w-4 text-blue-500" />;
    case LessonType.Text:
      return <FileText className="h-4 w-4 text-emerald-500" />;
    case LessonType.File:
      return <File className="h-4 w-4 text-purple-500" />;
    case LessonType.Quiz:
      return <HelpCircle className="h-4 w-4 text-amber-500" />;
    case LessonType.Assignment:
      return <BookOpen className="h-4 w-4 text-gray-500" />;
    default:
      return <File className="h-4 w-4 text-gray-500" />;
  }
}
