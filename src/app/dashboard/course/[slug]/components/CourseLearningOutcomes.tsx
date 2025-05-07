"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Course } from "@/generated/graphql";
import { CircleCheck } from "lucide-react";

interface CourseLearningOutcomesProps {
  course: Course;
}

export const CourseLearningOutcomes = ({
  course,
}: CourseLearningOutcomesProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="mb-4 text-xl font-semibold">What You'll Learn</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {course.whatYouWillLearn?.map((item, index) => {
            return (
              <div
                key={index}
                className="flex items-start gap-3 rounded-md p-2 transition-all duration-200"
              >
                <div className="mt-1 rounded-full bg-emerald-100 p-1.5 text-emerald-600 transition-all duration-200">
                  <CircleCheck className="h-4 w-4" />
                </div>
                <span>{item}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
