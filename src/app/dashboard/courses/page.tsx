// src/app/dashboard/courses/page.tsx:
"use client";

import ErrorFallback from "@/components/ErrorFallback";
import { LoadingOverlay } from "@/components/LoadingOverlay";
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
  const { data, loading, error, refetch } = useGetAllCourseQuery();

  if (loading) return <LoadingOverlay />;
  if (error) return <ErrorFallback error={error} reset={refetch} />;

  return (
    <div className="p-4">
      {data && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {data?.getAllCourse.map((course, index) => (
            <Card key={index} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={"/placeholder.svg?height=100&width=200"}
                  className="aspect-video w-full rounded-md object-cover"
                  alt={course.title || "Course image"}
                  width={200}
                  height={100}
                />
              </CardContent>
              <CardFooter className="">
                <Link
                  href={`/dashboard/courses/${course._id}`}
                  passHref
                  className="flex w-full cursor-pointer justify-end"
                >
                  <Button className="w-full bg-yellow-400 font-semibold text-black hover:bg-yellow-300 md:w-1/2">
                    Хичээл үзэх
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
