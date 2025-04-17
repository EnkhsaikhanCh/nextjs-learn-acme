import gql from "graphql-tag";

export const typeDefs = gql`
  type Section {
    _id: ID!
    courseId: Course
    title: String
    description: String
    order: Int
    lessonId: [Lesson]
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
    order: Int
  }

  type DeleteSectionResponse {
    success: Boolean!
    message: String
  }

  type Mutation {
    createSection(input: CreateSectionInput): Section
    updateSection(_id: ID!, input: UpdateSectionInput!): Section!
    deleteSection(_id: ID!): DeleteSectionResponse!
  }
`;
