// src/app/api/graphql/schema/payment.schema.ts
import gql from "graphql-tag";

export const typeDefs = gql`
  type Payment {
    _id: ID!
    userId: ID!
    courseId: ID!
    amount: Float!
    status: PaymentStatus!
    transactionId: String
    paymentMethod: PaymentMethod!
    createdAt: String!
    updatedAt: String!
    expiryDate: String
    refundReason: String
    transactionNote: String
  }

  enum PaymentStatus {
    PENDING
    COMPLETED
    FAILED
    REFUNDED
  }

  enum PaymentMethod {
    QPAY
    CREDIT_CARD
    BANK_TRANSFER
    OTHER
  }

  type Query {
    getPayment(_id: ID!): Payment
    getPaymentsByUser(userId: ID!): [Payment]
  }

  input CreatePaymentInput {
    userId: ID!
    courseId: ID!
    amount: Float!
    transactionNote: String
    paymentMethod: PaymentMethod!
  }

  type Mutation {
    createPayment(input: CreatePaymentInput!): Payment
    updatePaymentStatus(_id: ID!, status: PaymentStatus!): Payment
  }
`;

export type CreatePaymentInput = {
  userId: string;
  courseId: string;
  amount: number;
  transactionNote: string;
  paymentMethod: "QPAY" | "CREDIT_CARD" | "BANK_TRANSFER" | "OTHER"; // ✅ Uppercase
};
