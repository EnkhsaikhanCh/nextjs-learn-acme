"use client";

import {
  Course,
  useGetCourseDetailsForInstructorQuery,
} from "@/generated/graphql";
import { useParams } from "next/navigation";
import { HeroSection } from "./InstructorCourseOverviewComponents/HeroSection";
import { StudentsEnrolledCard } from "./InstructorCourseOverviewComponents/StudentsEnrolledCard";
import { AverageRatingCard } from "./InstructorCourseOverviewComponents/AverageRatingCard";
import { TotalRevenuewCard } from "./InstructorCourseOverviewComponents/TotalRevenueCard";
import { Loader } from "lucide-react";

export function CourseOverview() {
  const { slug } = useParams();

  const { data, loading, error } = useGetCourseDetailsForInstructorQuery({
    variables: { slug: slug as string },
  });

  if (loading) {
    return (
      <p className="text-muted-foreground flex items-center text-sm">
        Loading course...
        <Loader className="ml-2 h-4 w-4 animate-spin" />
      </p>
    );
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <HeroSection
        course={data?.getCourseDetailsForInstructor?.course as Course}
        loading={loading}
        totalSections={
          data?.getCourseDetailsForInstructor?.totalSections as number
        }
        totalLessons={
          data?.getCourseDetailsForInstructor?.totalLessons as number
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StudentsEnrolledCard
          loading={loading}
          totalEnrollment={
            data?.getCourseDetailsForInstructor?.totalEnrollment as number
          }
        />
        <AverageRatingCard />
        <TotalRevenuewCard />
      </div>
    </div>
  );
}
