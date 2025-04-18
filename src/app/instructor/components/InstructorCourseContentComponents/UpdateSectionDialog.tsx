import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Section } from "@/generated/graphql";
import { Textarea } from "@/components/ui/textarea";

export interface UpdateSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: Pick<Section, "_id" | "title" | "description">;
  onUpdated: (input: { title: string; description?: string }) => void;
  updating?: boolean;
}

export const UpdateSectionDialog: React.FC<UpdateSectionDialogProps> = ({
  open,
  onOpenChange,
  section,
  onUpdated,
  updating = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ title: string; description?: string }>({
    defaultValues: {
      title: section.title ?? "",
      description: section.description ?? "",
    },
  });

  const onSubmit = (values: { title: string; description?: string }) => {
    onUpdated(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Section</DialogTitle>
          <DialogDescription>
            Update the title and description for this section.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={updating}>
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
