import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetUserEnrolledCoursesCountQuery } from "@/generated/graphql";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";

export function MyCourseSummary({ userId }: { userId?: string }) {
  const { data, loading, error } = useGetUserEnrolledCoursesCountQuery({
    variables: {
      userId: userId || "",
    },
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!data) {
    return <div>No data found</div>;
  }

  const {
    totalCourses,
    completedCount,
    inProgressCount,
    courseCompletionPercentage,
  } = data.getUserEnrolledCoursesCount;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>My Courses Summary</CardTitle>
            <CardDescription>Overview of your learning journey</CardDescription>
          </div>
          <div className="rounded-full border bg-gray-100 p-2 text-gray-600 dark:bg-gray-900/30 dark:text-gray-300">
            <BookOpen className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center rounded-lg bg-gradient-to-br from-violet-50 to-violet-100 p-4 dark:from-violet-900/20 dark:to-violet-900/30">
            <span className="text-2xl font-bold text-violet-600 dark:text-violet-300">
              {totalCourses}
            </span>
            <span className="mt-1 text-center text-xs font-semibold text-violet-600/80 dark:text-violet-300/80">
              Total Courses
            </span>
          </div>

          <div className="flex flex-col items-center rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-4 dark:from-green-900/20 dark:to-green-900/30">
            <span className="text-2xl font-bold text-green-600 dark:text-green-300">
              {completedCount}
            </span>
            <span className="mt-1 text-center text-xs font-semibold text-green-600/80 dark:text-green-300/80">
              Completed
            </span>
          </div>

          <div className="flex flex-col items-center rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 p-4 dark:from-amber-900/20 dark:to-amber-900/30">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-300">
              {inProgressCount}
            </span>
            <span className="mt-1 text-center text-xs font-semibold text-amber-600/80 dark:text-amber-300/80">
              In Progress
            </span>
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center gap-2 rounded-lg">
          <div className="flex w-full justify-between font-semibold">
            <span>Course Completion</span>
            <span>{courseCompletionPercentage}%</span>
          </div>
          <Progress value={courseCompletionPercentage} />
        </div>
      </CardContent>
    </Card>
  );
}
