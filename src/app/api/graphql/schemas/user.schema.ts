// src/app/api/graphql/schemas/user.schema.ts
import gql from "graphql-tag";

export const typeDefs = gql`
  type User {
    _id: ID!
    email: String!
    studentId: String!
    role: Role!
    isVerified: Boolean!
    createdAt: String!
    updatedAt: String!
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
      search: String
      sortBy: String
      sortOrder: String
    ): UserPaginationResult!
  }

  input RegisterInput {
    email: String!
    password: String!
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
