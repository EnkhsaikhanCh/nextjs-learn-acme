"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Course } from "@/generated/graphql";
import { cn } from "@/lib/utils";
import { ArrowRightFromLine, CircleCheck, GraduationCap } from "lucide-react";
import Link from "next/link";

interface CourseEnrollCTAProps {
  course: Course;
  className?: string;
  isEnrolled?: boolean;
}

export function CourseEnrollCTA({
  course,
  className,
  isEnrolled,
}: CourseEnrollCTAProps) {
  return (
    <Card
      className={cn("overflow-hidden transition-all duration-300", className)}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {isEnrolled ? (
            <Link href={`/dashboard/course/${course.slug}/learn`}>
              <Button
                variant="outline"
                className="w-full border border-emerald-800 bg-emerald-100 py-6 text-base font-bold text-emerald-600 hover:bg-emerald-200 hover:text-emerald-700 active:bg-emerald-300 dark:border-emerald-700 dark:bg-emerald-900 dark:text-emerald-200 dark:hover:bg-emerald-800 dark:hover:text-white dark:active:bg-emerald-700"
                size="lg"
              >
                Go to Course
                <ArrowRightFromLine />
              </Button>
            </Link>
          ) : (
            <>
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    ₮{course.price?.amount}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border border-emerald-800 bg-emerald-100 py-6 text-base font-bold text-emerald-600 hover:bg-emerald-200 hover:text-emerald-700 active:bg-emerald-300 dark:border-emerald-700 dark:bg-emerald-900 dark:text-emerald-200 dark:hover:bg-emerald-800 dark:hover:text-white dark:active:bg-emerald-700"
                size="lg"
              >
                <GraduationCap />
                Enroll Now
              </Button>
            </>
          )}

          <div className="space-y-3 pt-2">
            <h3 className="font-semibold">This course includes:</h3>
            <div className="space-y-2">
              {course.price?.description?.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CircleCheck className="mt-0.5 h-4 w-4 text-emerald-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
