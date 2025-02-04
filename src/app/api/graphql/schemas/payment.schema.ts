// src/app/api/graphql/schema/payment.schema.ts
import gql from "graphql-tag";

export const typeDefs = gql`
  type Payment {
    _id: ID!
    userId: User!
    courseId: Course!
    amount: Float!
    transactionNote: String!
    status: PaymentStatus!
    paymentMethod: PaymentMethod!
    expiryDate: String
    refundReason: String
    createdAt: String!
    updatedAt: String!
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
    getAllPayments: [Payment]
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
