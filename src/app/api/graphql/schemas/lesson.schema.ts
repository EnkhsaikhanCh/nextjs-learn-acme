import gql from "graphql-tag";

export const typeDefs = gql`
  type Lesson {
    _id: ID!
    sectionId: Section!
    title: String!
    content: String!
    videoUrl: String
    order: Int!
    isPublished: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getLessonById(id: ID!): Lesson!
    getLessonsBySection(sectionId: ID!): [Lesson!]!
  }

  type Mutation {
    createLesson(input: CreateLessonInput!): Lesson!
    updateLesson(id: ID!, input: UpdateLessonInput!): Lesson!
    deleteLesson(id: ID!): Boolean!
  }

  input CreateLessonInput {
    sectionId: ID!
    title: String!
    content: String!
    videoUrl: String
    order: Int!
  }

  input UpdateLessonInput {
    title: String
    content: String
    videoUrl: String
    order: Int
    isPublished: Boolean
  }
`;

export type CreateLessonInput = {
  sectionId: string;
  title: string;
  content: string;
  videoUrl: string;
  order: number;
};
