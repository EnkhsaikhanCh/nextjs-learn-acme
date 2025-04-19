import gql from "graphql-tag";

export const typeDefs = gql`
  type Section {
    _id: ID!
    courseId: Course
    title: String
    description: String
    order: Int
    lessonId: [LessonV2]
    createdAt: String
    updatedAt: String
  }

  input CreateSectionInput {
    courseId: ID!
    title: String!
  }

  input UpdateSectionInput {
    title: String
    description: String
  }

  type CreateSectionResponse {
    success: Boolean!
    message: String!
  }

  type UpdateSectionResponse {
    success: Boolean!
    message: String!
  }

  type DeleteSectionResponse {
    success: Boolean!
    message: String
  }

  type Mutation {
    createSection(input: CreateSectionInput): CreateSectionResponse!
    updateSection(_id: ID!, input: UpdateSectionInput!): UpdateSectionResponse!
    deleteSection(_id: ID!): DeleteSectionResponse!
  }
`;
