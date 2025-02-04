"use client";

import * as React from "react";
import { useGetAllPaymentsQuery } from "@/generated/graphql";
import { useState } from "react";
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

export default function PaymentManagement() {
  const { data, loading, error } = useGetAllPaymentsQuery();
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  if (loading) return <LoadingOverlay />;
  if (error) return <p>Error loading payments.</p>;

  const payments = data?.getAllPayments || [];

  // `selectedStatus`-д үндэслэн `filter` хийх
  const filteredPayments =
    selectedStatus === "ALL"
      ? payments
      : payments.filter(
          (payment) => payment && payment.status === selectedStatus,
        );

  return (
    <main className="p-4">
      <h2 className="mb-4 text-xl font-semibold">Payment Management</h2>

      {/* Status Filter Dropdown */}
      <div className="mb-4">
        <Select onValueChange={(value) => setSelectedStatus(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Payment transactions list</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User Email</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Transaction Note</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment?._id}>
                <TableCell>{payment?.userId?.email || "N/A"}</TableCell>
                <TableCell>{payment?.courseId?.title || "N/A"}</TableCell>
                <TableCell>₮ {payment?.amount}</TableCell>
                <TableCell>{payment?.transactionNote || "N/A"}</TableCell>
                <TableCell>
                  <Badge
                    className={`border font-semibold ${
                      payment?.status === "PENDING"
                        ? "border-yellow-600 bg-yellow-200 text-yellow-800 hover:bg-yellow-200"
                        : payment?.status === "COMPLETED"
                          ? "border-green-600 bg-green-200 text-green-800 hover:bg-green-200"
                          : payment?.status === "FAILED"
                            ? "border-red-600 bg-red-200 text-red-800 hover:bg-red-200"
                            : payment?.status === "REFUNDED"
                              ? "border-blue-600 bg-blue-200 text-blue-800 hover:bg-blue-200"
                              : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {payment?.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {payment?.createdAt && !isNaN(Number(payment.createdAt))
                    ? new Intl.DateTimeFormat("mn-MN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        timeZone: "Asia/Ulaanbaatar",
                        timeZoneName: "short",
                      }).format(new Date(Number(payment.createdAt)))
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {payment?.createdAt && !isNaN(Number(payment.createdAt))
                    ? (() => {
                        const createdTime = new Date(Number(payment.createdAt));
                        const now = new Date();
                        const diffInMs = now.getTime() - createdTime.getTime();
                        const diffInMinutes = Math.floor(diffInMs / 60000);

                        if (diffInMinutes < 1) return "Дөнгөж сая";
                        if (diffInMinutes < 60)
                          return `${diffInMinutes} минутын өмнө`;
                        const diffInHours = Math.floor(diffInMinutes / 60);
                        if (diffInHours < 24)
                          return `${diffInHours} цагийн өмнө`;
                        const diffInDays = Math.floor(diffInHours / 24);
                        return `${diffInDays} өдрийн өмнө`;
                      })()
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
