// src/app/api/graphql/schema/auth.schema.ts
import gql from "graphql-tag";

export const typeDefs = gql`
  type Mutation {
    generateTempToken(email: String!): GenerateTempTokenResponse!
    sendOTP(email: String!): SendOTPResponse!
  }

  type GenerateTempTokenResponse {
    token: String!
  }

  type SendOTPResponse {
    success: Boolean!
    message: String
  }
`;
