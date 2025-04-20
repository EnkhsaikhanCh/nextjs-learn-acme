"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Video, FileText, File, HelpCircle, BookOpen } from "lucide-react";

interface LessonHeaderProps {
  title?: string;
  type?: string;
  status?: string;
  onUpdate: (data: { title?: string; status?: string }) => void;
}

export function LessonHeader({
  title,
  type,
  status,
  onUpdate,
}: LessonHeaderProps) {
  const [lessonTitle, setLessonTitle] = useState(title);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLessonTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    if (lessonTitle !== title) {
      onUpdate({ title: lessonTitle });
    }
  };

  const getLessonTypeIcon = () => {
    switch (type) {
      case "VIDEO":
        return <Video className="h-4 w-4" />;
      case "TEXT":
        return <FileText className="h-4 w-4" />;
      case "FILE":
        return <File className="h-4 w-4" />;
      case "QUIZ":
        return <HelpCircle className="h-4 w-4" />;
      case "ASSIGNMENT":
        return <BookOpen className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getLessonTypeColor = () => {
    switch (type) {
      case "VIDEO":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "TEXT":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "FILE":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "QUIZ":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "ASSIGNMENT":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={cn("flex items-center gap-1.5", getLessonTypeColor())}
            >
              {getLessonTypeIcon()}
              {type}
            </Badge>
            <Badge variant="outline">{status}</Badge>
          </div>

          <Input
            value={lessonTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            className="h-auto border-none px-0 py-1 text-xl font-bold shadow-none focus-visible:ring-0 sm:text-2xl"
          />
        </div>
      </div>
    </div>
  );
}
