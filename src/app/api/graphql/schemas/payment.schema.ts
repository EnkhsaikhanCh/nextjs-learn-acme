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
    refundReason: String
    createdAt: Date!
    updatedAt: Date
  }

  enum PaymentStatus {
    PENDING
    APPROVED
    FAILED
    REFUNDED
  }

  enum PaymentMethod {
    QPAY
    CREDIT_CARD
    BANK_TRANSFER
    OTHER
  }

  type PaymentPaginationResult {
    payments: [Payment!]!
    totalCount: Int!
    totalAmount: Float!
    hasNextPage: Boolean!
  }

  type Query {
    getAllPayments(
      limit: Int
      offset: Int
      search: String
    ): PaymentPaginationResult!
    getPaymentById(_id: ID!): Payment
    getPaymentsByUser(userId: ID!): [Payment]
    getPaymentByUserAndCourse(userId: ID!, courseId: ID!): Payment
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
    updatePaymentStatus(
      _id: ID!
      status: PaymentStatus!
      refundReason: String
    ): Payment
  }
`;
