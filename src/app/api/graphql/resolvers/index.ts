// src/app/api/graphql/resolvers/index.ts
import * as Query from "./queries";
import * as Mutation from "./mutations";
import { GraphQLDateTime } from "graphql-scalars";

export const resolvers = {
  LessonV2: {
    __resolveType(lesson: { type: string }) {
      switch (lesson.type) {
        case "VIDEO":
          return "VideoLesson";
        case "TEXT":
          return "TextLesson";
        case "FILE":
          return "FileLesson";
        case "QUIZ":
          return "QuizLesson";
        case "ASSIGNMENT":
          return "AssignmentLesson";
        default:
          return null;
      }
    },
  },

  Date: GraphQLDateTime,
  Query,
  Mutation,
};
