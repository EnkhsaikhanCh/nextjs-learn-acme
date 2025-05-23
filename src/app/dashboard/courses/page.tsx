// src/app/dashboard/courses/page.tsx:
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetAllCourseWithEnrollmentQuery } from "@/generated/graphql";
import { CldImage } from "next-cloudinary";
import Link from "next/link";

export default function Courses() {
  const { data, loading, error } = useGetAllCourseWithEnrollmentQuery({
    fetchPolicy: "cache-first",
  });

  return (
    <main className="p-4">
      {loading && (
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted aspect-video animate-pulse rounded-xl" />
          <div className="bg-muted aspect-video animate-pulse rounded-xl" />
          <div className="bg-muted aspect-video animate-pulse rounded-xl" />
        </div>
      )}
      {error && (
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-gray-800">Алдаа гарлаа!</h1>
          <p className="text-lg text-gray-600">
            Та дахин оролдоно уу эсвэл админтай холбогдоно уу.
          </p>
        </div>
      )}
      {data && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.getAllCourseWithEnrollment.map((course, index) => (
            <Link href={`/dashboard/course/${course.slug}`} key={index}>
              <Card className="shadow-none">
                <CardHeader className="p-0">
                  <div className="relative w-full overflow-hidden">
                    <CldImage
                      src={
                        course.thumbnail?.publicId ||
                        "/code.jpg?height=100&width=200"
                      }
                      width={1280}
                      height={720}
                      crop="fill"
                      alt="Course Thumbnail"
                      className={`aspect-video h-48 w-full rounded-t-md object-cover`}
                      key={course.thumbnail?.publicId}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl font-semibold">
                    {course.title}
                  </CardTitle>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full">
                    {course.isEnrolled ? "Хичээл үзэх" : "Дэлгэрэнгүй"}
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
