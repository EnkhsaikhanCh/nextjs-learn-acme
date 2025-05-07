"use client";

import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Course } from "@/generated/graphql";
import { format } from "date-fns";

interface CourseHeroProps {
  course: Course;
  totalAllLessonsVideosHours: number;
}

export const CourseHero = ({
  course,
  totalAllLessonsVideosHours,
}: CourseHeroProps) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 to-emerald-700 text-white">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex flex-col gap-8">
          <div
            className={cn(
              "flex transform flex-col gap-4 transition-all duration-700",
            )}
          >
            <div className="space-y-1">
              <Badge className="border-none bg-emerald-500 text-white hover:bg-emerald-600">
                {course.category}
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                {course.title}
              </h1>
              <p className="max-w-3xl text-xl text-emerald-50">
                {course.subtitle}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-sm text-emerald-50">
              <div className="flex items-center gap-1.5 rounded-md bg-white/30 px-3 py-1 backdrop-blur-sm dark:bg-black/30">
                <BarChart className="h-4 w-4" />
                <span>{course.difficulty}</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-md bg-white/30 px-3 py-1 backdrop-blur-sm dark:bg-black/30">
                <Clock className="h-4 w-4" />
                <span>{totalAllLessonsVideosHours} hours of content</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md bg-white/30 px-3 py-1 backdrop-blur-sm dark:bg-black/30">
                <Calendar className="h-4 w-4" />
                <span>
                  {course.updatedAt
                    ? format(new Date(course.updatedAt), "MMMM d, yyyy")
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
