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

  extend type Mutation {
    createEnrollment(input: CreateEnrollmentInput): Enrollment
    updateEnrollment(input: UpdateEnrollmentInput): Enrollment
  }
`;

export type CreateEnrollmentInput = {
  userId: string;
  courseId: string;
};
