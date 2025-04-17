// src/app/api/graphql/schemas/course.schema.ts
import gql from "graphql-tag";

export const typeDefs = gql`
  scalar Date

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

  type Thumbnail {
    publicId: String!
    width: Int
    height: Int
    format: String
  }

  type Course {
    _id: ID!
    createdBy: User
    title: String!
    subtitle: String
    slug: String
    description: String
    requirements: String
    courseCode: String
    difficulty: Difficulty
    thumbnail: Thumbnail
    price: PricingPlan
    sectionId: [Section]
    category: String
    status: CourseStatus
    whatYouWillLearn: [String]
    whoIsThisFor: String
    isEnrolled: Boolean
    updatedAt: Date
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

  type getCourseDetailsForInstructorResponse {
    course: Course
    totalSections: Int
    totalLessons: Int
    totalEnrollment: Int
  }

  type Query {
    getCourseBasicInfoForEdit(slug: String!): Course
    getCourseDetailsForInstructor(
      slug: String!
    ): getCourseDetailsForInstructorResponse
    getAllCourse: [Course!]!
    getAllCourseWithEnrollment: [Course!]!
    getCourseForUser(slug: String!): CourseForUserPayload!
    getUserEnrolledCoursesCount(
      userId: ID!
    ): GetUserEnrolledCoursesCountResponse!
    getUserNotEnrolledCourses(userId: ID!): [Course]

    getAllCoursesByInstructurId: [Course]
  }

  input CreateCourseInput {
    title: String
  }

  input PricingPlanInput {
    planTitle: String
    description: String
    amount: Int
    currency: Currency
  }

  input CourseBasicInfoInput {
    title: String
    subtitle: String
    description: String
    requirements: String
    whoIsThisFor: String
    category: String
    difficulty: Difficulty
  }

  input UpdateCoursePricingInput {
    planTitle: String
    description: String
    amount: Int
    currency: Currency
  }

  input ThumbnailInput {
    publicId: String!
    width: Int
    height: Int
    format: String
  }

  input UpdateCourseVisibilityAndAccessInput {
    courseId: ID!
    status: CourseStatus!
  }

  input UpdateCourseWhatYouWillLearnInput {
    points: [String!]!
  }

  type Mutation {
    updateCourseBasicInfo(courseId: ID!, input: CourseBasicInfoInput!): Course!
    updateCoursePricing(
      courseId: ID!
      input: UpdateCoursePricingInput!
    ): Course!
    updateCourseThumbnail(courseId: ID!, input: ThumbnailInput!): Course!
    updateCourseVisibilityAndAccess(
      input: UpdateCourseVisibilityAndAccessInput!
    ): Course!
    updateCourseWhatYouWillLearn(
      courseId: ID!
      input: UpdateCourseWhatYouWillLearnInput!
    ): Course!
    createCourse(input: CreateCourseInput!): Course!
    deleteCourse(id: ID!): Boolean!
  }
`;
