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
import { useGetAllCourseQuery } from "@/generated/graphql";
import Image from "next/image";
import Link from "next/link";

export default function Courses() {
  const { data, loading, error } = useGetAllCourseQuery();

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
          {data?.getAllCourse.map((course, index) => (
            <Link href={`/dashboard/courses/${course.slug}`} key={index}>
              <Card className="shadow-none">
                <CardHeader className="p-0">
                  <div className="relative w-full overflow-hidden rounded-t-md">
                    <Image
                      src={
                        course.thumbnail ||
                        "/placeholder.svg?height=100&width=200"
                      }
                      alt={course.title || "Course image"}
                      width={400}
                      height={200}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl font-semibold">
                    {course.title}
                  </CardTitle>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full">Хичээл үзэх</Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
