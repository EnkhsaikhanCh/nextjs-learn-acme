// src/app/dashboard/courses/page.tsx:
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { LoaderCircle } from "lucide-react";

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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCourseOpen = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push(`/dashboard/courses/${slug}`);
    }, 1500); // 1.5 секундын дараа шилжүүлнэ
  };

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
        <Button
          className="w-full bg-yellow-400 font-semibold text-black hover:bg-yellow-300"
          variant="default"
          onClick={handleCourseOpen}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Хичээл үзэх"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Courses() {
  const { data, loading, error, refetch } = useGetAllCourseQuery();

  if (loading) return <LoadingOverlay />;
  if (error) return <ErrorFallback error={error} reset={refetch} />;

  return (
    <div className="p-4">
      {data && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
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
    </div>
  );
}
