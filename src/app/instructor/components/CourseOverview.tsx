"use client";

import { Course } from "@/generated/graphql";
import { HeroSection } from "./InstructorCourseOverviewComponents/HeroSection";
import { StudentsEnrolledCard } from "./InstructorCourseOverviewComponents/StudentsEnrolledCard";
import { AverageRatingCard } from "./InstructorCourseOverviewComponents/AverageRatingCard";
import { TotalRevenuewCard } from "./InstructorCourseOverviewComponents/TotalRevenueCard";

interface CourseOverviewProps {
  course: Course;
  totalSections: number;
  totalLessons: number;
  totalEnrollment: number;
  completionPercent: number;
  refetch: () => void;
}

export function CourseOverview({
  course,
  totalSections,
  totalLessons,
  totalEnrollment,
  completionPercent,
  // refetch,
}: CourseOverviewProps) {
  return (
    <div className="space-y-6">
      <HeroSection
        course={course}
        totalSections={totalSections}
        totalLessons={totalLessons}
        completionPercent={completionPercent}
      />

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StudentsEnrolledCard totalEnrollment={totalEnrollment} />
        <AverageRatingCard />
        <TotalRevenuewCard />
      </div>
    </div>
  );
}
