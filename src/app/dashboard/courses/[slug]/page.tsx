// src/app/dashboard/courses/[slug]/page.tsx
"use client";

import { Course, useGetCourseForUserQuery } from "@/generated/graphql";
import { useParams } from "next/navigation";
import { NotEnrolled } from "./_components/NOT_ENROLLED/NotEnrolled";
import { LoadingScreen } from "@/components/LoadingScreen";
import CourseNotFound from "@/components/CourseNotFound";
import { Enrolled } from "./_components/ENROLLED/Enrolled";

export default function CourseDetailPage() {
  const { slug } = useParams();

  const { data, loading, error } = useGetCourseForUserQuery({
    variables: { slug: slug as string },
  });

  if (loading) return <LoadingScreen label="Loading courses..." />;
  if (error?.graphQLErrors?.length) {
    const notFoundError = error.graphQLErrors.find((err) =>
      err.message.includes("Course not found"),
    );
    if (notFoundError) {
      return <CourseNotFound />;
    }
  }

  const courseForUser = data?.getCourseForUser;
  if (!courseForUser) return <CourseNotFound />;

  switch (courseForUser.status) {
    case "ADMIN_ENROLLED":
    case "ENROLLED":
      return <Enrolled course={courseForUser.fullContent as Course} />;

    case "ADMIN_NOT_ENROLLED":
    case "NOT_ENROLLED":
    case "GUEST":
      return <NotEnrolled course={courseForUser.coursePreviewData as Course} />;

    default:
      return <div>Unhandled status: {courseForUser.status}</div>;
  }
}
