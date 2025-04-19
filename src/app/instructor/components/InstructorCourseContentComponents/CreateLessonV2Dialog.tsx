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
import { Label } from "@/components/ui/label";
import { CreateLessonV2Input, LessonType } from "@/generated/graphql";
import {
  File,
  FileQuestion,
  FileText,
  Loader2,
  Play,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
  const [lessonOpen, setLessonOpen] = useState<boolean>(false);

  const { register, handleSubmit, setValue, reset } =
    useForm<LessonFormValues>();

  const onSubmit = async (formValues: LessonFormValues) => {
    await onLessonV2Create({
      ...formValues,
      sectionId,
    });
    reset();
    setLessonOpen(false);
  };

  const setType = (type: LessonType) => setValue("type", type);

  return (
    <Dialog open={lessonOpen} onOpenChange={setLessonOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="w-full max-w-md">
          <Plus className="mr-2 h-4 w-4" />
          Add Lesson V2
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
          <div className="grid w-full items-center gap-1.5">
            <Input
              {...register("title", { required: "Title is required" })}
              placeholder="Lesson title"
            />

            <Label>Lesson Type</Label>
            <div className="grid gap-2 md:grid-cols-2">
              <Button
                type="button"
                // variant={selectedType === "VIDEO" ? "default" : "outline"}
                variant={"outline"}
                onClick={() => setType(LessonType.Video)}
                className="h-auto justify-start px-4 py-3"
              >
                <Play className="mr-2 h-5 w-5 text-blue-500" />
                <div className="text-left">
                  <div className="font-medium">Video</div>
                  <div className="text-muted-foreground text-xs">
                    Upload or embed a video
                  </div>
                </div>
              </Button>

              <Button
                type="button"
                // variant={selectedType === "VIDEO" ? "default" : "outline"}
                variant={"outline"}
                onClick={() => setType(LessonType.Text)}
                className="h-auto justify-start px-4 py-3"
              >
                <FileText className="mr-2 h-5 w-5 text-purple-500" />
                <div className="text-left">
                  <div className="font-medium">Text</div>
                  <div className="text-muted-foreground text-xs">
                    Write plain or rich text
                  </div>
                </div>
              </Button>

              <Button
                type="button"
                // variant={selectedType === "VIDEO" ? "default" : "outline"}
                variant={"outline"}
                onClick={() => setType(LessonType.File)}
                className="h-auto justify-start px-4 py-3"
              >
                <File className="mr-2 h-5 w-5 text-orange-500" />
                <div className="text-left">
                  <div className="font-medium">File</div>
                  <div className="text-muted-foreground text-xs">
                    Attach downloadable files
                  </div>
                </div>
              </Button>

              <Button
                type="button"
                // variant={selectedType === "VIDEO" ? "default" : "outline"}
                variant={"outline"}
                onClick={() => setType(LessonType.Quiz)}
                className="h-auto justify-start px-4 py-3"
              >
                <FileQuestion className="mr-2 h-5 w-5 text-emerald-500" />
                <div className="text-left">
                  <div className="font-medium">Quiz</div>
                  <div className="text-muted-foreground text-xs">
                    Add multiple choice questions
                  </div>
                </div>
              </Button>

              <Button
                type="button"
                // variant={selectedType === "VIDEO" ? "default" : "outline"}
                variant={"outline"}
                onClick={() => setType(LessonType.Assignment)}
                className="h-auto justify-start px-4 py-3"
              >
                <File className="mr-2 h-5 w-5 text-indigo-500" />
                <div className="text-left">
                  <div className="font-medium">Assignment</div>
                  <div className="text-muted-foreground text-xs">
                    Give long-form tasks or prompts
                  </div>
                </div>
              </Button>
            </div>

            {/* {selectedType === "VIDEO" && (
              <Input
                {...register("videoUrl", {
                  required: "Video URL is required",
                })}
                placeholder="Video URL"
              />
            )}

            {selectedType === "TEXT" && (
              <Textarea
                {...register("content", { required: "Content is required" })}
                placeholder="Write your content here..."
              />
            )}

            {selectedType === "FILE" && (
              <Input
                {...register("fileUrl", { required: "File URL is required" })}
                placeholder="https://yourdomain.com/yourfile.pdf"
              />
            )}

            {selectedType === "ASSIGNMENT" && (
              <Textarea
                {...register("assignmentDetails", {
                  required: "Assignment details are required",
                })}
                placeholder="Describe the assignment"
              />
            )} */}

            {/* You can extend here: selectedType === "QUIZ" → quiz builder UI */}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="secondary"
                type="button"
                disabled={lessonV2Creating}
              >
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
