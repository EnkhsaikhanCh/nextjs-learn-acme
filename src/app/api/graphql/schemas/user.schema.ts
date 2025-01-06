import gql from "graphql-tag";

export const typeDefs = gql`
  type User {
    _id: ID!
    email: String!
    studentId: String!
    password: String!
  }

  type Query {
    getUserById(id: ID!): User!
    getAllUser: [User!]!
  }

  input RegisterInput {
    email: String!
    password: String!
  }

  type RegisterResponse {
    message: String!
  }

  input UpdateInput {
    email: String
  }

  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  type ChangePasswordResponse {
    message: String!
  }

  type EncryptedResponse {
    encryptedData: String!
    iv: String!
    authTag: String!
  }

  type Mutation {
    createUser(input: RegisterInput!): RegisterResponse!
    updateUser(input: UpdateInput!, _id: ID!): User!
    deleteUser(id: ID!): User!
    changePassword(
      input: ChangePasswordInput
      _id: ID!
    ): ChangePasswordResponse!
    encryptData(data: String!): EncryptedResponse!
    decryptData(encryptedData: String!, iv: String!, authTag: String!): String!
  }
`;

export type User = {
  _id: string;
  email: string;
  studentId: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  password: string;
};

export type UpdateInput = {
  email: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};
