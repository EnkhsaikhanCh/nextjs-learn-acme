"use client";

import {
  Course,
  InstructorUserV2,
  useGetCoursePreviewDataQuery,
} from "@/generated/graphql";
import { ArrowLeft, Loader } from "lucide-react";
import { useParams } from "next/navigation";
import { CourseHero } from "./components/CourseHero";
import { CourseInstructor } from "./components/CourseInstructor";
import { CourseDescription } from "./components/CourseDescription";
import { CourseLearningOutcomes } from "./components/CourseLearningOutcomes";
import { CourseCurriculum } from "./components/CourseCurriculum";
import { CourseEnrollCTA } from "./components/CourseEnrollCTA";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CoursePage() {
  const { slug } = useParams();

  const { data, loading } = useGetCoursePreviewDataQuery({
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

  const response = data?.getCoursePreviewData;

  if (
    !response?.success ||
    !response.course ||
    !response.course.createdBy ||
    response.totalSections === null ||
    response.totalLessons === null ||
    response.totalLessonDurationSeconds === null ||
    response.totalLessonDurationHours === null
  ) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-6">
        <p className="font-semibold">
          {response?.message || "Something went wrong."}
        </p>
        <Link href="/dashboard">
          <Button size={"sm"} variant={"outline"}>
            <ArrowLeft />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  const {
    course,
    course: { createdBy: courseInstructor },
    totalSections,
    totalLessons,
    totalLessonDurationHours,
  } = response;

  return (
    <div>
      <CourseHero
        course={course as Course}
        totalLessonDurationHours={totalLessonDurationHours as number}
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
              totalLessonDurationHours={totalLessonDurationHours as number}
            />
            <CourseEnrollCTA course={course as Course} className="lg:hidden" />
          </div>

          {/* Sidebar */}
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
