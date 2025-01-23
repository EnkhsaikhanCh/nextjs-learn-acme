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
import { CirclePlus, CircleX, FilePenLine } from "lucide-react";
import { useUpdateSectionMutation } from "@/generated/graphql";
import { Input } from "@/components/ui/input";
import { toast, Toaster } from "sonner";

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
  const [isEditing, setIsEditing] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newTitle, setNewTitle] = useState(section?.title || "");

  const lessonCount = section?.lessonId?.length || 0;

  const [updateSection] = useUpdateSectionMutation();

  const handleSaveTitle = async () => {
    try {
      await updateSection({
        variables: {
          id: section?._id,
          input: { title: newTitle },
        },
      });
      refetchCourse(); // Update the UI
      setIsEditing(false); // Exit editing mode
      toast.success("Section title updated");
    } catch (error) {
      toast.error("Failed to update section title");
      console.error("Failed to update section title:", error);
    }
  };

  return (
    <Accordion type="multiple" defaultValue={[section?._id]}>
      {/* Section Header */}
      <AccordionItem value={section?._id}>
        <AccordionTrigger>
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              {isEditing ? (
                <Input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onClick={(e) => e.stopPropagation()} // Prevents accordion toggle
                />
              ) : (
                <h2
                  className="text-lg font-semibold text-gray-800"
                  onClick={(e) => e.stopPropagation()} // Optional, in case title click should not toggle
                >
                  {section?.title}
                </h2>
              )}
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
            <Button
              size={"sm"}
              variant={isEditing ? "destructive" : "outline"}
              className="ml-1 mt-2 font-semibold"
              onClick={(e) => {
                e.stopPropagation(); // Prevents accordion toggle
                setIsEditing(!isEditing);
              }}
            >
              {isEditing ? (
                <>
                  Cancel
                  <CircleX />
                </>
              ) : (
                <>
                  Edit Section
                  <FilePenLine />
                </>
              )}
            </Button>
            {isEditing && (
              <Button
                size={"sm"}
                variant={"outline"}
                className="ml-1 mt-2 border-green-500 bg-green-100 font-semibold text-green-500 hover:bg-green-200 hover:text-green-600"
                onClick={handleSaveTitle}
              >
                Save
              </Button>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
