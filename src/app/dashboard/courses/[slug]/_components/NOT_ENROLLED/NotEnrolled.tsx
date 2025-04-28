import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Course,
  PaymentMethod,
  useCreatePaymentMutation,
  useGetPaymentByUserAndCourseQuery,
  useGetUserV2ByIdQuery,
} from "@/generated/graphql";
import {
  Banknote,
  CircleUserRound,
  ClipboardCheck,
  CreditCard,
  ListChecks,
  Loader2,
  MailCheck,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CopyableField } from "../CopyableField";
import { InfoRow } from "@/components/InfoRow";
import clsx from "clsx";
import { format } from "date-fns";
import { CourseHeroSection } from "./CourseHeroSection";
import { CourseOverviewSection } from "./CourseOverviewSection";
import { useUserStore } from "@/store/UserStoreState";

interface PaymentDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

const BANK_DETAILS: PaymentDetails = {
  bankName: "ХААН БАНК",
  accountNumber: "5000-XXXX-XXXX",
  accountName: "ABC",
};

export const NotEnrolled = ({ course }: { course: Course }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { user } = useUserStore();

  const { data: userData } = useGetUserV2ByIdQuery({
    variables: { id: user?._id as string },
    skip: !user?._id,
    fetchPolicy: "cache-first",
  });

  const [createPayment] = useCreatePaymentMutation();

  const { data: existingPaymentData, refetch: refetchExistingPayment } =
    useGetPaymentByUserAndCourseQuery({
      variables: { courseId: course._id, userId: user?._id as string },
      fetchPolicy: "network-only",
    });

  const payment = existingPaymentData?.getPaymentByUserAndCourse;
  const isPending = payment?.status === "PENDING";
  const validPayment = isPending ? payment : null;

  const transactionNote =
    userData?.getUserV2ById.__typename === "StudentUserV2"
      ? `${userData.getUserV2ById.studentId}-${course.courseCode}`
      : `${userData?.getUserV2ById.email}-${course.courseCode}`;

  const handleCreatePayment = async () => {
    if (validPayment) {
      toast.warning("Та аль хэдийн төлбөр төлсөн байна.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await createPayment({
        variables: {
          input: {
            userId: userData?.getUserV2ById._id as string,
            courseId: course._id,
            amount: course.price?.amount ?? 0,
            paymentMethod: PaymentMethod.BankTransfer,
            transactionNote,
          },
        },
      });

      if (data?.createPayment?._id) {
        await refetchExistingPayment();

        await fetch("/api/email/admin/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentId: data.createPayment._id,
            userEmail: user?._id,
            courseTitle: course.title,
            transactionNote,
          }),
        });

        toast.success("Төлбөрийн хүсэлт амжилттай үүслээ!");
      }
    } catch {
      toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleScrollToPayment = () => {
    const paymentSection = document.getElementById("payment");
    if (paymentSection) {
      window.scrollTo({
        top: paymentSection.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <main>
      <CourseHeroSection
        title={course.title}
        description={course.description as string}
        onEnrollClick={handleScrollToPayment}
      />

      <CourseOverviewSection course={course} />

      {/* Төлбөрийн мэдээлэл */}
      <section id="payment" className="pt-20 pb-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Та хичээлээ үзэхэд бэлэн үү?
          </h2>
          <div className="mx-auto max-w-md">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {course.price?.planTitle}
                </CardTitle>
                <CardDescription>{course?.price?.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">₮{course?.price?.amount}</p>
                <ul className="mt-4 space-y-2">
                  {/* {course?.pricingDetails?.details?.map((detail, index) => (
                    <li className="flex items-center" key={index}>
                      <CircleCheck className="mr-2 h-5 w-5 text-green-500" />
                      {detail}
                    </li>
                  ))} */}
                </ul>
              </CardContent>
              <CardFooter>
                {validPayment ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        Шалгах
                        <ListChecks />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="p-6 dark:bg-gray-800 dark:text-gray-200">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-full border border-blue-300 bg-blue-100 dark:border-blue-500 dark:bg-blue-900"
                          aria-hidden="true"
                        >
                          <MailCheck className="text-blue-600 dark:text-blue-400" />
                        </div>

                        <DialogHeader className="mt-3">
                          <DialogTitle className="font-semibold text-gray-900 dark:text-gray-100">
                            Таны төлбөрийг шалгаж байна...
                          </DialogTitle>
                        </DialogHeader>
                      </div>

                      <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-xs dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
                        <InfoRow
                          label="Төлбөрийн дүн"
                          value={`₮${course.price?.amount}`}
                        />
                        <InfoRow
                          label="Төлбөрийн төлөв"
                          value={
                            status === "PENDING"
                              ? "Шалгаж байна"
                              : status === "APPROVED"
                                ? "Зөвшөөрөгдсөн"
                                : "Амжилтгүй"
                          }
                          valueClassName={clsx({
                            "text-yellow-500 dark:text-yellow-400":
                              status === "PENDING",
                            "text-green-500 dark:text-green-400":
                              status === "APPROVED",
                            "text-red-500 dark:text-red-400":
                              status === "FAILED",
                          })}
                          isBadge={true}
                        />
                        <InfoRow
                          label="Гүйлгээний утга"
                          value={transactionNote}
                        />
                        <InfoRow
                          label="И-мэйл хаяг"
                          value={user?.email || "Мэдээлэл байхгүй"}
                        />
                        <InfoRow
                          label="Сургалтын нэр"
                          value={course.title || "Мэдээлэл байхгүй"}
                        />
                        <InfoRow
                          label="Төлбөрийн арга"
                          value={
                            validPayment?.paymentMethod ===
                            PaymentMethod.BankTransfer
                              ? "Банкны шилжүүлэг"
                              : validPayment?.paymentMethod ===
                                  PaymentMethod.Qpay
                                ? "QPay"
                                : validPayment?.paymentMethod ===
                                    PaymentMethod.CreditCard
                                  ? "Кредит карт"
                                  : "Бусад"
                          }
                        />
                        <InfoRow
                          label="Хүсэлт илгээсэн огноо"
                          value={
                            validPayment?.createdAt
                              ? format(
                                  new Date(validPayment.createdAt),
                                  "yyyy-MM-dd HH:mm:ss",
                                )
                              : ""
                          }
                        />
                      </div>

                      <DialogFooter className="grid rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-gray-700 shadow-xs dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        <div>Таны төлбөрийг баталгаажуулж байна...</div>
                        <span className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                          Дуусмагц таны бүртгэлтэй и-мэйл хаяг руу мэдэгдэл
                          илгээнэ. Түр хүлээнэ үү, баярлалаа!
                        </span>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        className="w-full rounded-full bg-yellow-400 font-bold text-black hover:bg-yellow-300"
                      >
                        Сургалтанд бүртгүүлэх
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="p-6">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                          Сургалтанд бүртгүүлэх
                        </DialogTitle>
                        <DialogDescription>
                          Дараах мэдээллийг ашиглан төлбөрөө шилжүүлнэ үү:
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 space-y-4">
                        {/* Non-copyable field */}
                        <CopyableField
                          label="Банк"
                          value={BANK_DETAILS.bankName}
                          fieldName="bank"
                          copiedField={copiedField}
                          icon={<Banknote className="h-[18px] w-[18px]" />}
                        />

                        <CopyableField
                          label="Дансны дугаар"
                          value={BANK_DETAILS.accountNumber}
                          fieldName="account"
                          copiedField={copiedField}
                          onClick={() =>
                            handleCopy(BANK_DETAILS.accountNumber, "account")
                          }
                          icon={<CreditCard className="h-[18px] w-[18px]" />}
                        />

                        <CopyableField
                          label="Дансны нэр"
                          value={BANK_DETAILS.accountName}
                          fieldName="name"
                          copiedField={copiedField}
                          icon={
                            <CircleUserRound className="h-[18px] w-[18px]" />
                          }
                        />

                        <CopyableField
                          label="Хичээлийн үнэ"
                          value={`₮${(course.price?.amount ?? 0).toLocaleString()}`}
                          fieldName="price"
                          copiedField={copiedField}
                          onClick={() =>
                            handleCopy(
                              (course.price?.amount ?? 0).toString(),
                              "price",
                            )
                          }
                          icon={<Tag className="h-[18px] w-[18px]" />}
                        />

                        <CopyableField
                          label="Гүйлгээний утга"
                          value={transactionNote}
                          fieldName="reference"
                          copiedField={copiedField}
                          onClick={() =>
                            handleCopy(transactionNote, "reference")
                          }
                          icon={
                            <ClipboardCheck className="h-[18px] w-[18px]" />
                          }
                        />
                      </div>

                      <DialogFooter className="mt-4">
                        <Button
                          size="lg"
                          onClick={handleCreatePayment}
                          disabled={isSubmitting}
                          className="w-full rounded-full bg-yellow-400 font-bold text-black hover:bg-yellow-300"
                        >
                          {isSubmitting ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            "Би төлбөрөө хийсэн"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
};
