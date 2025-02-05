"use client";

import { useSession } from "next-auth/react";
import {
  useGetEnrollmentByUserAndCourseQuery,
  useMarkLessonAsCompletedMutation,
  useUndoLessonCompletionMutation,
} from "@/generated/graphql";
import { toast } from "sonner";
import { useState } from "react";

interface EnrollmentHookProps {
  courseId?: string;
}

export function useEnrollmentData({ courseId }: EnrollmentHookProps) {
  const [isLessonActionLoading, setLessonActionLoading] =
    useState<boolean>(false);
  const { data: session } = useSession();

  const userId = session?.user?.id;

  const {
    data: enrollmentData,
    loading: enrollmentLoading,
    error: enrollmentError,
    refetch: enrollmentRefetch,
  } = useGetEnrollmentByUserAndCourseQuery({
    variables: {
      userId: userId || "",
      courseId: courseId || "",
    },
    skip: !userId || !courseId,
  });

  const [markLessonAsCompleted] = useMarkLessonAsCompletedMutation();
  const [undoLessonCompletion] = useUndoLessonCompletionMutation();

  const handleMarkLessonAsCompleted = async (lessonId: string) => {
    if (!enrollmentData?.getEnrollmentByUserAndCourse?._id || !lessonId) return;
    setLessonActionLoading(true);

    try {
      const enrollmentId = enrollmentData.getEnrollmentByUserAndCourse._id;

      const response = await markLessonAsCompleted({
        variables: {
          input: { enrollmentId, lessonId },
        },
      });

      if (response.data?.markLessonAsCompleted) {
        toast.success("Lesson marked as completed");
        await enrollmentRefetch();
      }
    } catch (error) {
      toast.error(
        `Failed to mark lesson as completed: ${(error as Error).message}`,
      );
    } finally {
      setLessonActionLoading(false);
    }
  };

  const handleUndoLessonCompletion = async (lessonId: string) => {
    if (!enrollmentData?.getEnrollmentByUserAndCourse?._id || !lessonId) return;
    setLessonActionLoading(true);

    try {
      const enrollmentId = enrollmentData.getEnrollmentByUserAndCourse._id;

      const response = await undoLessonCompletion({
        variables: { input: { enrollmentId, lessonId } },
      });

      if (response.data?.undoLessonCompletion) {
        toast.success("Lesson undone");
        await enrollmentRefetch();
      }
    } catch (error) {
      toast.error(
        `Failed to undo lesson completion: ${(error as Error).message}`,
      );
    } finally {
      setLessonActionLoading(false);
    }
  };

  return {
    userId,
    enrollmentData,
    enrollmentLoading,
    enrollmentError,
    isLessonActionLoading,
    handleMarkLessonAsCompleted,
    handleUndoLessonCompletion,
  };
}
