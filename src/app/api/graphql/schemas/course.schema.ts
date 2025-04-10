// src/app/api/graphql/schemas/course.schema.ts
import gql from "graphql-tag";

export const typeDefs = gql`
  enum Currency {
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

  """
  Хэрэглэгч курсэд нэвтэрсэн байдал болон бусад төлөв:
  GUEST         - Одоогоор нэвтрээгүй буюу бүртгэлгүй
  NOT_ENROLLED  - Нэвтэрсэн боловч курсэд бүртгэлгүй (эсвэл хугацаа дууссан)
  ENROLLED      - Курсэд бүрэн эрхтэй
  EXPIRED       - Бүртгэл байсан ч хугацаа дууссан
  """
  enum CourseAccessStatus {
    ADMIN_ENROLLED
    ADMIN_NOT_ENROLLED
    GUEST
    NOT_ENROLLED
    ENROLLED
    EXPIRED
  }

  """
  Нэг Query-д буцах нэгдсэн бүтэц
    - status: Хэрэглэгчийн төлөв
    - coursePreviewData: Хэрэв GUEST эсвэл NOT_ENROLLED бол үзүүлэх 'preview' талын мэдээлэл
    - fullContent: Хэрэв ENROLLED бол үзүүлэх курсийн бүрэн агуулга
  """
  type CourseForUserPayload {
    status: CourseAccessStatus!
    coursePreviewData: Course
    fullContent: Course
  }

  type Course {
    _id: ID!
    createdBy: User!
    title: String!
    slug: String
    description: String
    courseCode: String
    difficulty: Difficulty
    thumbnail: String
    price: PricingPlan
    sectionId: [Section]
    categories: [String]
    tags: [String]
    status: CourseStatus
    whatYouWillLearn: [String]
    isEnrolled: Boolean
  }

  type PricingPlan {
    planTitle: String
    description: String
    amount: Int
    currency: Currency
  }

  type GetUserEnrolledCoursesCountResponse {
    totalCourses: Int!
    completedCount: Int!
    inProgressCount: Int!
    courseCompletionPercentage: Float!
  }

  type Query {
    getCourseById(_id: ID!): Course
    getCourseBySlug(slug: String!): Course
    getCourseDetails(slug: String!): Course
    getAllCourse: [Course!]!
    getAllCourseWithEnrollment: [Course!]!
    getEnrolledCourseContentBySlug(slug: String!): Course
    getCourseIdBySlug(slug: String): Course
    getCourseForUser(slug: String!): CourseForUserPayload!
    getUserEnrolledCoursesCount(
      userId: ID!
    ): GetUserEnrolledCoursesCountResponse!
    getUserNotEnrolledCourses(userId: ID!): [Course]
  }

  input CreateCourseInput {
    createdBy: String
    title: String
  }

  input PricingPlanInput {
    planTitle: String!
    description: String
    amount: Int!
    currency: Currency!
  }

  input UpdateCourseInput {
    _id: ID!
    title: String
    description: String
    slug: String
    courseCode: String
    difficulty: Difficulty
    thumbnail: String
    price: PricingPlanInput
    categories: [String]
    tags: [String]
    status: CourseStatus
    whatYouWillLearn: [String]
  }

  type Mutation {
    createCourse(input: CreateCourseInput!): Course!
    updateCourse(input: UpdateCourseInput!): Course!
    deleteCourse(id: ID!): Boolean!
  }
`;
