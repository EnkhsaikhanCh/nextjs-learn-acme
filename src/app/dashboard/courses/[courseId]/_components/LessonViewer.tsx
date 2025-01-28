"use client";

import { CircleCheck } from "lucide-react";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetLessonByIdQuery } from "@/generated/graphql";

interface LessonViewerProps {
  lessonId?: string;
  lessonTitle?: string;
  completedLessons: string[];
  onMarkComplete: () => void;
  onUndo: () => void;
}

export function LessonViewer({
  lessonId,
  lessonTitle,
  completedLessons,
  onMarkComplete,
  onUndo,
}: LessonViewerProps) {
  // Хичээлийн ID-аар дэлгэрэнгүй мэдээлэл татна
  const {
    data: lessonData,
    loading: lessonLoading,
    error: lessonError,
  } = useGetLessonByIdQuery({
    variables: { getLessonByIdId: lessonId || "" },
    skip: !lessonId,
  });

  const isCompleted = lessonId ? completedLessons.includes(lessonId) : false;

  // Youtube embed болгож хувиргах тусдаа функц
  function getEmbedUrl(url: string) {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    return match
      ? `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1&showinfo=0`
      : url;
  }

  if (!lessonId) {
    return <p className="text-gray-500">No lesson selected</p>;
  }

  if (lessonLoading) {
    return (
      <div className="flex items-center justify-center gap-2">
        <span>Loading lesson details...</span>
        <Loader className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (lessonError) {
    return (
      <p className="text-red-500">
        Error loading lesson: {lessonError.message}
      </p>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {lessonData?.getLessonById?.title || lessonTitle}
          </CardTitle>
          <Button
            onClick={isCompleted ? onUndo : onMarkComplete}
            variant={"outline"}
            size={"sm"}
            className={`font-semibold transition ${
              isCompleted
                ? "border-green-500 bg-green-100 text-green-500 hover:bg-green-200 hover:text-green-600"
                : "hover:border-green-600 hover:bg-green-100 hover:text-green-600"
            }`}
          >
            {isCompleted ? "Undo" : "Mark as Done"}
            <CircleCheck className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
      </Card>

      <iframe
        src={getEmbedUrl(lessonData?.getLessonById?.videoUrl || "")}
        className="mt-2 aspect-video w-full rounded-lg"
        allowFullScreen
        allow="autoplay; encrypted-media"
      />
    </>
  );
}
