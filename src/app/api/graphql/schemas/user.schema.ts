// src/app/api/graphql/schemas/user.schema.ts
import gql from "graphql-tag";

export const typeDefs = gql`
  type User {
    _id: ID!
    email: String!
    studentId: String!
    role: Role!
    isVerified: Boolean!
  }

  enum Role {
    STUDENT
    INSTRUCTOR
    ADMIN
  }

  type Query {
    getUserById(_id: ID!): User!
    getAllUser: [User!]!
  }

  input RegisterInput {
    email: String!
    password: String!
  }

  type RegisterResponse {
    message: String!
    user: User!
  }

  input UpdateInput {
    email: String
  }

  type Mutation {
    createUser(input: RegisterInput!): RegisterResponse!
    updateUser(input: UpdateInput!, _id: ID!): User!
    deleteUser(id: ID!): User!
  }
`;
