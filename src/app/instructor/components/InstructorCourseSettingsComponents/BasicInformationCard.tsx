"use client";

import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Loader } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Course,
  Difficulty,
  useUpdateCourseBasicInfoMutation,
} from "@/generated/graphql";
import { useEffect, useState } from "react";
import { RichTextEditor } from "../RichTextEditor";

interface BasicInformationFormProps {
  initialValues: Course;
  refetch: () => void;
}

export const BasicInformationCard = ({
  initialValues,
  refetch,
}: BasicInformationFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isSubmitting, isDirty },
  } = useForm({
    defaultValues: initialValues,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateCourseBasicInfo] = useUpdateCourseBasicInfoMutation();

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const onSubmit = async (values: typeof initialValues) => {
    setIsUpdating(true);
    try {
      await updateCourseBasicInfo({
        variables: {
          courseId: initialValues._id,
          input: {
            title: values.title,
            subtitle: values.subtitle,
            description: values.description,
            requirements: values.requirements,
            category: values.category,
            difficulty: values.difficulty,
            whoIsThisFor: values.whoIsThisFor,
          },
        },
      });

      await refetch();

      toast.success("Course info updated successfully!");
    } catch (error) {
      toast.error("Failed to update course", {
        description: (error as Error).message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="border-emerald-100 dark:border-emerald-900">
        <CardHeader className="rounded-t-md border-b border-emerald-100 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-900/30">
          <CardTitle className="text-emerald-800 dark:text-emerald-200">
            Basic Information
          </CardTitle>
          <CardDescription className="dark:text-emerald-300">
            Essential details about your course
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Title & Subtitle */}
          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="course-title"
                  className="text-base font-medium dark:text-emerald-100"
                >
                  Course Title
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 dark:text-gray-300" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-muted-foreground max-w-xs">
                        Choose a clear, specific title that accurately reflects
                        your course content.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="course-title"
                placeholder="e.g., Complete JavaScript Developer Course"
                {...register("title")}
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="course-subtitle"
                  className="text-base font-medium dark:text-emerald-100"
                >
                  Subtitle
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 dark:text-gray-300" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-muted-foreground max-w-xs">
                        A brief, compelling description that appears below your
                        title.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="course-subtitle"
                placeholder="e.g., Master modern web technologies from beginner to expert"
                {...register("subtitle")}
              />
            </div>
          </div>

          <Separator className="my-6 dark:bg-emerald-900" />

          {/* Description */}
          <div className="space-y-4">
            <Label
              htmlFor="course-description"
              className="text-base font-medium dark:text-emerald-100"
            >
              Description
            </Label>
            <RichTextEditor
              value={watch("description") ?? ""}
              onChange={(value) =>
                setValue("description", value, { shouldDirty: true })
              }
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Use clear, concise language. Include key topics, learning
              outcomes, and target audience.
            </p>
          </div>

          <Separator className="my-6 dark:bg-emerald-900" />

          {/* Requirements */}
          <div className="space-y-4">
            <Label
              htmlFor="course-requirements"
              className="text-base font-medium dark:text-emerald-100"
            >
              Requirements
            </Label>
            <RichTextEditor
              value={watch("requirements") ?? ""}
              onChange={(value) =>
                setValue("requirements", value, { shouldDirty: true })
              }
            />
          </div>

          <Separator className="my-6 dark:bg-emerald-900" />

          {/* Who Is This For */}
          <div className="space-y-4">
            <Label
              htmlFor="course-whoIsThisFor"
              className="text-base font-medium dark:text-emerald-100"
            >
              Who Is This For
            </Label>
            <RichTextEditor
              value={watch("whoIsThisFor") ?? ""}
              onChange={(value) =>
                setValue("whoIsThisFor", value, { shouldDirty: true })
              }
            />
          </div>

          <Separator className="my-6 dark:bg-emerald-900" />

          {/* Category & Difficulty */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Category */}
            <div className="space-y-2">
              <Label
                htmlFor="course-category"
                className="text-base font-medium dark:text-emerald-100"
              >
                Category
              </Label>
              <Select
                value={watch("category") ?? ""}
                onValueChange={(value) =>
                  setValue("category", value, { shouldDirty: true })
                }
              >
                <SelectTrigger id="course-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="college-prep">College Prep</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="content">Content Creation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <Label
                htmlFor="course-level"
                className="text-base font-medium dark:text-emerald-100"
              >
                Level
              </Label>
              <Select
                value={watch("difficulty") ?? ""}
                onValueChange={(value) =>
                  setValue("difficulty", value as Difficulty, {
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger id="course-level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t bg-gray-50/50 px-6 py-4 dark:border-emerald-900 dark:bg-emerald-900/30">
          <Button
            type="submit"
            disabled={isUpdating || isSubmitting || !isDirty}
          >
            {isUpdating ? (
              <Loader className="animate-spin" />
            ) : (
              "Save Basic Information Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
