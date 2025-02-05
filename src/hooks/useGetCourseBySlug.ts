import { useGetCourseBySlugQuery } from "@/generated/graphql";

export function useGetCourseBySlug({ slug }: { slug: string }) {
  const {
    data: fetchedCourseData,
    loading: fetchedCourseLoading,
    error: fetchedCourseError,
    refetch: fetchedCourseRefetch,
  } = useGetCourseBySlugQuery({
    variables: { slug: slug },
    skip: !slug,
  });

  return {
    fetchedCourseData,
    fetchedCourseLoading,
    fetchedCourseError,
    fetchedCourseRefetch,
  };
}
