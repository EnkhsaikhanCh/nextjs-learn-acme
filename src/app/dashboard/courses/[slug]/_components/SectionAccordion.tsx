"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Lesson, Section } from "@/generated/graphql";
import { CircleCheck, CircleDot } from "lucide-react";

interface SectionAccordionProps {
  sections: Section[];
  completedLessons: string[];
  selectedLessonId?: string;
  onSelectLesson: (lesson: Lesson) => void;
}

export function SectionAccordion({
  sections,
  completedLessons,
  selectedLessonId,
  onSelectLesson,
}: SectionAccordionProps) {
  return (
    <Accordion type="multiple" className="">
      <h2 className="mb-2 text-xl font-bold">Sections</h2>
      {sections && Array.isArray(sections) && sections.length > 0 ? (
        sections.map((section, index) => (
          <AccordionItem
            key={section._id || index}
            value={`section-${index}`}
            className="px-2"
          >
            <AccordionTrigger>
              <h2 className="text-sm font-semibold text-gray-800 lg:text-base">
                {section.title}
              </h2>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="mt-2 space-y-3">
                {section.lessonId?.map((lesson) => {
                  const isCompleted = completedLessons.includes(
                    lesson?._id || "",
                  );
                  const isSelected = selectedLessonId === lesson?._id;

                  return (
                    <div
                      key={lesson?._id}
                      className={`flex cursor-pointer items-center gap-3 rounded-md p-2 transition ${
                        isSelected ? "bg-gray-100" : "hover:bg-gray-100"
                      }`}
                      onClick={() => lesson && onSelectLesson(lesson)}
                    >
                      {/* Completed Status Icon */}
                      {isCompleted ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-200">
                          <CircleCheck className="h-4 w-4 text-green-600" />
                        </div>
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-200">
                          <CircleDot className="h-4 w-4 text-yellow-500" />
                        </div>
                      )}
                      {/* Lesson Title */}
                      <div
                        className={`flex h-10 flex-1 items-center text-sm font-medium ${
                          isCompleted
                            ? "text-gray-600 line-through"
                            : "text-gray-800"
                        }`}
                      >
                        {lesson?.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))
      ) : (
        <p className="text-gray-500">No sections available.</p> // ✅ Handle empty sections
      )}
    </Accordion>
  );
}
