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
import { CirclePlus, CircleX } from "lucide-react";

// Lesson төрлийн тодорхойлолт
interface Lesson {
  _id: string;
  title: string;
}

// SectionItemProps-ийн тодорхойлолт
interface SectionItemProps {
  section: {
    _id: string;
    title: string;
    lessonId: Lesson[];
  };
  refetchCourse: () => void;
  onLessonSelect: (lessonId: string) => void;
}

export function SectionItem({
  section,
  refetchCourse,
  onLessonSelect,
}: SectionItemProps) {
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
              section.lessonId.map((lesson, index) => (
                <div key={lesson?._id || index}>
                  <Link href="#" className="cursor-pointer gap-2 py-1">
                    <Button
                      variant="link"
                      effect="hoverUnderline"
                      className="cursor-pointer text-base text-gray-700"
                      onClick={() => onLessonSelect(lesson?._id)}
                    >
                      {lesson?.title}
                    </Button>
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
              className="mt-2 font-semibold"
              onClick={() => setShowAddLesson(!showAddLesson)}
            >
              {showAddLesson ? (
                <>
                  Cancel
                  <CircleX />
                </>
              ) : (
                <>
                  Add Lesson
                  <CirclePlus />
                </>
              )}
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
