// src/app/api/graphql/schemas/user.schema.ts
import gql from "graphql-tag";

export const typeDefs = gql`
  scalar Date

  # --- Common Enums & Interfaces ---
  enum UserV2Role {
    STUDENT
    INSTRUCTOR
    ADMIN
  }

  enum PayoutMethod {
    BANK_TRANSFER
  }

  enum BankName {
    KHAN_BANK
    GOLOMT_BANK
    TRADE_AND_DEVELOPMENT_BANK
    XAC_BANK
    STATE_BANK_OF_MONGOLIA
    M_BANK
    ARIG_BANK
    CAPITRON_BANK
    BOGD_BANK
  }

  interface UserV2 {
    _id: ID!
    email: String!
    isVerified: Boolean!
    createdAt: Date
    updatedAt: Date
    role: UserV2Role!
  }

  # --- Role-Specific Types ---
  type StudentUserV2 implements UserV2 {
    _id: ID!
    email: String!
    isVerified: Boolean!
    createdAt: Date
    updatedAt: Date
    role: UserV2Role!

    studentId: String
  }

  type InstructorUserV2 implements UserV2 {
    _id: ID!
    email: String!
    isVerified: Boolean!
    createdAt: Date
    updatedAt: Date
    role: UserV2Role!

    fullName: String
    bio: String
    profilePicture: ProfilePicture
    payout: InstructorPayoutInfo
  }

  type AdminUserV2 implements UserV2 {
    _id: ID!
    email: String!
    isVerified: Boolean!
    createdAt: Date
    updatedAt: Date
    role: UserV2Role!

    adminLevel: Int
  }

  type ProfilePicture {
    publicId: String!
    width: Int
    height: Int
    format: String
  }

  type InstructorPayoutInfo {
    payoutMethod: PayoutMethod
    bankName: BankName
    accountHolderName: String
    accountNumber: String
  }

  # --- Pagination Result ---
  type UserV2PaginationResult {
    users: [UserV2!]!
    totalCount: Int!
    hasNextPage: Boolean!
  }

  # --- Inputs ---
  input RegisterUserV2Input {
    email: String!
    password: String!
  }

  input RegisterUserWithOtpInput {
    email: String!
    password: String!
  }

  input UpdateInstructorUserV2Input {
    fullName: String
    bio: String
  }

  input UploadProfilePictureInput {
    publicId: String!
    width: Int
    height: Int
    format: String
  }

  input UserV2FilterInput {
    search: String
    role: UserV2Role
    isVerified: Boolean
  }

  input ChangePasswordInput {
    oldPassword: String!
    newPassword: String!
  }

  input UpdateInstructorPayoutInfoInput {
    payoutMethod: PayoutMethod
    bankName: BankName
    accountHolderName: String
    accountNumber: String
  }

  # --- Queries ---
  type Query {
    getUserV2ById(_id: ID!): UserV2!
    getInstructorUserV2InfoById(_id: ID!): InstructorUserV2!
    getAllUsersV2(
      limit: Int
      offset: Int
      sortBy: String
      sortOrder: String
      filter: UserV2FilterInput
    ): UserV2PaginationResult!
  }

  # --- Mutations ---
  type Mutation {
    registerUserV2(input: RegisterUserV2Input!): RegisterUserV2Response!

    registerUserWithOtp(
      input: RegisterUserWithOtpInput!
    ): RegisterUserWithOtpResponse!

    updateInstructorUserV2(
      _id: ID!
      input: UpdateInstructorUserV2Input!
    ): UpdateUserV2Response!
    updateInstructorProfilePicture(
      _id: ID!
      input: UploadProfilePictureInput!
    ): UpdateUserV2Response!
    changeUserPassword(input: ChangePasswordInput!): ChangePasswordResponse!
    updateInstructorPayoutInfo(
      input: UpdateInstructorPayoutInfoInput!
    ): UpdateUserV2Response!
  }

  # --- Mutation Responses ---
  type RegisterUserV2Response {
    success: Boolean!
    message: String!
    userV2: UserV2
  }

  type RegisterUserWithOtpResponse {
    success: Boolean!
    message: String!
    userV2: UserV2
  }

  type UpdateUserV2Response {
    success: Boolean!
    message: String!
  }

  type ChangePasswordResponse {
    success: Boolean!
    message: String!
  }
`;
