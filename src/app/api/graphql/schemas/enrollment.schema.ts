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
  }

  extend type Query {
    getEnrollmentsByUser(userId: ID!): [Enrollment!]!
    getEnrollmentsByCourse(courseId: ID!): [Enrollment!]!
    getEnrollmentByUserAndCourse(userId: ID!, courseId: ID!): Enrollment
    checkEnrollment(courseId: ID!, userId: ID!): Enrollment
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

export type markLessonAsCompletedInput = {
  enrollmentId: string;
  lessonId: string;
};

export type undoLessonCompletionInput = {
  enrollmentId: string;
  lessonId: string;
};

export type UpdateEnrollmentInput = {
  _id: string;
  progress?: number;
  status?: "ACTIVE" | "COMPLETED" | "CANCELLED" | "PENDING";
  completedLessons?: string[]; // Array of completed lesson IDs
};

export type Enrollment = {
  _id: string;
  userId: string;
  courseId: string;
  progress: number;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED" | "PENDING";
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isCompleted: boolean;
  lastAccessedAt: string | null;
  history: {
    status: "ACTIVE" | "COMPLETED" | "CANCELLED" | "PENDING";
    progress: number;
    updatedAt: string;
  }[];
  completedLessons: string[];
};
