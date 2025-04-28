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

    bio: String
    profilePicture: String
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

  input UpdateUserV2Input {
    email: String
    isVerified: Boolean
    # Future: add more fields if necessary
  }

  input UserV2FilterInput {
    search: String
    role: UserV2Role
    isVerified: Boolean
  }

  # --- Queries ---
  type Query {
    getUserV2ById(_id: ID!): UserV2!
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
  }

  # --- Mutation Responses ---
  type RegisterUserV2Response {
    success: Boolean!
    message: String!
    userV2: UserV2
  }
`;
