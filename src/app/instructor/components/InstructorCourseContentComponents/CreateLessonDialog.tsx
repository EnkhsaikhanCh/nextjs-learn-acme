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
import { CreateLessonInput } from "@/generated/graphql";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface LessonForm {
  title: string;
}

interface CreateLessonDialogProps {
  lessonCreating: boolean;
  onLessonCreate: (input: CreateLessonInput) => void;
  sectionId: string;
}

export const CreateLessonDialog = ({
  lessonCreating,
  onLessonCreate,
  sectionId,
}: CreateLessonDialogProps) => {
  const [lessonOpen, setLessonOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<LessonForm>();

  const titleValue = watch("title");
  const isTitleEmpty = !titleValue?.trim().length;

  const onSubmitLesson = handleSubmit(async (data) => {
    await onLessonCreate({ sectionId: sectionId, title: data.title });
    reset();
    setLessonOpen(false);
  });

  return (
    <Dialog open={lessonOpen} onOpenChange={setLessonOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="inline-flex w-full max-w-md items-center justify-center"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Lesson
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Lesson</DialogTitle>
          <DialogDescription>
            Enter a title for your new lesson
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmitLesson} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="lesson-title">Title</Label>
            <Input
              id="lesson-title"
              placeholder="Lesson title"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={lessonCreating || isTitleEmpty}>
              {lessonCreating ? <Loader2 className="animate-spin" /> : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
