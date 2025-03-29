// src/app/api/graphql/schemas/user.schema.ts
import gql from "graphql-tag";

export const typeDefs = gql`
  type User {
    _id: ID!
    email: String!
    studentId: String
    role: Role!
    isVerified: Boolean!
    createdAt: Date
    updatedAt: Date
  }

  enum Role {
    STUDENT
    INSTRUCTOR
    ADMIN
  }

  type UserPaginationResult {
    users: [User!]!
    totalCount: Int!
    hasNextPage: Boolean!
  }

  type Query {
    getUserById(_id: ID!): User!
    getAllUser(
      limit: Int
      offset: Int
      sortBy: String
      sortOrder: String
      filter: UserFilterInput
    ): UserPaginationResult!
  }

  input RegisterInput {
    email: String!
    password: String!
  }

  input UserFilterInput {
    search: String
    role: Role
    isVerified: Boolean
  }

  type RegisterResponse {
    message: String!
    user: User!
  }

  input UpdateUserInput {
    email: String
    role: Role
  }

  type Mutation {
    createUser(input: RegisterInput!): RegisterResponse!
    updateUser(input: UpdateUserInput!, _id: ID!): User!
    deleteUser(id: ID!): User!
  }
`;
