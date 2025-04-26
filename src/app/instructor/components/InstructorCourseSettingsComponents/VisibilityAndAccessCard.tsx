import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Course,
  CourseStatus,
  useUpdateCourseVisibilityAndAccessMutation,
} from "@/generated/graphql";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Loader } from "lucide-react";

const visibilitySchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

interface VisibilityAndAccessCardProps {
  initialValues: Course;
  refetch: () => void;
  mainRefetch: () => void;
}

export const VisibilityAndAccessCard = ({
  initialValues,
  refetch,
  mainRefetch,
}: VisibilityAndAccessCardProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      status: initialValues.status ?? "DRAFT",
    },
    resolver: zodResolver(visibilitySchema),
    mode: "onChange",
  });
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateVisibilityAndAccess] =
    useUpdateCourseVisibilityAndAccessMutation();

  const onSubmit = async (values: { status: string }) => {
    try {
      setIsUpdating(true);

      await updateVisibilityAndAccess({
        variables: {
          input: {
            courseId: initialValues._id,
            status: values.status as CourseStatus,
          },
        },
      });

      await refetch();
      await mainRefetch();
      reset(values);
      toast.success("Course visibility updated!");
    } catch (error) {
      toast.error("Failed to update visibility", {
        description: (error as Error).message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="border-blue-100 dark:border-blue-900">
        <CardHeader className="rounded-t-md border-b border-blue-100 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-900/30">
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Visibility & Access
          </CardTitle>
          <CardDescription className="dark:text-blue-300">
            Control who can see and access your course
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="visibility-status"
                className="text-base font-medium dark:text-blue-100"
              >
                Publication Status
              </Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    key={initialValues._id}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="visibility-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-xs text-gray-500">
                Draft courses are only visible to you
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t bg-gray-50/50 px-6 py-4 dark:border-blue-900 dark:bg-blue-900/30">
          <Button
            type="submit"
            disabled={isUpdating || !isDirty || isSubmitting}
          >
            {isUpdating ? (
              <>
                <Loader className="mr-1 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Save Visibility & Access Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
