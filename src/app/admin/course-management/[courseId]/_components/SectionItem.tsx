import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AddLessonForm } from "./AddLessonForm";
import { Badge } from "@/components/ui/badge";

export function SectionItem({
  section,
  refetchCourse,
}: {
  section: any;
  refetchCourse: () => void;
}) {
  const [showAddLesson, setShowAddLesson] = useState(false);
  const lessonCount = section?.lessonId?.length || 0;

  return (
    <Accordion type="multiple" defaultValue={[section?._id]}>
      {/* Section Header */}
      <AccordionItem value={section?._id}>
        <AccordionTrigger>
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {section?.title}
              </h2>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border font-semibold text-gray-800">
                {lessonCount}
              </div>
            </div>
          </div>
        </AccordionTrigger>

        {/* Section Content */}
        <AccordionContent>
          <div className="">
            {section?.lessonId?.length ? (
              section.lessonId.map((lesson: any, index: number) => (
                <div key={lesson?._id || index}>
                  <Link
                    href="#"
                    className="flex cursor-pointer flex-row gap-2 py-1"
                  >
                    <Button
                      variant="link"
                      effect="hoverUnderline"
                      className="cursor-pointer text-base text-gray-700"
                    >
                      {lesson?.title}
                    </Button>
                    <Badge
                      className={`${
                        lesson?.isPublished
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      }`}
                    >
                      {lesson?.isPublished ? "Published" : "Not Published"}
                    </Badge>
                  </Link>
                </div>
              ))
            ) : (
              <p className="mb-2 italic text-gray-500">No lessons</p>
            )}

            {/* Add Lesson Form */}
            {showAddLesson && (
              <AddLessonForm
                sectionId={section?._id}
                refetchCourse={refetchCourse}
              />
            )}

            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setShowAddLesson(!showAddLesson)}
            >
              {showAddLesson ? "Cancel" : "Add Lesson"}
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
