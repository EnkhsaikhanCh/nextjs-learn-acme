import {
  UpdateSectionInput,
  useUpdateSectionMutation,
} from "@/generated/graphql";
import { useCallback } from "react";
import { toast } from "sonner";

export function useUpdateCourseSection({ refetch }: { refetch: () => void }) {
  const [updateSection, { loading: updating }] = useUpdateSectionMutation();

  const handleUpdate = useCallback(
    async (id: string, input: UpdateSectionInput) => {
      try {
        await updateSection({
          variables: { id, input },
        });
        await refetch();
        toast.success(`Section updated successfully`);
      } catch (e) {
        toast.error("Failed to update section", {
          description: (e as Error).message,
        });
      }
    },
    [updateSection, refetch],
  );

  return {
    updating,
    handleUpdate,
  };
}
