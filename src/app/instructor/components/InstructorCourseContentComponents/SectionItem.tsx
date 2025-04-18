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
import { Trash2 } from "lucide-react";
import { DeleteConfirmation } from "@/components/delete-confirmation";
import { Section } from "@/generated/graphql";

export interface SectionItemProps {
  section: Section;
  onDelete: (id: string, title: string) => void;
  deleting: boolean;
}

export const SectionItem: React.FC<SectionItemProps> = ({
  section,
  onDelete,
  deleting,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <AccordionItem
      value={section._id}
      className="mb-4 overflow-hidden rounded-lg border"
    >
      <AccordionTrigger className="group space-x-2 px-4 py-3">
        <div className="flex-1 text-left">
          <h3 className="font-medium">{section.title}</h3>
          <p className="text-xs text-gray-500">
            {section?.lessonId?.length}{" "}
            {section?.lessonId?.length === 1 ? "lesson" : "lessons"}
          </p>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-red-600"
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

      <AccordionContent>
        <div className="p-4">
          {section?.description && (
            <p className="text-sm text-gray-600">{section.description}</p>
          )}

          {section?.lessonId && section.lessonId.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1">
              {section.lessonId.map((lesson) => (
                <li key={lesson?._id}>{lesson?.title}</li>
              ))}
            </ul>
          ) : (
            <div className="rounded-md border border-dashed border-gray-200 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
              No lessons yet. Add your first lesson to this module.
            </div>
          )}
        </div>
      </AccordionContent>

      <DeleteConfirmation
        open={open}
        onOpenChange={(val) => setOpen(val)}
        loading={deleting}
        title="Delete Module"
        description={`Are you sure you want to delete “${section.title}”?`}
        onConfirm={() => {
          onDelete(section._id, section.title ?? "");
          setOpen(false);
        }}
        confirmName={section.title ?? ""}
      />
    </AccordionItem>
  );
};
