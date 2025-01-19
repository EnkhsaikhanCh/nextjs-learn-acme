// src/app/api/grpahql/schemas/course.schema.ts
import gql from "graphql-tag";

export const typeDefs = gql`
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

  enum CourseStatus {
    active
    archived
  }

  type Query {
    getCourseById(_id: ID!): Course
    getAllCourse: [Course!]!
  }

  input CreateCourseInput {
    title: String!
    description: String!
    price: Float!
    duration: Int
    createdBy: String
    categories: [String]
    tags: [String]
    status: CourseStatus
    enrollmentId: [ID]
    thumbnail: String
  }

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
    enrollmentId: [ID]
    thumbnail: String
  }

  type Mutation {
    createCourse(input: CreateCourseInput!): Course!
    updateCourse(input: UpdateCourseInput!): Course!
    deleteCourse(_id: ID!): Boolean!
  }
`;

export type CreateCourseInput = {
  title: string;
  description: string;
  price: number;
  sectionId?: string[];
  duration?: number;
  createdBy?: string;
  categories?: string[];
  tags?: string[];
  status?: "active" | "archived";
  enrollmentId?: string[];
  thumbnail?: string;
};
