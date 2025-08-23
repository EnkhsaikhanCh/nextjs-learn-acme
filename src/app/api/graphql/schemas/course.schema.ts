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

  type Course {
    _id: ID!
    createdBy: InstructorUserV2
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

  type Thumbnail {
    publicId: String!
    width: Int
    height: Int
    format: String
  }

  type PricingPlan {
    planTitle: String
    description: [String]
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
    getUserEnrolledCoursesCount(
      userId: ID!
    ): GetUserEnrolledCoursesCountResponse!
    getAllNotEnrolledCourses: CoursesQueryResponse
    getAllCoursesByInstructurId: [Course]
    getCoursePreviewData(slug: String!): getCoursePreviewDataResponse
    getCourseForEnrollment(slug: String!): CourseForEnrollmentResponse

    # Instructor queries
    instructorCourseOverview(slug: String!): instructorCourseOverview!
  }

  type instructorCourseOverview {
    course: Course
    totalSections: Int
    totalLessons: Int
    totalEnrollment: Int
    completionPercent: Int
  }

  type CoursesQueryResponse {
    success: Boolean!
    message: String
    courses: [Course]
  }

  type CourseForEnrollmentResponse {
    success: Boolean!
    message: String
    fullContent: Course
  }

  type getCoursePreviewDataResponse {
    success: Boolean!
    message: String
    course: Course
    totalSections: Int
    totalLessons: Int
    totalLessonDurationSeconds: Int
    totalLessonDurationHours: Int
    isEnrolled: Boolean
  }

  input CreateCourseInput {
    title: String
  }

  input PricingPlanInput {
    planTitle: String
    description: [String]
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
    description: [String]
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

    # V2
    updateCoursePricingV2(
      courseId: ID!
      input: UpdateCoursePricingInput!
    ): UpdateCourseResponse!
  }

  # --- Mutation Response ---
  type UpdateCourseResponse {
    success: Boolean!
    message: String!
  }
`;
