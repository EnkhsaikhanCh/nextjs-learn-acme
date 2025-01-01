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

  input UpdateInput {
    name: String
    email: String
  }

  type Mutation {
    createUser(input: RegisterInput!): User!
    updateUser(input: UpdateInput!, _id: ID!): User!
    deleteUser(id: ID!): User!
  }
`;

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type UpdateInput = {
  name: string;
  email: string;
};
