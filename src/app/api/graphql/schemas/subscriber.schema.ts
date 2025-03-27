import gql from "graphql-tag";

export const typeDefs = gql`
  scalar Date

  type Subscriber {
    _id: ID!
    email: String!
    subscribedAt: Date!
  }

  type SubscribeResponse {
    success: Boolean!
    message: String!
    subscriber: Subscriber
  }

  input SubscribeInput {
    email: String!
  }

  extend type Mutation {
    createSubscriber(input: SubscribeInput!): SubscribeResponse!
  }
`;
