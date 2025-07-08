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

  // 🆕 Нэмэх хэрэгтэй зүйл
  UserV2: {
    __resolveType(user: { role: string }) {
      switch (user.role) {
        case "STUDENT":
          return "StudentUserV2";
        case "INSTRUCTOR":
          return "InstructorUserV2";
        case "ADMIN":
          return "AdminUserV2";
        default:
          return null;
      }
    },
  },

  Date: GraphQLDateTime,
  Query,
  Mutation,
};
