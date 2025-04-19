import gql from "graphql-tag";

export const typeDefs = gql`
  enum LessonType {
    VIDEO
    TEXT
    FILE
    QUIZ
    ASSIGNMENT
  }

  # Interface for common lesson fields
  interface LessonV2 {
    _id: ID!
    sectionId: Section!
    title: String!
    order: Int!
    isPublished: Boolean!
    createdAt: String!
    updatedAt: String!
    type: LessonType! # Expose the discriminator key
  }

  type VideoLesson implements LessonV2 {
    _id: ID!
    sectionId: Section!
    title: String!
    order: Int!
    isPublished: Boolean!
    createdAt: String!
    updatedAt: String!
    type: LessonType!
    videoUrl: String
  }

  type TextLesson implements LessonV2 {
    _id: ID!
    sectionId: Section!
    title: String!
    order: Int!
    isPublished: Boolean!
    createdAt: String!
    updatedAt: String!
    type: LessonType!
    content: String
  }

  type FileLesson implements LessonV2 {
    _id: ID!
    sectionId: Section!
    title: String!
    order: Int!
    isPublished: Boolean!
    createdAt: String!
    updatedAt: String!
    type: LessonType!
    fileUrl: String
  }

  type QuizLesson implements LessonV2 {
    _id: ID!
    sectionId: Section!
    title: String!
    order: Int!
    isPublished: Boolean!
    createdAt: String!
    updatedAt: String!
    type: LessonType!
    quizQuestions: [QuizQuestion!]
  }

  type AssignmentLesson implements LessonV2 {
    _id: ID!
    sectionId: Section!
    title: String!
    order: Int!
    isPublished: Boolean!
    createdAt: String!
    updatedAt: String!
    type: LessonType!
    assignmentDetails: String
  }

  type QuizQuestion {
    question: String!
    answers: [String!]!
    correctAnswer: String!
  }

  type Query {
    getLessonByIdV2(_id: ID!): LessonV2!
    getLessonsBySectionV2(sectionId: ID!): [LessonV2!]!
  }

  type CreateLessonV2Response {
    success: Boolean!
    message: String!
  }

  type UpdateLessonV2Response {
    success: Boolean!
    message: String!
  }

  type DeleteLessonV2Response {
    success: Boolean!
    message: String
  }

  type Mutation {
    createLessonV2(input: CreateLessonV2Input!): CreateLessonV2Response!
    updateLessonV2(
      _id: ID!
      input: UpdateLessonV2Input!
    ): UpdateLessonV2Response!
    deleteLessonV2(_id: ID!): DeleteLessonV2Response!
  }

  input CreateLessonV2Input {
    type: LessonType!
    sectionId: ID!
    title: String!
    order: Int
  }

  input UpdateLessonV2Input {
    title: String
    content: String
    videoUrl: String
    fileUrl: String
    quizQuestions: [QuizQuestionInput!]
    assignmentDetails: String
    order: Int
    isPublished: Boolean
  }

  input QuizQuestionInput {
    question: String!
    answers: [String!]!
    correctAnswer: String!
  }
`;
