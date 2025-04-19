import {
  CreateLessonInput,
  useCreateLessonMutation,
} from "@/generated/graphql";
import { useCallback } from "react";
import { toast } from "sonner";

export const useCerateLesson = ({ refetch }: { refetch: () => void }) => {
  const [createLesson, { loading: lessonCreating }] = useCreateLessonMutation();

  const handleLessonCreate = useCallback(
    async (input: CreateLessonInput) => {
      try {
        await createLesson({
          variables: { input },
        });
        await refetch();
        toast.success("Lesson create successfully");
      } catch (error) {
        toast.error("Failed to update section", {
          description: (error as Error).message,
        });
      }
    },
    [createLesson, refetch],
  );

  return {
    lessonCreating,
    handleLessonCreate,
  };
};
