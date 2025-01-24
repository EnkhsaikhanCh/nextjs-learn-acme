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
    <div>
      <div>
        {loading && <p>Loading...</p>}
        {error && <p>Error fetching courses: {error.message}</p>}
        {data && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                <CardFooter className="flex justify-end">
                  <Link
                    target="_blank"
                    href={`/dashboard/${course._id}`}
                    passHref
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    <Button size={"sm"} className="font-semibold">
                      Хичээл үзэх
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
