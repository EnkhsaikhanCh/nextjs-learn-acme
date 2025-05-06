"use client";

import {
  Course,
  InstructorUserV2,
  useGetCoursePreviewDataQuery,
} from "@/generated/graphql";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import { CourseHero } from "./components/CourseHero";
import { CourseInstructor } from "./components/CourseInstructor";
import { CourseDescription } from "./components/CourseDescription";
import { CourseLearningOutcomes } from "./components/CourseLearningOutcomes";
import { CourseCurriculum } from "./components/CourseCurriculum";
import { CourseEnrollCTA } from "./components/CourseEnrollCTA";

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
  const courseInstructor = data.getCoursePreviewData.course.createdBy;
  const totalSections = data.getCoursePreviewData.totalSections;
  const totalLessons = data.getCoursePreviewData.totalLessons;
  const totalAllLessonsVideosHours =
    data.getCoursePreviewData.totalAllLessonsVideosHours;

  return (
    <div>
      <CourseHero
        course={course as Course}
        totalAllLessonsVideosHours={totalAllLessonsVideosHours as number}
      />

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-8 lg:col-span-2">
            <CourseInstructor
              courseInstructor={courseInstructor as InstructorUserV2}
            />
            <CourseDescription course={course as Course} />
            <CourseLearningOutcomes course={course as Course} />
            <CourseCurriculum
              course={course as Course}
              totalSections={totalSections as number}
              totalLessons={totalLessons as number}
              totalAllLessonsVideosHours={totalAllLessonsVideosHours as number}
            />

            {/* Mobile - only visible on mobile */}
            <CourseEnrollCTA course={course as Course} className="lg:hidden" />
          </div>

          {/* Sidebar - only visible on desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <CourseEnrollCTA
                course={course as Course}
                className="hidden lg:block"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
