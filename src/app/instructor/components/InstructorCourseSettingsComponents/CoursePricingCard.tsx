"use client";

import { Button } from "@/components/ui/button";
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
  Currency,
  Course,
  useUpdateCoursePricingMutation,
} from "@/generated/graphql";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CoursePricingCardProps {
  initialValues: Course;
  refetch: () => void;
}

export const CoursePricingCard = ({
  initialValues,
  refetch,
}: CoursePricingCardProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      planTitle: initialValues.price?.planTitle ?? "",
      description: initialValues.price?.description ?? "",
      amount: initialValues.price?.amount ?? 0,
      currency: initialValues.price?.currency ?? ("MNT" as Currency),
    },
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateCoursePricing] = useUpdateCoursePricingMutation();

  const onSubmit = async (values: typeof initialValues.price) => {
    setIsUpdating(true);
    try {
      await updateCoursePricing({
        variables: {
          courseId: initialValues._id,
          input: {
            planTitle: values?.planTitle,
            description: values?.description,
            amount: values?.amount,
            currency: values?.currency,
          },
        },
      });

      if (values) {
        reset({
          planTitle: values.planTitle ?? "",
          description: values.description ?? "",
          amount: values.amount ?? 0,
          currency: values.currency ?? ("MNT" as Currency),
        });
      }

      await refetch();
      toast.success("Course price updated successfully!");
    } catch (error) {
      toast.error("Failed to update course price", {
        description: (error as Error).message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="border-purple-100 dark:border-purple-900">
        <CardHeader className="rounded-t-md border-b border-purple-100 bg-purple-50/50 dark:border-purple-900 dark:bg-purple-900/30">
          <CardTitle className="text-purple-800 dark:text-purple-200">
            Pricing
          </CardTitle>
          <CardDescription className="dark:text-purple-300">
            Set your course pricing options
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Plan Title */}
          <div className="space-y-2">
            <Label
              htmlFor="plan-title"
              className="text-base font-medium dark:text-purple-100"
            >
              Plan Title
            </Label>
            <Input id="plan-title" {...register("planTitle")} />
          </div>

          {/* Description */}
          <div className="space-y-4">
            <Label
              htmlFor="plan-description"
              className="text-base font-medium dark:text-purple-100"
            >
              Plan Description
            </Label>
            <Textarea
              id="plan-description"
              className="min-h-[150px] resize-y"
              placeholder="Describe what students will learn..."
              {...register("description")}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Set a compelling pricing plan description. Mention what's
              included, who it's for, and any bonuses.
            </p>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label
              htmlFor="course-price"
              className="text-base font-medium dark:text-purple-100"
            >
              Plan Price
            </Label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                ₮
              </span>
              <Input
                id="course-price"
                type="number"
                className="pl-7"
                {...register("amount", { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-4 text-right">
            <Button
              type="submit"
              disabled={isUpdating || isSubmitting || !isDirty}
            >
              {isUpdating ? (
                <Loader className="animate-spin" />
              ) : (
                "Save Pricing Changes"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
