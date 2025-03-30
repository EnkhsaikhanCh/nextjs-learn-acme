// src/app/api/graphql/resolvers/index.ts
import * as Query from "./queries";
import * as Mutation from "./mutations";
import { GraphQLDateTime } from "graphql-scalars";

export const resolvers = {
  Date: GraphQLDateTime,
  Query,
  Mutation,
};
