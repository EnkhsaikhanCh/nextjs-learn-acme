import {
  CreateLessonV2Input,
  useCreateLessonV2Mutation,
} from "@/generated/graphql";
import { useCallback } from "react";
import { toast } from "sonner";

export const useCreateLessonV2 = ({ refetch }: { refetch: () => void }) => {
  const [createLessonV2, { loading: lessonV2Creating }] =
    useCreateLessonV2Mutation();

  const handleLessonV2Create = useCallback(
    async (input: CreateLessonV2Input) => {
      try {
        await createLessonV2({
          variables: { input },
        });
        await refetch();
        toast.success("LessonV2 create successfully");
      } catch (error) {
        toast.error("Failed to create LessonV2", {
          description: (error as Error).message,
        });
      }
    },
    [createLessonV2, refetch],
  );

  return {
    lessonV2Creating,
    handleLessonV2Create,
  };
};
