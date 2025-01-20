import gql from "graphql-tag";

export const typeDefs = gql`
  type Section {
    _id: ID!
    courseId: Course!
    title: String!
    description: String
    order: Int!
    lessonId: [Lesson]
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getSections(courseId: ID!): [Section!]!
    getSectionById(id: ID!): Section!
  }

  type Mutation {
    createSection(input: CreateSectionInput): Section
    updateSection(id: ID!, input: UpdateSectionInput!): Section!
    deleteSection(id: ID!): Boolean!
  }

  input CreateSectionInput {
    courseId: ID!
    title: String!
    description: String
    order: Int
  }

  input UpdateSectionInput {
    title: String
    description: String
    order: Int
  }
`;

export type CreateSectionInput = {
  courseId: string;
  title: string;
  description: string;
  order: number;
};
