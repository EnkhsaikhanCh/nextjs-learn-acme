import gql from "graphql-tag";

export const typeDefs = gql`
  type Enrollment {
    # Essential fields
    _id: ID!
    courseId: Course
    userId: User
    status: EnrollmentStatus
    progress: Float

    # User experience-related fields
    isCompleted: Boolean
    completedLessons: [ID]
    lastAccessedAt: String

    # System tracking fields
    expiryDate: String
    createdAt: String
    updatedAt: String
    history: [EnrollmentHistory]
    isDeleted: Boolean
  }

  type EnrollmentHistory {
    status: EnrollmentStatus!
    progress: Float!
    updatedAt: String!
  }

  enum EnrollmentStatus {
    ACTIVE
    COMPLETED
    CANCELLED
    PENDING
    EXPIRED
  }

  extend type Query {
    getEnrollmentsByUser(userId: ID!): [Enrollment!]!
    getEnrollmentsByCourse(courseId: ID!): [Enrollment!]!
    getEnrollmentByUserAndCourse(userId: ID!, courseId: ID!): Enrollment
    checkEnrollment(courseId: ID!): Enrollment
  }

  input CreateEnrollmentInput {
    userId: ID!
    courseId: ID!
  }

  input UpdateEnrollmentInput {
    _id: ID!
    progress: Float
    status: EnrollmentStatus
  }

  input markLessonAsCompletedInput {
    enrollmentId: ID!
    lessonId: ID!
  }

  input undoLessonCompletionInput {
    enrollmentId: ID!
    lessonId: ID!
  }

  extend type Mutation {
    createEnrollment(input: CreateEnrollmentInput): Enrollment
    updateEnrollment(input: UpdateEnrollmentInput): Enrollment
    markLessonAsCompleted(input: markLessonAsCompletedInput): Enrollment
    undoLessonCompletion(input: undoLessonCompletionInput): Enrollment
  }
`;
