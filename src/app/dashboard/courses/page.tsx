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
  CardDescription,
} from "@/components/ui/card";
import { useGetAllCourseQuery } from "@/generated/graphql";
import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
  slug?: string;
  title?: string;
  description?: string;
  image?: string;
}

function CourseCard({
  slug,
  title,
  description,
  image = "/placeholder.svg?height=100&width=200",
}: CourseCardProps) {
  return (
    <Card>
      <CardHeader className="p-0">
        <div className="relative w-full overflow-hidden rounded-t-md">
          <Image
            src={image}
            alt={title || "Course image"}
            width={400}
            height={200}
            className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {description && (
          <CardDescription className="mt-2 line-clamp-3 text-sm text-slate-600">
            {description}
          </CardDescription>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/dashboard/courses/${slug}`} className="w-full">
          <Button
            className="w-full bg-yellow-400 font-semibold text-black hover:bg-yellow-300"
            variant="default"
          >
            Хичээл үзэх
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function Courses() {
  const { data, loading, error, refetch } = useGetAllCourseQuery();

  if (error) return <ErrorFallback error={error} reset={refetch} />;

  return (
    <main className="p-4">
      {loading && (
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video animate-pulse rounded-xl bg-muted" />
          <div className="aspect-video animate-pulse rounded-xl bg-muted" />
          <div className="aspect-video animate-pulse rounded-xl bg-muted" />
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.getAllCourse.map((course, index) => (
            <CourseCard
              key={index}
              slug={course.slug || ""}
              title={course.title}
              image={
                course.thumbnail || "/placeholder.svg?height=100&width=200"
              }
            />
          ))}
        </div>
      )}
    </main>
  );
}
