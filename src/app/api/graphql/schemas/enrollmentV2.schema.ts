import gql from "graphql-tag";

export const typeDefs = gql`
  # ----------------------
  # Scalar
  # ----------------------
  scalar Date

  # ----------------------
  # Enums
  # ----------------------
  enum EnrollmentV2Status {
    ACTIVE
    COMPLETED
    CANCELLED
    PENDING
    EXPIRED
  }

  enum EnrollmentV2HistoryStatus {
    MARKED_COMPLETED
    UNMARKED_COMPLETED
  }

  # ----------------------
  # Types
  # ----------------------
  type EnrollmentV2 {
    _id: ID!
    userId: User
    courseId: Course
    status: EnrollmentV2Status
    progress: Float
    isCompleted: Boolean
    completedLessons: [ID]
    lastAccessedAt: Date
    expiryDate: Date
    history: [EnrollmentV2History]
    createdAt: Date
    updatedAt: Date
    isDeleted: Boolean
  }

  type EnrollmentV2History {
    status: EnrollmentV2HistoryStatus!
    progress: Float!
    updatedAt: Date!
  }

  type EnrollmentV2MutationResponse {
    success: Boolean!
    message: String
  }

  type MyEnrolledCoursesV2Response {
    success: Boolean!
    message: String
    enrollments: [EnrollmentV2]
  }

  type checkEnrollmentV2Response {
    success: Boolean!
    message: String
  }

  type MyEnrollmentV2ForCourseResponse {
    success: Boolean!
    message: String
    enrollment: EnrollmentV2
  }

  # ----------------------
  # Input Types
  # ----------------------
  input CreateEnrollmentV2Input {
    courseId: ID!
  }

  input UpdateLessonCompletionStatusInput {
    enrollmentId: ID!
    lessonId: ID!
    completed: Boolean
  }

  # ----------------------
  # Queries
  # ----------------------
  extend type Query {
    checkEnrollmentV2(courseId: ID!): checkEnrollmentV2Response
    myEnrolledCoursesV2: MyEnrolledCoursesV2Response
    myEnrollmentV2ForCourse(courseId: ID!): MyEnrollmentV2ForCourseResponse
  }

  # ----------------------
  # Mutations
  # ----------------------
  extend type Mutation {
    createEnrollmentV2(
      input: CreateEnrollmentV2Input!
    ): EnrollmentV2MutationResponse!
    updateLessonCompletionStatus(
      input: UpdateLessonCompletionStatusInput!
    ): EnrollmentV2MutationResponse!
  }
`;
