import gql from "graphql-tag";

export const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    password: String!
  }

  type Query {
    getUserById(id: ID!): User!
    getAllUser: [User!]!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  type RegisterResponse {
    message: String!
  }

  input UpdateInput {
    name: String
    email: String
  }

  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  type ChangePasswordResponse {
    message: String!
  }

  type Mutation {
    createUser(input: RegisterInput!): RegisterResponse!
    updateUser(input: UpdateInput!, _id: ID!): User!
    deleteUser(id: ID!): User!
    changePassword(
      input: ChangePasswordInput
      _id: ID!
    ): ChangePasswordResponse!
  }
`;

export type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type UpdateInput = {
  name: string;
  email: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};
