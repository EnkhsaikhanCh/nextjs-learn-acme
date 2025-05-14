"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Course } from "@/generated/graphql";
import { getLessonTypeIcon } from "@/utils/lesson";

interface CourseCurriculumProps {
  course: Course;
  totalSections: number;
  totalLessons: number;
  totalLessonDurationHours: number;
}

export const CourseCurriculum: React.FC<CourseCurriculumProps> = ({
  course,
  totalSections,
  totalLessons,
  totalLessonDurationHours,
}) => {
  const [expandedAll, setExpandedAll] = useState(false);

  // Extract all section IDs for expand/collapse logic
  const sectionIds = useMemo(
    () => course.sectionId?.map((sec) => sec?._id ?? "") ?? [],
    [course.sectionId],
  );

  // First section to open by default when collapsed
  const defaultOpenId = sectionIds.length > 0 ? sectionIds[0] : "";

  const toggleExpandAll = () => setExpandedAll((prev) => !prev);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">Course Curriculum</h2>
            <p className="text-sm text-gray-500">
              {totalSections} sections • {totalLessons} lessons •{" "}
              {totalLessonDurationHours} total hours
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={toggleExpandAll}>
            {expandedAll ? "Collapse All" : "Expand All"}
          </Button>
        </div>

        <Accordion
          type="multiple"
          {...(expandedAll
            ? { value: sectionIds }
            : { defaultValue: defaultOpenId ? [defaultOpenId] : [] })}
          className="w-full"
        >
          {course.sectionId?.map((section) => (
            <AccordionItem
              key={section?._id}
              value={section?._id ?? ""}
              className="mb-3 overflow-hidden rounded-md border"
            >
              <AccordionTrigger className="px-4 py-3">
                <div className="flex flex-col gap-1 text-left sm:flex-row sm:items-center sm:gap-4">
                  <span className="font-semibold">{section?.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up border-t pb-0">
                <ul className="divide-y">
                  {section?.lessonId?.map((lesson) => (
                    <li
                      key={lesson?._id}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 transition-all duration-200",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {getLessonTypeIcon(lesson?.type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{lesson?.title}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
