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
import { CldImage } from "next-cloudinary";
import Link from "next/link";

export const DiscoverCoursesSection = ({ userId }: { userId?: string }) => {
  const { data, loading } = useGetUserNotEnrolledCoursesQuery({
    variables: {
      userId: userId as string,
    },
    fetchPolicy: "cache-first",
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
                  <div className="relative w-full overflow-hidden">
                    <CldImage
                      src={
                        course?.thumbnail?.publicId ||
                        "/code.jpg?height=100&width=200"
                      }
                      width={1280}
                      height={720}
                      crop="fill"
                      alt="Course Thumbnail"
                      className="aspect-video h-48 w-full rounded-t-md object-cover"
                      key={course?.thumbnail?.publicId}
                    />
                    <div className="absolute top-3 right-3 rounded-full bg-black/70 px-3 py-1 text-sm font-bold text-white backdrop-blur-sm">
                      ₮{course?.price?.amount}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  <CardTitle className="line-clamp-1 text-lg font-bold">
                    {course?.title}
                  </CardTitle>
                </CardContent>
                <CardFooter className="p-5 pt-0">
                  <Button className="w-full gap-2 bg-violet-600 font-semibold text-white hover:bg-violet-700">
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
