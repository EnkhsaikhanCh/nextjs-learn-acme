import { Badge } from "@/components/ui/badge";
import { Course } from "@/generated/graphql";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface HeroSectionProps {
  course?: Course;
  totalSections: number;
  totalLessons: number;
}

export const HeroSection = ({
  course,
  totalSections,
  totalLessons,
}: HeroSectionProps) => {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-card relative overflow-hidden rounded-xl border p-6">
        <div className="absolute top-0 right-0 h-24 w-24"></div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {course?.title}
              </h1>
              <Badge
                variant="outline"
                className={cn(
                  "ml-2 transition-all",
                  course?.status === "PUBLISHED"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : course?.status === "ARCHIVED"
                      ? "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
                )}
              >
                {course?.status === "PUBLISHED"
                  ? "Published"
                  : course?.status === "ARCHIVED"
                    ? "Archived"
                    : "Draft"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <span>
                Last updated:{" "}
                {course?.updatedAt &&
                  new Date(course.updatedAt).toLocaleDateString("en-CA")}
              </span>
              <span>•</span>
              <span>
                {totalSections} modules • {totalLessons} lessons
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
