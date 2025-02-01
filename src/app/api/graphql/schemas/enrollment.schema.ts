import gql from "graphql-tag";

export const typeDefs = gql`
  type Enrollment {
    _id: ID!
    userId: User
    courseId: Course!
    progress: Float!
    status: EnrollmentStatus!
    createdAt: String!
    updatedAt: String!
    isDeleted: Boolean!
    isCompleted: Boolean!
    lastAccessedAt: String
    history: [EnrollmentHistory!]
    completedLessons: [ID!]!
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
    getEnrollmentByUserAndCourse(userId: ID!, courseId: ID!): Enrollment # Fetch a single enrollment
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
    completedLessons: [ID!] # Optionally update completed lessons
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
    markLessonAsCompleted(input: markLessonAsCompletedInput): Enrollment # New mutation for marking lessons
    undoLessonCompletion(input: undoLessonCompletionInput): Enrollment # Mutation for undoing lesson completion
  }
`;

export type CreateEnrollmentInput = {
  userId: string;
  courseId: string;
};

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
  completedLessons: string[]; // Array of completed lesson IDs
};
