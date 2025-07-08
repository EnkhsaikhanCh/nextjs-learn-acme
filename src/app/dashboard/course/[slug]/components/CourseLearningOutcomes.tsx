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
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {course.whatYouWillLearn?.map((item, index) => (
            <div key={index} className="flex items-center gap-3 rounded-md p-2">
              <div className="mt-1 rounded-full bg-emerald-100 p-[3px] text-emerald-600">
                <CircleCheck className="h-4 w-4" />
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
