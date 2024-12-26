import gql from "graphql-tag";

export const typeDefs = gql`
  type Test {
    _id: ID!
    name: String!
  }

  type Query {
    getAllTest: [Test!]!
  }

  type Mutation {
    createTest(name: String!): Test!
    updateTest(id: ID!, name: String!): Test!
    deleteTest(id: ID!): Test!
  }
`;
