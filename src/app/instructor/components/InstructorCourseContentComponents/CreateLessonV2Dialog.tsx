"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CreateLessonV2Input, LessonType } from "@/generated/graphql";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LessonTypeSelector } from "./LessonTypeSelector";

interface LessonFormValues {
  title: string;
  type: LessonType;
}

interface CreateLessonV2DialogProps {
  lessonV2Creating: boolean;
  onLessonV2Create: (input: CreateLessonV2Input) => void;
  sectionId: string;
}

export function CreateLessonV2Dialog({
  lessonV2Creating,
  onLessonV2Create,
  sectionId,
}: CreateLessonV2DialogProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LessonFormValues>({
    defaultValues: { title: "", type: LessonType.Video },
  });

  const selectedType = watch("type");

  const onSubmit = async (data: LessonFormValues) => {
    await onLessonV2Create({ ...data, sectionId });
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full max-w-md">
          <Plus className="mr-2 h-4 w-4" /> Add Lesson V2
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create a new lesson</DialogTitle>
          <DialogDescription>
            Enter a title and select the type of lesson you want to create.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register("title", { required: "Title is required" })}
              placeholder="Lesson title"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <LessonTypeSelector
            selected={selectedType}
            onSelect={(t) => setValue("type", t, { shouldValidate: true })}
            error={errors.type}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" disabled={lessonV2Creating}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={lessonV2Creating}>
              {lessonV2Creating ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Create Lesson"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
