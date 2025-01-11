// src/app/api/graphql/schemas/user.schema.ts
import gql from "graphql-tag";

export const typeDefs = gql`
  type User {
    _id: ID!
    email: String!
    studentId: String!
    role: String!
    password: String!
  }

  type Query {
    me: User
    getUserById(_id: ID!): User!
    getAllUser: [User!]!
  }

  input RegisterInput {
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RefreshTokenInput {
    refreshToken: String!
  }

  type RegisterResponse {
    message: String!
    token: String
    refreshToken: String
  }

  type LoginResponse {
    message: String!
    token: String
  }

  type RefreshTokenResponse {
    message: String!
    token: String # Шинэ access token
    refreshToken: String # Шинэчлэгдсэн эсвэл хуучин refresh token
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
    token: String
  }

  type EncryptedResponse {
    encryptedData: String!
    iv: String!
    authTag: String!
  }

  type Mutation {
    createUser(input: RegisterInput!): RegisterResponse!
    loginUser(input: LoginInput!): LoginResponse!
    updateUser(input: UpdateInput!, _id: ID!): User!
    deleteUser(id: ID!): User!
    changePassword(
      input: ChangePasswordInput
      _id: ID!
    ): ChangePasswordResponse!
    encryptData(data: String!): EncryptedResponse!
    decryptData(encryptedData: String!, iv: String!, authTag: String!): String!
    refreshToken(input: RefreshTokenInput!): RefreshTokenResponse!
  }
`;

export type User = {
  _id: string;
  email: string;
  studentId: string;
  role: string;
  password: string;
};

export interface Context {
  user?: User;
}

export type RegisterInput = {
  email: string;
  password: string;
};

export type LoginInput = {
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
