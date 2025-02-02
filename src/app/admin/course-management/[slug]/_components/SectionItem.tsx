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
  AlertTriangle,
  CircleCheck,
  CircleDot,
  CirclePlus,
  CircleX,
  FilePenLine,
  Trash2,
} from "lucide-react";
import {
  Section,
  useDeleteSectionMutation,
  useUpdateSectionMutation,
} from "@/generated/graphql";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

// Lesson төрлийн тодорхойлолт
interface Lesson {
  _id: string;
  title: string;
  isPublished: boolean; // Add the isPublished property
}

// SectionItemProps-ийн тодорхойлолт
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
    } catch (error) {
      toast.error("Failed to update section title");
      console.error("Failed to update section title:", error);
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
    } catch (error) {
      toast.error("Failed to delete section");
      console.error("Failed to delete section:", error);
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
                  className="text-lg font-semibold text-gray-800"
                  onClick={(e) => e.stopPropagation()} // Prevents accordion toggle
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
                      effect="hoverUnderline"
                      className="cursor-pointer text-base text-gray-700"
                      onClick={() => lesson?._id && onLessonSelect(lesson._id)}
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
            {/* Delete Section */}
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={(isOpen) => setIsDeleteDialogOpen(isOpen)}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-1 mt-2 font-semibold"
                >
                  Delete Section
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0">
                <DialogHeader className="rounded-t-md border-b border-gray-200 bg-[#FAFAFA] p-4">
                  <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-destructive">
                    <AlertTriangle />
                    Confirm Deletion
                  </DialogTitle>
                </DialogHeader>
                <div className="p-4">
                  <div className="flex gap-1">
                    <div>Title:</div>
                    <div>{section?.title}</div>
                  </div>
                  <div className="flex gap-1">
                    <div>ID:</div>
                    <div>{section?._id}</div>
                  </div>
                </div>
                {/*  */}
                <div className="px-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive"
                  >
                    <p className="text-sm font-semibold">
                      This action cannot be undone.
                    </p>
                    <p className="mt-1 text-sm">
                      All associated data will be permanently removed from our
                      servers.
                    </p>
                  </motion.div>
                </div>
                <DialogFooter className="border-t border-gray-200 bg-[#FAFAFA] p-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                    className="font-semibold"
                    size={"sm"}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteSection}
                    className="font-semibold"
                    size={"sm"}
                  >
                    Delete Section
                    <Trash2 />
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
