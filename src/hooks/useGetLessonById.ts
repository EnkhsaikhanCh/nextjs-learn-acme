import { useGetLessonByIdQuery } from "@/generated/graphql";

export function useGetLessonById({ id }: { id: string }) {
  const {
    data: fetchedLessonData,
    loading: fetchedLessonLoading,
    error: fetchedLessonError,
    refetch: fetchedLessonRefetch,
  } = useGetLessonByIdQuery({
    variables: { id: id },
  });

  return {
    fetchedLessonData,
    fetchedLessonLoading,
    fetchedLessonError,
    fetchedLessonRefetch,
  };
}
