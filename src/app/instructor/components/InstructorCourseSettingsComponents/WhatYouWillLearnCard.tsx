"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Trash2, Loader } from "lucide-react";
import { useState } from "react";
import { useUpdateCourseWhatYouWillLearnMutation } from "@/generated/graphql";
import { toast } from "sonner";

interface WhatYouWillLearnCardProps {
  initialValues: string[];
  courseId: string;
  refetch: () => void;
}

type WhatYouWillLearnForm = {
  whatYouWillLearn: { value: string }[];
};

export const WhatYouWillLearnCard = ({
  initialValues,
  courseId,
  refetch,
}: WhatYouWillLearnCardProps) => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<WhatYouWillLearnForm>({
    defaultValues: {
      whatYouWillLearn: initialValues.map((text) => ({ value: text || "" })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "whatYouWillLearn",
  });

  const [updateCourseWhatYouWillLearn] =
    useUpdateCourseWhatYouWillLearnMutation();
  const [isUpdating, setIsUpdating] = useState(false);

  const onSubmit = async (values: WhatYouWillLearnForm) => {
    setIsUpdating(true);
    try {
      await updateCourseWhatYouWillLearn({
        variables: {
          courseId,
          input: {
            points: values.whatYouWillLearn.map((item) => item.value),
          },
        },
      });

      await refetch();
      toast.success("Course info updated successfully!");
      reset(values);
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
      <Card className="border-lime-100 dark:border-lime-900">
        <CardHeader className="border-b bg-lime-50/50 dark:border-lime-900 dark:bg-lime-900/30">
          <CardTitle className="text-lime-800 dark:text-lime-200">
            What You Will Learn
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 pt-6">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input
                {...register(`whatYouWillLearn.${index}.value`)}
                placeholder={`Learning point #${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(index)}
              >
                <Trash2 className="text-destructive h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ value: "" })}
          >
            + Add Another Point
          </Button>
        </CardContent>

        <CardFooter className="flex justify-end border-t bg-gray-50/50 py-4 dark:border-lime-900 dark:bg-lime-900/30">
          <Button
            type="submit"
            disabled={!isDirty || isSubmitting || isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Learning Points"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
