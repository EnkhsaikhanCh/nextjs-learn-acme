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

  type SubscriberPaginationResult {
    subscribers: [Subscriber!]!
    totalCount: Int!
    hasNextPage: Boolean!
  }

  extend type Query {
    getAllSubscribers(
      limit: Int
      offset: Int
      search: String
    ): SubscriberPaginationResult!
  }

  extend type Mutation {
    createSubscriber(input: SubscribeInput!): SubscribeResponse!
  }
`;
