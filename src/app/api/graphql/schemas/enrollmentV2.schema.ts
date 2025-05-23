import gql from "graphql-tag";

export const typeDefs = gql`
  scalar Date

  enum EnrollmentV2Status {
    ACTIVE
    COMPLETED
    CANCELLED
    PENDING
    EXPIRED
  }

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
    status: EnrollmentStatus!
    progress: Float!
    updatedAt: Date!
  }

  extend type Query {
    checkEnrollmentV2(courseId: ID!): checkEnrollmentV2Response
    myEnrolledCoursesV2: MyEnrolledCoursesV2Response
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

  input CreateEnrollmentV2Input {
    courseId: ID!
  }

  input UpdateLessonCompletionStatusInput {
    enrollmentId: ID!
    lessonId: ID!
    completed: Boolean
  }

  extend type Mutation {
    createEnrollmentV2(
      input: CreateEnrollmentV2Input!
    ): EnrollmentV2MutationResponse!
    updateLessonCompletionStatus(
      input: UpdateLessonCompletionStatusInput!
    ): EnrollmentV2MutationResponse!
  }

  type EnrollmentV2MutationResponse {
    success: Boolean!
    message: String
  }
`;
