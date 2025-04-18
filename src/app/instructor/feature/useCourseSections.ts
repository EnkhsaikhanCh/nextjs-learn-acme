import {
  useDeleteSectionMutation,
  useGetInstructorCourseContentQuery,
} from "@/generated/graphql";
import { useCallback } from "react";
import { toast } from "sonner";

export function useCourseSections(slug: string) {
  const { data, loading, error, refetch } = useGetInstructorCourseContentQuery({
    variables: { slug },
    skip: !slug,
  });

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
    sections: data?.getInstructorCourseContent?.sectionId ?? [],
    courseId: data?.getInstructorCourseContent?._id,
    loading,
    error,
    deleting,
    refetch,
    handleDelete,
  };
}
