// src/app/api/graphql/schemas/user.schema.ts
import gql from "graphql-tag";

export const typeDefs = gql`
  type User {
    _id: ID!
    email: String!
    studentId: String!
    role: String!
    isVerified: String!
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

export type User = {
  _id: string;
  email: string;
  studentId: string;
  role: string;
  isVerified: string;
};

export type RegisterInput = {
  email: string;
  password: string;
};

export type UpdateInput = {
  email: string;
};
