import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetUserNotEnrolledCoursesQuery } from "@/generated/graphql";
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

  if (loading) {
    return (
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted aspect-video animate-pulse rounded-xl" />
        <div className="bg-muted aspect-video animate-pulse rounded-xl" />
        <div className="bg-muted aspect-video animate-pulse rounded-xl" />
      </div>
    );
  }

  if (!data?.getUserNotEnrolledCourses?.length) {
    return;
  }

  return (
    <>
      {/* Discover Courses */}
      <section className="mt-7 mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold md:text-2xl">Сургалтууд</h2>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.getUserNotEnrolledCourses?.map((course) => (
            <Link href={`/dashboard/course/${course?.slug}`} key={course?._id}>
              <Card className="group w-full overflow-hidden ring-0 transition duration-200 hover:bg-emerald-50 hover:ring-2 hover:ring-emerald-500 focus:ring-2 dark:hover:bg-emerald-950">
                <CardHeader className="w-full p-0">
                  <div className="relative aspect-video w-full overflow-hidden rounded-t-md">
                    <CldImage
                      src={
                        course?.thumbnail?.publicId ||
                        "/code.jpg?height=100&width=200"
                      }
                      width={1280}
                      height={720}
                      crop="fill"
                      alt="Course Thumbnail"
                      key={course?.thumbnail?.publicId}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 will-change-transform group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 z-10 rounded-full bg-black/70 px-3 py-1 text-sm font-bold text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                      ₮{course?.price?.amount}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="line-clamp-1 text-lg font-bold">
                    {course?.title}
                  </CardTitle>
                  <CardDescription>{course?.subtitle}</CardDescription>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage
                          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${course?.createdBy?.profilePicture?.publicId}.${course?.createdBy?.profilePicture?.format}`}
                          alt="Instructor Profile Picture"
                          className="block"
                        />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium">
                          {course?.createdBy?.fullName}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};
