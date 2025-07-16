// src/app/api/graphql/schema/auth.schema.ts
import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    getEmailFromToken(token: String!): GetEmailFromTokenResponse!
  }

  type Mutation {
    generateTempToken(email: String!): GenerateTempTokenResponse!
    sendOTP(email: String!): SendOTPResponse!
    verifyOTP(email: String!, otp: String!): VerifyOTPResponse!
  }

  type GenerateTempTokenResponse {
    token: String!
  }

  type SendOTPResponse {
    success: Boolean!
    message: String
  }

  type VerifyOTPResponse {
    success: Boolean!
    message: String!
    user: UserV2
    signInToken: String
  }

  type GetEmailFromTokenResponse {
    email: String!
  }
`;
