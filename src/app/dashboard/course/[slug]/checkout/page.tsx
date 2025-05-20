"use client";

import type React from "react";

import { useState } from "react";
import {
  BanknoteIcon,
  CheckCircle,
  CreditCard,
  Info,
  Clock,
  Copy,
  HelpCircle,
  AlertCircle,
  Loader,
  TriangleAlert,
  ArrowLeft,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  useCreatePaymentCheckRequestMutation,
  useGetCourseCheckoutDataQuery,
} from "@/generated/graphql";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const { slug } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, loading, error, refetch } = useGetCourseCheckoutDataQuery({
    variables: { slug: slug as string },
    fetchPolicy: "cache-first",
  });

  const response = data?.getCourseCheckoutData;
  const course = response?.course;
  const user = response?.user;
  const isPaid = response?.isPaid;
  const isEnrolled = response?.isEnrolled;

  const [createPaymentCheckRequest] = useCreatePaymentCheckRequestMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const result = await createPaymentCheckRequest({
        variables: {
          input: {
            courseId: course?._id as string,
            amount: course?.price?.amount as number,
            transactionNote: `${user?.studentId}-${course?.courseCode}`,
          },
        },
      });

      const response = result.data?.createPaymentCheckRequest;

      if (response?.success) {
        await refetch();
        toast.success("Payment proof submitted successfully", {
          description: "Your payment proof has been submitted for review.",
        });
      } else {
        toast.error("Submission failed", {
          description: response?.message ?? "Unknown error",
        });
      }
    } catch {
      toast.error("Failed to submit payment proof", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`, {
      description: "You can paste it in the transaction reference field.",
    });
  };

  if (loading) {
    return (
      <div className="text-muted-foreground flex items-center justify-center gap-2 p-6 text-sm">
        <p>Loading course data</p>
        <Loader className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (!response?.success || error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-6 text-sm">
        <p className="text-destructive flex items-center gap-2 font-semibold">
          <TriangleAlert className="h-4 w-4" />
          {response?.message || "Something went wrong."}
        </p>
        <Link href="/dashboard">
          <Button size={"sm"} variant={"outline"}>
            <ArrowLeft />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  if (isPaid) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-4 flex items-center justify-center rounded-full border-2 border-green-600 bg-green-100 p-4 dark:border-green-300 dark:bg-green-950">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-300" />
        </div>
        <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300">
          Payment Request Received
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          We're reviewing your payment. You'll receive an email once it's been
          confirmed.
        </p>
        <p className="text-muted-foreground mt-2 max-w-md text-sm">
          After approval, full course access will be unlocked for your account.
        </p>

        <Link href={`/dashboard/course/${slug}`} className="mt-6">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Course Preview
          </Button>
        </Link>
      </div>
    );
  }

  if (isEnrolled) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-6 text-sm">
        <p className="text-muted-foreground flex items-center gap-2 font-semibold">
          <CheckCircle className="h-4 w-4 text-green-500" />
          You are already enrolled in this course.
        </p>
        <Link href={`/dashboard/course/${slug}/learn`}>
          <Button size={"sm"} variant={"outline"}>
            <ArrowLeft />
            Go to Course
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-4 max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="text-2xl font-bold md:text-3xl">
          Complete Your Purchase
        </h1>
        <p className="text-muted-foreground mx-auto max-w-md">
          You're just one step away from accessing your course
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          {/* Course Summary Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <CreditCard className="text-primary mr-2 h-5 w-5" />
                Course Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="mb-1 text-xl font-bold">{course?.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {course?.subtitle}
                  </p>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center">
                      <Clock className="text-muted-foreground mr-2 h-4 w-4" />
                      <span className="text-sm">1-month access</span>
                    </div>
                    <Badge variant="secondary" className="w-fit">
                      {course?.price?.planTitle}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bank Transfer Instructions Card */}
          <Card>
            <CardHeader className="bg-primary/5 border-b pb-3">
              <CardTitle className="flex items-center text-lg">
                <BanknoteIcon className="text-primary mr-2 h-5 w-5" />
                Bank Transfer Instructions
              </CardTitle>
              <CardDescription>
                Please transfer the exact amount to complete your purchase
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-5">
                <div className="bg-muted/30 border-muted grid grid-cols-1 gap-4 rounded-lg border p-4">
                  {[
                    { label: "Bank Name", value: "ХААН БАНК" },
                    { label: "Account Number", value: "5000-XXXX-XXXX" },
                    { label: "Account Name", value: "ABC" },
                    {
                      label: "Гүйлгээний утга",
                      value: `${user?.studentId}-${course?.courseCode}`,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between"
                    >
                      <div className="text-muted-foreground text-sm font-medium">
                        {item.label}:
                      </div>
                      <div className="flex items-center font-medium">
                        {item.value}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ml-1 h-8 w-8"
                                onClick={() =>
                                  copyToClipboard(item.value ?? "", item.label)
                                }
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy to clipboard</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  ))}

                  {/* Course price */}
                  <div
                    key={"Amount"}
                    className="flex items-center justify-between"
                  >
                    <div className="text-muted-foreground text-sm font-medium">
                      Amount:
                    </div>
                    <div className="flex items-center font-medium">
                      ₮{course?.price?.amount?.toLocaleString("en-US")}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-1 h-8 w-8"
                              onClick={() =>
                                copyToClipboard(
                                  (course?.price?.amount ?? 0).toString(),
                                  "Amount",
                                )
                              }
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy to clipboard</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Please use your email or name as the transaction reference
                    so we can identify your payment.
                  </AlertDescription>
                </Alert>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Button
                    type="submit"
                    className="h-12 w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Submit Payment Proof"}
                    {!isSubmitting && <Send />}
                  </Button>
                </form>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-3 border-t pt-4 pb-5">
              <div className="text-muted-foreground flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-green-500" />
                Your payment will be reviewed within 24 hours
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Order Summary Card */}
          <Card>
            <CardHeader className="bg-muted/30 border-b pb-3">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">Course Price</span>
                <span className="text-primary text-lg font-bold">
                  ₮{course?.price?.amount?.toLocaleString("en-US")}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start pt-0">
              <Alert className="mt-2">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <span className="font-medium">Refund Policy:</span> Full
                  refund available within 7 days
                </AlertDescription>
              </Alert>
            </CardFooter>
          </Card>

          {/* Help/Contact Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base">
                <HelpCircle className="mr-2 h-4 w-4" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                If you have any questions or issues with your payment, our
                support team is here to help.
              </p>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full justify-start">
                  <Info className="mr-2 h-4 w-4" />
                  Payment FAQ
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
