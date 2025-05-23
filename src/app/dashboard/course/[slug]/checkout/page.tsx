"use client";

import type React from "react";
import { useState } from "react";
import {
  BanknoteIcon,
  CheckCircle,
  CreditCard,
  Clock,
  Copy,
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
        <p>Курсын мэдээлэл ачааллаж байна...</p>
        <Loader className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (!response?.success || error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-6 text-sm">
        <p className="text-destructive flex items-center gap-2 font-semibold">
          <TriangleAlert className="h-4 w-4" />
          {response?.message || "Алдаа гарлаа."}
        </p>
        <Link href="/dashboard">
          <Button size={"sm"} variant={"outline"}>
            <ArrowLeft />
            Нүүр хуудас руу буцах
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
          Төлбөрийн хүсэлт хүлээн авсан
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Төлбөрийг шалгаж байна. Баталгаажсаны дараа танд имэйл очно.
        </p>
        <p className="text-muted-foreground mt-2 max-w-md text-sm">
          Баталгаажсаны дараа бүрэн хандалт идэвхжих болно.
        </p>

        <Link href={`/dashboard/course/${slug}`} className="mt-6">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Сургалтийн хуудас руу буцах
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
          Та энэ сургалтанд аль хэдийн бүртгүүлсэн байна.
        </p>
        <Link href={`/dashboard/course/${slug}/learn`}>
          <Button size={"sm"} variant={"outline"}>
            <ArrowLeft />
            Сургалт руу орох
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-4 max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href={`/dashboard/course/${slug}`}>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Сургалтын хуудас руу буцах
          </Button>
        </Link>
      </div>
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold md:text-3xl">Төлбөр төлөх заавар</h1>
        <p className="text-muted-foreground">
          Сургалтын төлбөрийг төлөхийн тулд та доорх мэдээллийг ашиглана уу.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          {/* Course Summary Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <CreditCard className="text-primary mr-2 h-5 w-5" />
                Сургалтын мэдээлэл
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
                      <span className="text-sm">1 сарын эрх</span>
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
            <CardHeader className="bg-primary/5 rounded-t-md border-b pb-3">
              <CardTitle className="flex items-center text-lg">
                <BanknoteIcon className="text-primary mr-2 h-5 w-5" />
                Дансаар шилжүүлэх
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-5">
                <div className="bg-muted/30 border-muted grid grid-cols-1 gap-4 rounded-lg border p-4">
                  {[
                    { label: "Банк", value: "ХААН БАНК" },
                    { label: "Дансны дугаар", value: "5000-XXXX-XXXX" },
                    { label: "Дансны нэр", value: "ABC" },
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
                      Хичээлийн үнэ:
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
                  <AlertTitle>Анхааруулга</AlertTitle>
                  <AlertDescription>
                    Та төлбөрөө шилжүүлсний дараа доорх "Төлбөр шалгах хүсэлт
                    илгээх" товчийг дарна уу. Таны төлбөрийг 24 цагийн дотор
                    шалгаж, баталгаажуулна. Баталгаажсаны дараа сургалтад
                    бүртгэгдэх боломжтой болно.
                  </AlertDescription>
                </Alert>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <Button
                    type="submit"
                    className="h-12 w-full border border-emerald-800 bg-emerald-100 py-6 text-base font-bold text-emerald-600 hover:bg-emerald-200 hover:text-emerald-700 active:bg-emerald-300 dark:border-emerald-700 dark:bg-emerald-900 dark:text-emerald-200 dark:hover:bg-emerald-800 dark:hover:text-white dark:active:bg-emerald-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Processing..."
                      : "Төлбөр шалгах хүсэлт илгээх"}
                    {isSubmitting ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <Send />
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-3 border-t pt-4 pb-5">
              <div className="text-muted-foreground flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4" />
                Таны төлбөрийг 24 цагийн дотор шалгаж баталгаажуулна
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Order Summary Card */}
          <Card>
            <CardHeader className="bg-muted/30 border-b pb-3">
              <CardTitle className="text-lg">Захиалгын хураангуй</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">Хичээлийн үнэ</span>
                <span className="text-primary text-lg font-bold">
                  ₮{course?.price?.amount?.toLocaleString("en-US")}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start pt-0">
              <Alert className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Буцаалтын нөхцөл:</AlertTitle>
                <AlertDescription className="text-xs">
                  Төлбөрийг 7 хоногийн дотор бүрэн буцаах боломжтой
                </AlertDescription>
              </Alert>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
