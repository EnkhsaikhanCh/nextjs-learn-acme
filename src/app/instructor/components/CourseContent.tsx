"use client";

import React from "react";
import { useGetInstructorCourseContentQuery } from "@/generated/graphql";
import { useParams } from "next/navigation";
import { Loader } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const CourseContent: React.FC = () => {
  const { slug } = useParams();
  const { data, loading, error } = useGetInstructorCourseContentQuery({
    variables: { slug: slug as string },
    skip: !slug,
  });

  if (loading) {
    return (
      <p className="text-muted-foreground flex items-center text-sm">
        Loading course content...
        <Loader className="ml-2 h-4 w-4 animate-spin" />
      </p>
    );
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const sections = data?.getInstructorCourseContent?.sectionId ?? [];

  if (sections.length === 0) {
    return <div>No sections found for this course.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Course Content</h1>
          <p className="mt-1 text-sm text-gray-500">
            Organize your course structure and materials
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="px-6">
          <CardTitle>Course Structure</CardTitle>
          <CardDescription>
            Organize your course content by modules and lessons
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Accordion type="multiple" className="space-y-2">
            {sections.map((section) => (
              <AccordionItem
                key={section?._id}
                value={section?._id as string}
                className={cn(
                  "mb-4 overflow-hidden rounded-lg border border-gray-200",
                )}
              >
                <AccordionTrigger className="group px-4 py-3 hover:bg-gray-50">
                  <div className="flex-1 text-left">
                    <h3 className="font-medium">{section?.title}</h3>
                    <p className="text-xs text-gray-500">
                      {section?.lessonId?.length}{" "}
                      {section?.lessonId?.length === 1 ? "lesson" : "lessons"}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4">
                    {section?.description && (
                      <p className="text-sm text-gray-600">
                        {section.description}
                      </p>
                    )}

                    {section?.lessonId && section.lessonId.length > 0 ? (
                      <ul className="mt-2 list-inside list-disc space-y-1">
                        {section.lessonId.map((lesson) =>
                          lesson ? (
                            <li key={lesson._id}>{lesson.title}</li>
                          ) : null,
                        )}
                      </ul>
                    ) : (
                      <div className="rounded-md border border-dashed border-gray-200 py-6 text-center text-sm text-gray-500">
                        No lessons yet. Add your first lesson to this module.
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};
