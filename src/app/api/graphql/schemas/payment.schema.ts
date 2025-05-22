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
    usedForEnrollment: Boolean!
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
      filter: PaymentFilterInput
    ): PaymentPaginationResult!
    getPaymentById(_id: ID!): Payment
    getPaymentsByUser(userId: ID!): [Payment]
    getPaymentByUserAndCourse(userId: ID!, courseId: ID!): Payment
    getCourseCheckoutData(slug: String!): GetCourseCheckoutDataResponse
  }

  type GetCourseCheckoutDataResponse {
    success: Boolean!
    message: String
    course: Course
    user: User
    isPaid: Boolean
    isEnrolled: Boolean
  }

  input PaymentFilterInput {
    search: String
    status: PaymentStatus
  }

  input CreatePaymentInput {
    userId: ID!
    courseId: ID!
    amount: Float!
    transactionNote: String
    paymentMethod: PaymentMethod!
  }

  input CreatePaymentCheckRequest {
    courseId: ID!
    amount: Float!
    transactionNote: String
  }

  input UpdatePaymentStatusV2Input {
    paymentId: ID!
    status: PaymentStatus!
    refundReason: String
  }

  type Mutation {
    createPayment(input: CreatePaymentInput!): Payment
    createPaymentCheckRequest(
      input: CreatePaymentCheckRequest
    ): PaymentMutationResponse
    updatePaymentStatusV2(
      input: UpdatePaymentStatusV2Input
    ): PaymentMutationResponse
  }

  type PaymentMutationResponse {
    success: Boolean!
    message: String
  }
`;
