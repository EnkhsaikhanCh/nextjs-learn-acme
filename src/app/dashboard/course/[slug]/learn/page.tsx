"use client";

import { Button } from "@/components/ui/button";
import { Course, useGetCourseForEnrollmentQuery } from "@/generated/graphql";
import { ArrowLeft, Loader, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { Enrolled } from "../components/Enrolled";

export default function page() {
  const { slug } = useParams();

  const { data, loading, error } = useGetCourseForEnrollmentQuery({
    variables: { slug: slug as string },
    fetchPolicy: "cache-first",
  });

  if (loading) {
    return (
      <div className="text-muted-foreground flex items-center justify-center gap-2 p-6 text-sm">
        <p>Loading course data</p>
        <Loader className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  const response = data?.getCourseForEnrollment;

  if (!response?.success || error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-6 text-sm">
        <p className="text-destructive flex items-center gap-2 font-semibold">
          <TriangleAlert className="h-4 w-4" />
          {response?.message || "Something went wrong."}
        </p>
        <Link href="/dashboard">
          <Button size={"sm"} variant={"outline"}>
            <ArrowLeft />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  const { fullContent } = response;

  return <Enrolled course={fullContent as Course} />;
}
