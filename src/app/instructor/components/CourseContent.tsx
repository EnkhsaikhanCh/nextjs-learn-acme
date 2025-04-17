"use client";

import React from "react";
import {
  useCreateSectionMutation,
  useGetInstructorCourseContentQuery,
} from "@/generated/graphql";
import { useParams } from "next/navigation";
import { Loader } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface SectionForm {
  title: string;
}

export const CourseContent: React.FC = () => {
  const { slug } = useParams();
  const { data, loading, error, refetch } = useGetInstructorCourseContentQuery({
    variables: { slug: slug as string },
    skip: !slug,
  });

  const [createSection, { loading: creating }] = useCreateSectionMutation();

  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SectionForm>();

  if (loading) {
    return (
      <p className="text-muted-foreground flex items-center text-sm">
        Loading course content...
        <Loader className="ml-2 h-4 w-4 animate-spin" />
      </p>
    );
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const sections = data?.getInstructorCourseContent?.sectionId ?? [];
  const courseId = data?.getInstructorCourseContent?._id;

  const onSubmit = async (values: SectionForm) => {
    if (!courseId) {
      return;
    }
    try {
      await createSection({
        variables: { input: { courseId, title: values.title } },
      });
      await refetch();
      reset();
      setOpen(false);
      toast.success("Section successfully created");
    } catch {
      toast.error("Failed");
    }
  };

  const titleValue = watch("title");
  const isTitleEmpty = !titleValue?.trim().length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Course Content</h1>
          <p className="mt-1 text-sm text-gray-500">
            Organize your course structure and materials
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="px-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Course Structure</CardTitle>
              <CardDescription>
                Organize your course content by modules and lessons
              </CardDescription>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="default">New Section</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Section</DialogTitle>
                  <DialogDescription>
                    Enter a title for your new section
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Section title"
                      {...register("title", { required: "Title is required" })}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="secondary" type="button">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={creating || isTitleEmpty}>
                      {creating ? (
                        <Loader className="animate-spin" />
                      ) : (
                        "Create"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <Accordion type="multiple" className="space-y-2">
            {sections.map((section) => (
              <AccordionItem
                key={section?._id}
                value={section?._id as string}
                className={cn("mb-4 overflow-hidden rounded-lg border")}
              >
                <AccordionTrigger className="group px-4 py-3">
                  <div className="flex-1 text-left">
                    <h3 className="font-medium">{section?.title}</h3>
                    <p className="text-xs text-gray-500">
                      {section?.lessonId?.length}{" "}
                      {section?.lessonId?.length === 1 ? "lesson" : "lessons"}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4">
                    {section?.description && (
                      <p className="text-sm text-gray-600">
                        {section.description}
                      </p>
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
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};
