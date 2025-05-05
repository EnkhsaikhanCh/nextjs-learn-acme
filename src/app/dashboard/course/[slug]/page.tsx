"use client";

import { Course, useGetCoursePreviewDataQuery } from "@/generated/graphql";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import { CourseHero } from "./components/CourseHero";

export default function CoursePage() {
  const { slug } = useParams();

  const { data, loading, error } = useGetCoursePreviewDataQuery({
    variables: {
      slug: slug as string,
    },
    fetchPolicy: "cache-first",
  });

  if (loading) {
    return (
      <div className="text-muted-foreground flex items-center justify-center gap-2 p-6 text-sm">
        <p>Loading course data</p>
        <Loader className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center gap-2 p-6 text-sm text-red-500">
        <p>Failed to load course data</p>
      </div>
    );
  }

  if (!data?.getCoursePreviewData?.course) {
    return (
      <div className="flex items-center justify-center gap-2 p-6 text-sm text-red-500">
        <p>Course not found</p>
      </div>
    );
  }

  const course = data.getCoursePreviewData.course;
  const totalAllLessonsVideosHours =
    data.getCoursePreviewData.totalAllLessonsVideosHours;

  return (
    <div>
      <CourseHero
        course={course as Course}
        totalAllLessonsVideosHours={totalAllLessonsVideosHours as number}
      />
    </div>
  );
}
