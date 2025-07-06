import gql from "graphql-tag";

export const typeDefs = gql`
  scalar Date

  type MuxSignedToken {
    token: String!
  }

  type Query {
    getMuxPlaybackToken(
      courseId: ID!
      playbackId: String!
    ): GetMuxTokenResponse!
  }

  type GetMuxTokenResponse {
    success: Boolean!
    token: String
    message: String
  }
`;
