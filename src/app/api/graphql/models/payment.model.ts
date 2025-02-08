import { model, models, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export type Payment = {
  _id: string;
  userId: string;
  courseId: string;
  amount: number;
  transactionNote: string;
  paymentMethod: "QPAY" | "CREDIT_CARD" | "BANK_TRANSFER" | "OTHER";
  status: "PENDING" | "APPROVED" | "FAILED" | "REFUNDED";
  createdAt: Date;
  updatedAt: Date;
  expiryDate?: Date; // COMPLETED үед л үүснэ
  refundReason?: string;
};

const PaymentSchema = new Schema<Payment>(
  {
    _id: { type: String, default: () => uuidv4() },
    userId: {
      type: String,
      ref: "User",
      required: [true, "User ID is required"],
    },
    courseId: {
      type: String,
      ref: "Course",
      required: [true, "Course ID is required"],
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },
    transactionNote: {
      type: String,
      required: [true, "Transaction Note is required"],
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "FAILED", "REFUNDED"],
      required: true,
      default: "PENDING",
    },
    paymentMethod: {
      type: String,
      enum: ["QPAY", "CREDIT_CARD", "BANK_TRANSFER", "OTHER"],
      required: true,
    },
    expiryDate: { type: Date, default: null },
    refundReason: { type: String, default: null },
  },
  { timestamps: true },
);

// Middleware: `status` нь `COMPLETED` болбол `expiryDate`-ийг тохируулах
PaymentSchema.pre("save", function (next) {
  if (this.status === "APPROVED" && !this.expiryDate) {
    const now = new Date();
    now.setMonth(now.getMonth() + 1); // 1 сарын эрх
    this.expiryDate = now;
  }
  next();
});

// Index for searching payments quickly
PaymentSchema.index({ userId: 1, courseId: 1 }, { unique: false });

export const PaymentModel =
  models["Payment"] || model<Payment>("Payment", PaymentSchema);
