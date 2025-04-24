import gql from "graphql-tag";

export const typeDefs = gql`
  scalar Date

  # --- Common Enums & Interfaces ---
  enum LessonType {
    VIDEO
    TEXT
    FILE
    QUIZ
    ASSIGNMENT
  }

  interface LessonV2 {
    _id: ID!
    sectionId: Section!
    title: String!
    order: Int!
    isPublished: Boolean!
    isFree: Boolean!
    createdAt: Date!
    updatedAt: Date!
    type: LessonType!
  }

  # --- Mux Upload Helper Types ---
  enum PlaybackPolicy {
    PUBLIC
    SIGNED
  }

  type MuxUpload {
    # The Mux upload ID—tie this back to your VideoLesson.
    uploadId: String!
    # Signed URL that the client will PUT the file to.
    uploadUrl: String!
    # Optional passthrough value to identify the upload.
    passthrough: String!
  }

  # --- Lesson Types ---
  type VideoLesson implements LessonV2 {
    _id: ID!
    sectionId: Section!
    title: String!
    order: Int!
    isPublished: Boolean!
    isFree: Boolean!
    createdAt: Date!
    updatedAt: Date!
    type: LessonType!

    passthrough: String
    status: String
    muxUploadId: String
    muxAssetId: String
    muxPlaybackId: String
    duration: Float
  }

  type TextLesson implements LessonV2 {
    _id: ID!
    sectionId: Section!
    title: String!
    order: Int!
    isPublished: Boolean!
    isFree: Boolean!
    createdAt: Date!
    updatedAt: Date!
    type: LessonType!

    content: String
  }

  type FileLesson implements LessonV2 {
    _id: ID!
    sectionId: Section!
    title: String!
    order: Int!
    isPublished: Boolean!
    isFree: Boolean!
    createdAt: Date!
    updatedAt: Date!
    type: LessonType!

    fileUrl: String
  }

  type QuizLesson implements LessonV2 {
    _id: ID!
    sectionId: Section!
    title: String!
    order: Int!
    isPublished: Boolean!
    isFree: Boolean!
    createdAt: Date!
    updatedAt: Date!
    type: LessonType!

    quizQuestions: [QuizQuestion!]!
  }

  type AssignmentLesson implements LessonV2 {
    _id: ID!
    sectionId: Section!
    title: String!
    order: Int!
    isPublished: Boolean!
    isFree: Boolean!
    createdAt: Date!
    updatedAt: Date!
    type: LessonType!

    assignmentDetails: String
  }

  type QuizQuestion {
    question: String!
    answers: [String!]!
    correctAnswer: String!
  }

  # --- Queries ---
  type Query {
    getLessonV2ByIdForInstructor(_id: ID!): LessonV2!
    getLessonsV2BySection(sectionId: ID!): [LessonV2!]!
  }

  # --- Mutation Responses ---
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

  # --- Mutations ---
  type Mutation {
    createMuxUploadUrl(
      playbackPolicy: [PlaybackPolicy!] = [SIGNED]
      corsOrigin: String = "*"
    ): MuxUpload!
    createLessonV2(input: CreateLessonV2Input!): CreateLessonV2Response!
    updateLessonV2(
      _id: ID!
      input: UpdateLessonV2Input!
    ): UpdateLessonV2Response!
    deleteLessonV2(_id: ID!): DeleteLessonV2Response!
  }

  # --- Inputs ---
  input CreateLessonV2Input {
    type: LessonType!
    sectionId: ID!
    title: String!
    order: Int
  }

  input UpdateLessonV2Input {
    title: String
    content: String
    fileUrl: String
    quizQuestions: [QuizQuestionInput!]
    assignmentDetails: String
    order: Int
    isPublished: Boolean
    isFree: Boolean
    passthrough: String
    status: String
    duration: Float
    muxUploadId: String
    muxAssetId: String
    muxPlaybackId: String
  }

  input QuizQuestionInput {
    question: String!
    answers: [String!]!
    correctAnswer: String!
  }
`;
