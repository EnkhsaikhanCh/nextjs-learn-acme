"use client";

import * as React from "react";
import {
  Payment,
  PaymentStatus,
  useGetAllPaymentsQuery,
} from "@/generated/graphql";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { Badge } from "@/components/ui/badge";
import { UpdatePaymentStatus } from "./_components/UpdatePaymentStatus";

// 1. Статусын жагсаалтыг централизовсон байдлаар зарлая.
// (Хэрэв олон газар давтаж бичих шаардлагатай бол ийм байдлаар тодорхойлвол тохиромжтой.)
const PAYMENT_STATUS_OPTIONS: { label: string; value: PaymentStatus }[] = [
  { label: "Хүлээгдэж байна", value: PaymentStatus.Pending },
  { label: "Амжилттай", value: PaymentStatus.Approved },
  { label: "Амжилтгүй", value: PaymentStatus.Failed },
  { label: "Буцаалт хийгдсэн", value: PaymentStatus.Refunded },
];

// 2. Огнооны зөрүүг тооцох тусдаа функц
function getTimeDiffDescription(createdAt?: string | number | null) {
  if (!createdAt) return "Мэдээлэл байхгүй";

  const ts = Number(createdAt);
  if (isNaN(ts)) return "Мэдээлэл байхгүй";

  const createdTime = new Date(ts);
  const now = new Date();
  const diffInMs = now.getTime() - createdTime.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);

  if (diffInMinutes < 1) return "Дөнгөж сая";
  if (diffInMinutes < 60) return `${diffInMinutes} минутын өмнө`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} цагийн өмнө`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} өдрийн өмнө`;
}

// 3. Огноог "mn-MN" хэлбэрээр форматлах функц
function formatMongolianDateString(dateValue?: string | number | null) {
  if (!dateValue) return "Мэдээлэл байхгүй";

  const ts = Number(dateValue);
  if (isNaN(ts)) return "Мэдээлэл байхгүй";

  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Ulaanbaatar",
    timeZoneName: "short",
  }).format(new Date(ts));
}

export default function PaymentManagement() {
  const { data, loading, error, refetch } = useGetAllPaymentsQuery();
  const [selectedStatus, setSelectedStatus] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedStatus") || "ALL"; // Persist state across refresh
    }
    return "ALL";
  });

  const payments = useMemo(
    () => data?.getAllPayments || [],
    [data?.getAllPayments],
  );

  // useMemo ашиглаж, status-ээр шүүх хэсгээс илүү ашигтай болгож болно.
  const filteredPayments = useMemo(() => {
    if (selectedStatus === "ALL") {
      return payments;
    }
    return payments.filter(
      (payment) => payment && payment.status === selectedStatus,
    );
  }, [payments, selectedStatus]);

  // Update localStorage whenever status changes
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    localStorage.setItem("selectedStatus", value);
  };

  if (loading) return <LoadingOverlay />;

  if (error) return <p>Мэдээлэл татахад алдаа гарлаа.</p>;

  return (
    <main className="p-4">
      <h2 className="mb-4 text-xl font-semibold">Төлбөрийн удирдлага</h2>

      {/* Статус шүүлтүүр */}
      <div className="mb-4">
        <Select value={selectedStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="flex w-[200px] items-center gap-2">
            <SelectValue>
              {PAYMENT_STATUS_OPTIONS.find(
                (opt) => opt.value === selectedStatus,
              )?.label || "Бүгд"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ALL">Бүгд</SelectItem>
              {PAYMENT_STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Төлбөрийн хүснэгт */}
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Төлбөрийн гүйлгээний мэдээлэл</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Хэрэглэгчийн имэйл</TableHead>
              <TableHead>Сургалт</TableHead>
              <TableHead>Төлбөр</TableHead>
              <TableHead>Гүйлгээний утга</TableHead>
              <TableHead>Төлөв</TableHead>
              <TableHead>Огноо</TableHead>
              <TableHead>Цаг</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => {
              if (!payment) return null; // safety check
              const {
                _id,
                userId,
                courseId,
                amount,
                transactionNote,
                status,
                refundReason,
                createdAt,
              } = payment;

              return (
                <TableRow key={_id}>
                  <TableCell>{userId?.email || "Мэдээлэл байхгүй"}</TableCell>
                  <TableCell>{courseId?.title || "Мэдээлэл байхгүй"}</TableCell>
                  <TableCell>₮ {amount}</TableCell>
                  <TableCell>{transactionNote || "Мэдээлэл байхгүй"}</TableCell>

                  {/* Төлөв, буцаалтын шалтгаан */}
                  <TableCell className="flex items-center gap-2">
                    <Badge
                      className={`border font-semibold ${
                        status === "PENDING"
                          ? "border-yellow-600 bg-yellow-200 text-yellow-800 hover:bg-yellow-200"
                          : status === "APPROVED"
                            ? "border-green-600 bg-green-200 text-green-800 hover:bg-green-200"
                            : status === "FAILED"
                              ? "border-red-600 bg-red-200 text-red-800 hover:bg-red-200"
                              : status === "REFUNDED"
                                ? "border-blue-600 bg-blue-200 text-blue-800 hover:bg-blue-200"
                                : "bg-gray-100 text-gray-800"
                      } `}
                    >
                      {status}
                    </Badge>

                    {/* Төлөв шинэчлэх button & dialog */}
                    <UpdatePaymentStatus
                      payment={payment as Payment}
                      paymentId={_id}
                      currentStatus={status as PaymentStatus}
                      currentRefundReason={refundReason || ""}
                      refetch={refetch}
                    />
                  </TableCell>

                  {/* Огноо */}
                  <TableCell>{formatMongolianDateString(createdAt)}</TableCell>
                  {/* Цагийн зөрүү */}
                  <TableCell>{getTimeDiffDescription(createdAt)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
