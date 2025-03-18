// src/app/api/graphql/schemas/course.schema.ts
import gql from "graphql-tag";

export const typeDefs = gql`
  enum Currency {
    USD
    MNT
  }

  enum Difficulty {
    BEGINNER
    INTERMEDIATE
    ADVANCED
  }

  enum CourseStatus {
    DRAFT
    PUBLISHED
    ARCHIVED
  }

  type Course {
    _id: ID!
    title: String!
    slug: String
    description: String
    courseCode: String
    difficulty: Difficulty
    thumbnail: String
    price: Price
    pricingDetails: PricingDetails
    sectionId: [Section]
    categories: [String]
    tags: [String]
    status: CourseStatus
    whatYouWillLearn: [String]
    whyChooseOurCourse: [WhyChoose]
  }

  type PricingDetails {
    planTitle: String
    description: String
    price: String
    details: [String]
  }

  type Price {
    amount: Float
    currency: Currency
    discount: Float
  }

  type WhyChoose {
    icon: String
    title: String
    description: String
  }

  type Query {
    getCourseById(_id: ID!): Course
    getCourseBySlug(slug: String!): Course
    getAllCourse: [Course!]!
    getEnrolledCourseContentBySlug(slug: String!): Course
    getCourseIdBySlug(slug: String): Course
  }

  input PriceInput {
    amount: Float
    currency: Currency
    discount: Float
  }

  input PricingDetailsInput {
    planTitle: String
    description: String
    price: String
    details: [String]
  }

  input WhyChooseInput {
    icon: String
    title: String
    description: String
  }

  input CreateCourseInput {
    title: String
  }

  input UpdateCourseInput {
    _id: ID!
    title: String
    description: String
    price: PriceInput
    difficulty: Difficulty
    thumbnail: String
    pricingDetails: PricingDetailsInput
    categories: [String]
    tags: [String]
    status: CourseStatus
    whatYouWillLearn: [String]
    whyChooseOurCourse: [WhyChooseInput]
  }

  type Mutation {
    createCourse(input: CreateCourseInput!): Course!
    updateCourse(input: UpdateCourseInput!): Course!
    deleteCourse(id: ID!): Boolean!
  }
`;
