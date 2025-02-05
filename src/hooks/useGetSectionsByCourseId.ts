import { useGetSectionsByCourseIdQuery } from "@/generated/graphql";

export function useGetSectionsByCourseId({ courseId }: { courseId: string }) {
  const {
    data: courseAllSectionsData,
    loading: courseAllSectionsLoading,
    error: courseAllSectionsError,
    refetch: courseAllSectionsRefetch,
  } = useGetSectionsByCourseIdQuery({
    variables: { courseId: courseId },
    skip: !courseId,
  });

  return {
    courseAllSectionsData,
    courseAllSectionsLoading,
    courseAllSectionsError,
    courseAllSectionsRefetch,
  };
}
