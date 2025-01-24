import gql from "graphql-tag";

export const typeDefs = gql`
  type Lesson {
    _id: ID!
    sectionId: Section!
    title: String!
    content: String
    videoUrl: String
    order: Int!
    isPublished: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getLessonById(_id: ID!): Lesson!
    getLessonsBySection(sectionId: ID!): [Lesson!]!
  }

  type DeleteLessonReponse {
    success: Boolean!
    message: String
  }

  type Mutation {
    createLesson(input: CreateLessonInput!): Lesson!
    updateLesson(_id: ID!, input: UpdateLessonInput!): Lesson!
    deleteLesson(_id: ID!): DeleteLessonReponse!
  }

  input CreateLessonInput {
    sectionId: ID!
    title: String!
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

export type UpdateLessonInput = {
  title?: string;
  content?: string;
  videoUrl?: string;
  order?: number;
  isPublished?: boolean;
};
