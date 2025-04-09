import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetUserEnrolledCoursesQuery } from "@/generated/graphql";
import { Clock, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { mn } from "date-fns/locale"; // <- make sure to install this if not already

export const MyCoursesSection = ({ userId }: { userId?: string }) => {
  const { data, loading } = useGetUserEnrolledCoursesQuery({
    variables: {
      userId: userId as string,
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: !userId,
  });

  return (
    <>
      {/* My Courses */}
      <section>
        <h2 className="mb-4 text-xl font-bold md:text-2xl">Миний сургалтууд</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading && <div>Loading...</div>}
          {data?.getUserEnrolledCourses?.map((course) => (
            <Link
              href={`/dashboard/courses/${course?.courseId?.slug}`}
              key={course?._id}
              className="group"
            >
              <Card className="group shadow-sm">
                <CardHeader className="p-0">
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={
                        course?.courseId?.thumbnail ||
                        "/code.jpg?height=100&width=200"
                      }
                      alt={course?.courseId?.title || "Course image"}
                      width={400}
                      height={200}
                      className="h-48 w-full rounded-t-md object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute right-3 bottom-3 left-3">
                      <div className="mb-1 flex items-center gap-2">
                        <div className="rounded bg-white/20 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                          {(course?.progress ?? 0) < 30
                            ? "Шинэ эхэлсэн"
                            : (course?.progress ?? 0) < 70
                              ? "Үргэлжилж байна"
                              : (course?.progress ?? 0) < 99
                                ? "Дуусах дөхсөн"
                                : "Дууссан"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  <CardTitle className="line-clamp-1 text-lg">
                    {course?.courseId?.title}
                  </CardTitle>
                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-muted-foreground text-xs font-medium">
                        Явц
                      </span>
                      <span className="text-xs font-medium">
                        {(course?.progress ?? 0).toFixed()}%
                      </span>
                    </div>
                    <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                      <div
                        className={`h-full rounded-full ${
                          (course?.progress ?? 0) < 30
                            ? "bg-amber-500"
                            : (course?.progress ?? 0) < 70
                              ? "bg-violet-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${course?.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-muted-foreground mt-4 flex items-center gap-2 text-xs font-semibold">
                    <div className="bg-muted rounded-full p-1">
                      <Clock className="h-4 w-4" />
                    </div>
                    Сүүлийн хандалт:{" "}
                    {course?.lastAccessedAt
                      ? `${formatDistanceToNow(
                          new Date(course.lastAccessedAt),
                          {
                            addSuffix: true,
                            locale: mn,
                          },
                        )}`
                      : "N/A"}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end p-5 pt-0">
                  <Button
                    size="sm"
                    className="bg-violet-600 font-bold hover:bg-violet-700"
                  >
                    <Play />
                    Үргэлжлүүлэх
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};
