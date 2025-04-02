// src/app/api/graphql/schema/auth.schema.ts
import gql from "graphql-tag";

export const typeDefs = gql`
  type Mutation {
    generateTempToken(email: String!): GenerateTempTokenResponse!
  }

  type GenerateTempTokenResponse {
    token: String!
  }
`;
