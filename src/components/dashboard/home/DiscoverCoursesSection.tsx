import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetUserNotEnrolledCoursesQuery } from "@/generated/graphql";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const DiscoverCoursesSection = ({ userId }: { userId?: string }) => {
  const { data, loading } = useGetUserNotEnrolledCoursesQuery({
    variables: {
      userId: userId as string,
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: !userId,
  });

  return (
    <>
      {/* Discover Courses */}
      <section className="mt-7 mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold md:text-2xl">Шинэ сургалтууд</h2>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading && <div>Loading...</div>}
          {data?.getUserNotEnrolledCourses?.map((course) => (
            <Link href={`/dashboard/courses/${course?.slug}`} key={course?._id}>
              <Card className="group shadow-sm">
                <CardHeader className="p-0">
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={
                        course?.thumbnail || "/code.jpg?height=100&width=200"
                      }
                      alt={course?.title || "Course image"}
                      width={400}
                      height={200}
                      className="h-48 w-full rounded-t-md object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute top-3 right-3 rounded-full bg-black/70 px-3 py-1 text-sm font-bold text-white backdrop-blur-sm">
                      ₮{course?.price?.amount}
                    </div>
                    <div className="absolute right-3 bottom-3 left-3">
                      <div className="mb-1 flex items-center gap-2">
                        <div className="rounded bg-white/20 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                          Шинэ сургалт
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  <CardTitle className="line-clamp-1 text-lg font-bold">
                    {course?.title}
                  </CardTitle>
                </CardContent>
                <CardFooter className="p-5 pt-0">
                  <Button className="w-full gap-2 bg-violet-600 hover:bg-violet-700">
                    <Plus />
                    Элсэх
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
