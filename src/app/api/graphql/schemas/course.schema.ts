// src/app/api/grpahql/schemas/course.schema.ts
import gql from "graphql-tag";

export const typeDefs = gql`
  # Course Type Definition
  type Course {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    sectionId: [Section]
    duration: Int
    createdBy: String
    categories: [String]
    tags: [String]
    status: CourseStatus
    enrollmentId: [Enrollment]
    thumbnail: String
  }

  # Enum for Course Status
  enum CourseStatus {
    active
    archived
  }

  # Queries
  type Query {
    # Fetch a course by its ID
    getCourseById(_id: ID!): Course

    # Fetch all available courses
    getAllCourse: [Course!]!
  }

  # Input for creating a course
  input CreateCourseInput {
    title: String!
    description: String!
    price: Float!
  }

  # Input for updating a course
  input UpdateCourseInput {
    _id: ID!
    title: String
    description: String
    price: Float
    duration: Int
    createdBy: String
    categories: [String]
    tags: [String]
    status: CourseStatus
    thumbnail: String
  }

  # Mutations
  type Mutation {
    # Create a new course
    createCourse(input: CreateCourseInput!): Course!

    # Update an existing course
    updateCourse(input: UpdateCourseInput!): Course!

    # Delete a course by its ID
    deleteCourse(_id: ID!): Boolean!
  }
`;

export type CreateCourseInput = {
  title: string;
  description: string;
  price: number;
  duration?: number; // Optional
  createdBy?: string; // Optional
  categories?: string[]; // Optional
  tags?: string[]; // Optional
  status?: "active" | "archived"; // Optional
  thumbnail?: string; // Optional
};

export type UpdateCourseInput = {
  _id: string;
  title?: string;
  description?: string;
  price?: number;
  duration?: number; // Optional
  createdBy?: string; // Optional
  categories?: string[]; // Optional
  tags?: string[]; // Optional
  status?: "active" | "archived"; // Optional
  thumbnail?: string; // Optional
};
