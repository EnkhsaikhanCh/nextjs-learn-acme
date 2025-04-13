"use client";

import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Course, Difficulty } from "@/generated/graphql";

interface BasicInformationFormProps {
  initialValues: Course;
}

export const BasicInformationCard = ({
  initialValues,
}: BasicInformationFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: initialValues,
  });

  const onSubmit = async (values: typeof initialValues) => {
    toast.success("Submitted!", {
      description: JSON.stringify(values, null, 2),
    });
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
          <div className="space-y-4">
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
                        your course content
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
                        title
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

          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="course-description"
                className="text-base font-medium dark:text-emerald-100"
              >
                Description
              </Label>
              <Textarea
                id="course-description"
                className="min-h-[150px] resize-y"
                placeholder="Describe what students will learn..."
                {...register("description")}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Use clear, concise language. Include key topics, learning
                outcomes, and target audience.
              </p>
            </div>
          </div>

          <Separator className="my-6 dark:bg-emerald-900" />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="course-category"
                className="text-base font-medium dark:text-emerald-100"
              >
                Category
              </Label>
              <Select
                defaultValue={initialValues.category ?? ""}
                onValueChange={(value) => setValue("category", value)}
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
            <div className="space-y-2">
              <Label
                htmlFor="course-level"
                className="text-base font-medium dark:text-emerald-100"
              >
                Level
              </Label>
              <Select
                defaultValue={initialValues.difficulty ?? ""}
                onValueChange={(value) =>
                  setValue("difficulty", value as Difficulty)
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

          <div className="pt-6 text-right">
            <Button type="submit" disabled={isSubmitting}>
              Save Basic Information Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
