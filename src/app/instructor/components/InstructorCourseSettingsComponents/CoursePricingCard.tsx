"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Currency,
  Course,
  useUpdateCoursePricingV2Mutation,
} from "@/generated/graphql";
import { Trash2, Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CoursePricingCardProps {
  initialValues: Course;
  refetch: () => void;
  mainRefetch: () => void;
}

type CoursePricingFormData = {
  planTitle: string;
  description: { value: string }[];
  amount: number;
  currency: Currency;
};

export const CoursePricingCard = ({
  initialValues,
  refetch,
  mainRefetch,
}: CoursePricingCardProps) => {
  const cleanedDescription =
    initialValues.price?.description?.filter(
      (d): d is string => typeof d === "string" && d.trim() !== "",
    ) ?? [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<CoursePricingFormData>({
    defaultValues: {
      planTitle: initialValues.price?.planTitle ?? "",
      description: cleanedDescription.map((d) => ({ value: d })) ?? [
        { value: "" },
      ],
      amount: initialValues.price?.amount ?? 0,
      currency: initialValues.price?.currency ?? Currency.Mnt,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "description",
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateCoursePricingV2] = useUpdateCoursePricingV2Mutation();

  const onSubmit = async (values: CoursePricingFormData) => {
    const filtered = values.description
      .map((item) => item.value.trim())
      .filter((v) => v !== "");

    if (filtered.length === 0) {
      toast.error("Please add at least one description item.");
      return;
    }

    setIsUpdating(true);
    try {
      await updateCoursePricingV2({
        variables: {
          courseId: initialValues._id,
          input: {
            planTitle: values.planTitle,
            description: filtered,
            amount: values.amount,
            currency: values.currency,
          },
        },
      });

      reset(values);
      await refetch();
      await mainRefetch();
      toast.success("Course pricing updated!");
    } catch (err) {
      toast.error("Update failed", { description: (err as Error).message });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="border-purple-200 dark:border-purple-900">
        <CardHeader className="bg-purple-50/50 dark:bg-purple-900/30">
          <CardTitle className="text-purple-800 dark:text-purple-200">
            Pricing
          </CardTitle>
          <CardDescription className="dark:text-purple-300">
            Add your plan’s title, features, and price.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="planTitle">Plan Title</Label>
            <Input
              id="planTitle"
              {...register("planTitle", { required: true })}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>This course includes:</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  placeholder={`Item ${index + 1}`}
                  {...register(`description.${index}.value`, {
                    required: true,
                  })}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (fields.length >= 10) {
                  toast.error("You can only add up to 10 items.");
                  return;
                }
                append({ value: "" });
              }}
            >
              + Add Description
            </Button>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Plan Price (₮)</Label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                ₮
              </span>
              <Input
                id="price"
                type="number"
                className="pl-7"
                {...register("amount", { valueAsNumber: true, min: 0 })}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t bg-gray-50 px-6 py-4 dark:bg-purple-900/30">
          <Button
            type="submit"
            disabled={isUpdating || isSubmitting || !isDirty}
          >
            {isUpdating ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              "Save Pricing Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
