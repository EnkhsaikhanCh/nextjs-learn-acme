"use client";

import React, { useState } from "react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Edit3, Trash2 } from "lucide-react";
import { DeleteConfirmation } from "@/components/delete-confirmation";
import {
  CreateLessonInput,
  CreateLessonV2Input,
  LessonV2,
  Section,
  UpdateSectionInput,
} from "@/generated/graphql";
import { UpdateSectionDialog } from "./UpdateSectionDialog";
import { CreateLessonV2Dialog } from "./CreateLessonV2Dialog";
import { LessonItem } from "./LessonItem";

export interface SectionItemProps {
  section: Section;
  onDelete: (id: string, title: string) => void;
  deleting: boolean;
  onUpdate: (id: string, input: UpdateSectionInput) => void;
  updating: boolean;
  onLessonCreate: (input: CreateLessonInput) => void;
  lessonCreating: boolean;
  onLessonV2Create: (input: CreateLessonV2Input) => void;
  lessonV2Creating: boolean;
  onDeleteLessonV2: (id: string) => void;
  lessonV2Deleting: boolean;
  deletingLessonId: string | null;
  mainRefetch: () => void;
}

export const SectionItem: React.FC<SectionItemProps> = ({
  section,
  onDelete,
  deleting,
  onUpdate,
  updating,
  // onLessonCreate,
  // lessonCreating,
  onLessonV2Create,
  lessonV2Creating,
  lessonV2Deleting,
  onDeleteLessonV2,
  deletingLessonId,
  mainRefetch,
}) => {
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  return (
    <AccordionItem
      value={section._id}
      className="bg-card mb-4 overflow-hidden rounded-sm border"
    >
      <AccordionTrigger className="group space-x-2 px-4 py-3">
        <div className="flex-1 text-left">
          <h3 className="font-bold">{section.title}</h3>
          <div className="text-xs font-semibold text-gray-500">
            {section?.lessonId?.length}{" "}
            {section?.lessonId?.length === 1 ? "lesson" : "lessons"}
          </div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setUpdateOpen(true);
                }}
              >
                <Edit3 className="h-4 w-4" />
                <span className="sr-only">Edit section</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit module</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete section</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete module</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </AccordionTrigger>

      <AccordionContent className="border-t">
        <div className="space-y-4 p-4">
          {section?.description && (
            <p className="text-muted-foreground text-sm">
              {section.description}
            </p>
          )}

          {section?.lessonId && section.lessonId.length > 0 ? (
            <div className="mt-2 list-inside list-disc space-y-1">
              {section.lessonId.map((lesson) => (
                <LessonItem
                  key={lesson?._id}
                  lesson={lesson as LessonV2}
                  deletingLessonId={deletingLessonId}
                  onDelete={onDeleteLessonV2}
                  deleting={lessonV2Deleting}
                  mainRefetch={mainRefetch}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-md border-2 border-dashed py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No lessons yet. Add your first lesson to this module.
            </div>
          )}

          <div className="flex justify-center">
            <CreateLessonV2Dialog
              lessonV2Creating={lessonV2Creating}
              onLessonV2Create={onLessonV2Create}
              sectionId={section._id}
              mainRefetch={mainRefetch}
            />
          </div>
        </div>
      </AccordionContent>

      <UpdateSectionDialog
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        section={section}
        onUpdated={(input) => onUpdate(section._id, input)}
        updating={updating}
      />

      <DeleteConfirmation
        open={open}
        onOpenChange={(val) => setOpen(val)}
        loading={deleting}
        title="Delete Module"
        description={`Are you sure you want to delete “${section.title}”?`}
        onConfirm={async () => {
          onDelete(section._id, section.title ?? "");
          await mainRefetch();
          setOpen(false);
        }}
        confirmName={section.title ?? ""}
      />
    </AccordionItem>
  );
};
