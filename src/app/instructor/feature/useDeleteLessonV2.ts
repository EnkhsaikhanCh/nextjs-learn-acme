import { useDeleteLessonV2Mutation } from "@/generated/graphql";
import { useCallback } from "react";
import { toast } from "sonner";

interface UseDeleteLessonV2Props {
  refetch: () => void;
}

export const useDeleteLessonV2 = ({ refetch }: UseDeleteLessonV2Props) => {
  const [deleteLesson, { loading: lessonV2Deleting }] =
    useDeleteLessonV2Mutation();

  const handleDeleteLessonV2 = useCallback(
    async (id: string) => {
      try {
        await deleteLesson({ variables: { id } });
        await refetch();
        toast.success(`Deleted `);
      } catch (e) {
        toast.error("Could not delete lesson", {
          description: (e as Error).message,
        });
      }
    },
    [deleteLesson, refetch],
  );

  return {
    lessonV2Deleting,
    handleDeleteLessonV2,
  };
};
