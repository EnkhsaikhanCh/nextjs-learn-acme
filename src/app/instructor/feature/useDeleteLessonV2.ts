import { useDeleteLessonV2Mutation } from "@/generated/graphql";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseDeleteLessonV2Props {
  refetch: () => void;
}

export const useDeleteLessonV2 = ({ refetch }: UseDeleteLessonV2Props) => {
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);

  const [deleteLesson, { loading: lessonV2Deleting }] =
    useDeleteLessonV2Mutation();

  const handleDeleteLessonV2 = useCallback(
    async (id: string) => {
      setDeletingLessonId(id);
      try {
        await deleteLesson({ variables: { id } });
        toast.success(`Lesson deleted`);
      } catch (e) {
        toast.error("Could not delete lesson", {
          description: (e as Error).message,
        });
        return;
      } finally {
        setDeletingLessonId(null);
      }

      // Refetch-г амжилттай устгасны дараа хий, алдаа нь чухал биш
      try {
        await refetch();
      } catch {
        toast.error("Refetch failed after deletion");
      }
    },
    [deleteLesson, refetch],
  );

  return {
    lessonV2Deleting,
    handleDeleteLessonV2,
    deletingLessonId,
  };
};
