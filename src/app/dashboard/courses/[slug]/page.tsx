// src/app/dashboard/courses/[slug]/page.tsx
"use client";

import { Course, useGetCourseForUserQuery } from "@/generated/graphql";
import { useParams } from "next/navigation";
import CourseNotFound from "@/components/CourseNotFound";
import { Enrolled } from "./_components/ENROLLED/Enrolled";
import { Loader } from "lucide-react";

export default function CourseDetailPage() {
  const { slug } = useParams();

  const { data, loading, error } = useGetCourseForUserQuery({
    variables: { slug: slug as string },
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

  if (error?.graphQLErrors?.length) {
    const notFoundError = error.graphQLErrors.find((err) =>
      err.message.includes("Course not found"),
    );
    if (notFoundError) {
      return <CourseNotFound />;
    }
  }

  const courseForUser = data?.getCourseForUser;
  if (!courseForUser) {
    return <CourseNotFound />;
  }

  switch (courseForUser.status) {
    case "ENROLLED":
      return <Enrolled course={courseForUser.fullContent as Course} />;

    default:
      return <div>Unhandled status: {courseForUser.status}</div>;
  }
}
