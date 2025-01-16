// src/app/api/grpahql/schemas/course.schema.ts
import gql from "graphql-tag";

export const typeDefs = gql`
  type Course {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    duration: Int
    createdBy: String
    categories: [String]
    tags: [String]
    status: CourseStatus
    # enrollments: [Enrollments]
    thumbnail: String
  }

  enum CourseStatus {
    active
    archived
  }

  type Query {
    getCourse(_id: ID!): Course
    getCourses: [Course!]!
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
    # enrollments: [Enrollments]
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
    # enrollments: [Enrollments]
    thumbnail: String
  }

  type Mutation {
    createCourse(input: CreateCourseInput!): Course!
    updateCourse(input: UpdateCourseInput!): Course!
    deleteCourse(_id: ID!): Boolean!
  }
`;

export type CreateCourseInput = {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration?: number;
  createdBy?: string;
  categories?: string[];
  tags?: string[];
  status?: "active" | "archived";
  thumbnail?: string;
};
