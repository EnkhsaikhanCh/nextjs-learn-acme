import { mergeTypeDefs } from "@graphql-tools/merge";

import { typeDefs as TestTypeDefs } from "./test.schema";
import { typeDefs as UserTypeDefs } from "./user.schema";
import { typeDefs as CourseTypeDefs } from "./course.schema";

export const typeDefs = mergeTypeDefs([
  TestTypeDefs,
  UserTypeDefs,
  CourseTypeDefs,
]);
