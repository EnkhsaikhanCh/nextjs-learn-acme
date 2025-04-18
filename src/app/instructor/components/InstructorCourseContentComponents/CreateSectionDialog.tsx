"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useCreateSectionMutation } from "@/generated/graphql";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { toast } from "sonner";

interface CreateSectionDialogProps {
  courseId: string;
  onCreated: () => void;
  trigger: React.ReactNode;
}

interface FormValues {
  title: string;
}

export const CreateSectionDialog: React.FC<CreateSectionDialogProps> = ({
  courseId,
  onCreated,
  trigger,
}) => {
  const [open, setOpen] = React.useState(false);
  const [createSection, { loading }] = useCreateSectionMutation();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const titleValue = watch("title", "");
  const isTitleEmpty = !titleValue.trim();

  /** wrap mutation + reset + callback */
  const onSubmit = async (data: FormValues) => {
    try {
      await createSection({
        variables: { input: { courseId, title: data.title } },
      });
      reset();
      setOpen(false);
      onCreated();
    } catch (err) {
      toast.error("Failed to create section", {
        description: (err as Error).message,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          reset();
        }
        setOpen(next);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Section</DialogTitle>
          <DialogDescription>
            Give your new section a clear, descriptive title.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Introduction to GraphQL"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || isTitleEmpty}>
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
