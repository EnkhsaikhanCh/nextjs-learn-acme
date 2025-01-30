// src/app/api/graphql/schemas/course.schema.ts
import gql from "graphql-tag";

export const typeDefs = gql`
  # Course Type Definition
  type Course {
    _id: ID!
    title: String!
    description: String!
    courseCode: String!
    price: Float!
    pricingDetails: pricingDetails
    sectionId: [Section]
    duration: Int
    createdBy: String
    categories: [String]
    tags: [String]
    status: CourseStatus
    enrollmentId: [Enrollment]
    thumbnail: String
    whatYouWillLearn: [String]
    whyChooseOurCourse: [WhyChoose]
  }

  # Pricing Details Type
  type pricingDetails {
    planTitle: String
    description: String
    price: String
    details: [String]
  }

  # Enum for Course Status
  enum CourseStatus {
    active
    archived
  }

  type WhyChoose {
    icon: String!
    title: String!
    description: String!
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
    pricingDetails: PricingDetailsInput
    duration: Int
    createdBy: String
    categories: [String]
    tags: [String]
    status: CourseStatus
    thumbnail: String
    whatYouWillLearn: [String]
    whyChooseOurCourse: [WhyChooseInput]
  }

  # Input for Pricing Details
  input PricingDetailsInput {
    planTitle: String
    description: String
    price: String
    details: [String]
  }

  # Input for WhyChooseOurCourse
  input WhyChooseInput {
    icon: String!
    title: String!
    description: String!
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
  pricingDetails?: {
    planTitle?: string;
    description?: string;
    price?: string;
    details?: string[];
  };
  duration?: number;
  createdBy?: string;
  categories?: string[];
  tags?: string[];
  status?: "active" | "archived";
  thumbnail?: string;
  whatYouWillLearn?: string[];
  whyChooseOurCourse?: { icon: string; title: string; description: string }[];
};

export type UpdateCourseInput = {
  _id: string;
  title?: string;
  description?: string;
  price?: number;
  pricingDetails?: {
    planTitle?: string;
    description?: string;
    price?: string;
    details?: string[];
  };
  duration?: number;
  createdBy?: string;
  categories?: string[];
  tags?: string[];
  status?: "active" | "archived";
  thumbnail?: string;
  whatYouWillLearn?: string[];
  whyChooseOurCourse?: { icon: string; title: string; description: string }[];
};
