import gql from "graphql-tag";

export const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    password: String!
  }

  type Query {
    getUser(id: ID!): User!
    getAllUser: [User!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User!
    updateUser(id: ID!, name: String!, email: String!, password: String!): User!
    deleteUser(id: ID!): User!
  }
`;
