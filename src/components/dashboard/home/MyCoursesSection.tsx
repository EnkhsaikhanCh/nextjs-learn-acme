import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CirclePlay, Clock } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { mn } from "date-fns/locale";
import { CldImage } from "next-cloudinary";
import { useMyEnrolledCoursesV2Query } from "@/generated/graphql";

export const MyCoursesSection = () => {
  const { data, loading, error } = useMyEnrolledCoursesV2Query({
    fetchPolicy: "cache-first",
  });

  if (loading) {
    return (
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted aspect-video animate-pulse rounded-xl" />
        <div className="bg-muted aspect-video animate-pulse rounded-xl" />
        <div className="bg-muted aspect-video animate-pulse rounded-xl" />
      </div>
    );
  }

  if (!data?.myEnrolledCoursesV2?.enrollments?.length) {
    return;
  }

  const response = data?.myEnrolledCoursesV2;

  const { enrollments } = response;

  return (
    <>
      {/* My Courses */}
      <section>
        <h2 className="mb-4 text-xl font-bold md:text-2xl">Миний сургалтууд</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {error && (
            <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
              <h1 className="text-4xl font-bold text-gray-800">
                Алдаа гарлаа!
              </h1>
              <p className="text-lg text-gray-600">
                Та дахин оролдоно уу эсвэл админтай холбогдоно уу.
              </p>
            </div>
          )}
          {enrollments?.map((course) => (
            <Link
              href={`/dashboard/course/${course?.courseId?.slug}/learn`}
              key={course?._id}
              className="group"
            >
              <Card className="group shadow-sm">
                <CardHeader className="p-0">
                  <div className="relative w-full overflow-hidden">
                    <CldImage
                      src={
                        course?.courseId?.thumbnail?.publicId ||
                        "/code.jpg?height=100&width=200"
                      }
                      width={1280}
                      height={720}
                      crop="fill"
                      alt="Course Thumbnail"
                      className="aspect-video h-48 w-full rounded-t-md object-cover"
                      key={course?.courseId?.thumbnail?.publicId}
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
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <CirclePlay />
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
