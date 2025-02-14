"use client";

import { CircleCheck } from "lucide-react";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetLessonById } from "@/hooks/useGetLessonById";

interface LessonViewerProps {
  lessonId?: string;
  lessonTitle?: string;
  completedLessons: string[];
  onMarkComplete: () => void;
  onUndo: () => void;
  isLessonActionLoading: boolean;
}

export function LessonViewer({
  lessonId,
  lessonTitle,
  completedLessons,
  onMarkComplete,
  onUndo,
  isLessonActionLoading,
}: LessonViewerProps) {
  const { fetchedLessonData, fetchedLessonLoading, fetchedLessonError } =
    useGetLessonById({ id: lessonId || "" });

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

  if (fetchedLessonLoading) {
    return (
      <div className="flex items-center justify-center gap-2">
        <span>Хичээлийн дэлгэрэнгүй мэдээлэл ачаалж байна...</span>
        <Loader className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (fetchedLessonError) {
    return (
      <p className="text-red-500">
        Хичээлийг ачааллахад алдаа гарлаа: {fetchedLessonError.message}
      </p>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col items-center justify-between gap-2 md:flex-row">
          <CardTitle>
            {fetchedLessonData?.getLessonById?.title || lessonTitle}
          </CardTitle>
          <Button
            onClick={isCompleted ? onUndo : onMarkComplete}
            variant={"outline"}
            size={"sm"}
            disabled={isLessonActionLoading}
            className={`rounded-full font-semibold transition ${
              isCompleted
                ? "border-green-500 bg-green-100 text-green-500 hover:bg-green-200 hover:text-green-600"
                : "hover:border-green-600 hover:bg-green-100 hover:text-green-600"
            }`}
          >
            {isLessonActionLoading ? (
              <div className="flex items-center gap-2">
                <span>Ачаалж байна...</span>
                <Loader className="h-4 w-4 animate-spin" />
              </div>
            ) : isCompleted ? (
              <div className="flex items-center gap-2">
                <span>Буцаах</span>
                <CircleCheck className="h-4 w-4" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Дуусгасан тэмдэглэл хийх</span>
                <CircleCheck className="h-4 w-4" />
              </div>
            )}
          </Button>
        </CardHeader>
      </Card>

      <iframe
        src={getEmbedUrl(fetchedLessonData?.getLessonById?.videoUrl || "")}
        className="mt-2 aspect-video w-full rounded-lg"
        allowFullScreen
        allow="autoplay; encrypted-media"
      />
    </>
  );
}
