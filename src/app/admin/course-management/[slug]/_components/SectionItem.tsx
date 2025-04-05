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
import {
  CircleCheck,
  CircleDot,
  CirclePlus,
  CircleX,
  FilePenLine,
} from "lucide-react";
import {
  Section,
  useDeleteSectionMutation,
  useUpdateSectionMutation,
} from "@/generated/graphql";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/app/admin/_components/ConfirmDeleteDialog";

interface SectionItemProps {
  section: Section;
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const lessonCount = section?.lessonId?.length || 0;

  const [updateSection] = useUpdateSectionMutation();
  const [deleteSection] = useDeleteSectionMutation();

  const handleSaveTitle = async () => {
    if (!newTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    try {
      await updateSection({
        variables: {
          id: section?._id,
          input: { title: newTitle },
        },
      });
      await refetchCourse(); // Update the UI
      setIsEditing(false); // Exit editing mode
      toast.success("Section title updated");
    } catch {
      toast.error("Failed to update section title");
    }
  };

  const handleDeleteSection = async () => {
    try {
      await deleteSection({
        variables: {
          id: section?._id,
        },
      });
      await refetchCourse(); // Update the UI
      toast.success("Section deleted");
    } catch {
      toast.error("Failed to delete section");
    } finally {
      setIsDeleteDialogOpen(false);
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
                  className="text-lg font-semibold"
                  onClick={(e) => e.stopPropagation()} // Prevents accordion toggle
                >
                  {section?.title}
                </h2>
              )}
              <div className="flex h-7 w-7 items-center justify-center rounded-full border font-semibold">
                {lessonCount}
              </div>
            </div>
          </div>
        </AccordionTrigger>

        {/* Section Content */}
        <AccordionContent>
          <div>
            {section?.lessonId?.length ? (
              section.lessonId.map((lesson, index) => (
                <div key={lesson?._id || index} className="flex items-center">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full ${lesson?.isPublished ? "bg-green-200 text-green-500" : "bg-yellow-200 text-yellow-500"}`}
                  >
                    {lesson?.isPublished ? (
                      <CircleCheck className="h-3 w-3" />
                    ) : (
                      <CircleDot className="h-3 w-3" />
                    )}
                  </div>
                  <Link href="#" className="cursor-pointer">
                    <Button
                      variant="link"
                      className="cursor-pointer text-base"
                      onClick={() => lesson?._id && onLessonSelect(lesson._id)}
                    >
                      {lesson?.title}
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <p className="mb-2 italic">No lessons</p>
            )}

            {/* Add Lesson Form */}
            {showAddLesson && (
              <AddLessonForm
                sectionId={section?._id}
                refetchCourse={refetchCourse}
              />
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
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
                  className="border-green-500 bg-green-100 font-semibold text-green-500 hover:bg-green-200 hover:text-green-600"
                  onClick={handleSaveTitle}
                >
                  Save
                </Button>
              )}

              {/* Delete Section */}
              <ConfirmDeleteDialog
                buttonLabel="Delete Section"
                label="Section name"
                name={section.title}
                onConfirm={handleDeleteSection}
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
