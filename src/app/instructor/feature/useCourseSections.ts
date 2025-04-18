import { useDeleteSectionMutation } from "@/generated/graphql";
import { useCallback } from "react";
import { toast } from "sonner";

interface useCourseSectionsProps {
  refetch: () => void;
}

export const useCourseSections = ({ refetch }: useCourseSectionsProps) => {
  const [deleteSection, { loading: deleting }] = useDeleteSectionMutation();

  const handleDelete = useCallback(
    async (id: string, title: string) => {
      try {
        await deleteSection({ variables: { id } });
        await refetch();
        toast.success(`Deleted “${title}”`);
      } catch (e) {
        toast.error("Could not delete section", {
          description: (e as Error).message,
        });
      }
    },
    [deleteSection, refetch],
  );

  return {
    deleting,
    handleDelete,
  };
};
