import { mergeTypeDefs } from "@graphql-tools/merge";

import { typeDefs as TestTypeDefs } from "./test.schema";

export const typeDefs = mergeTypeDefs([TestTypeDefs]);
