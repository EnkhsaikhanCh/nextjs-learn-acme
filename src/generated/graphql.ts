import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type Course = {
  __typename?: "Course";
  _id: Scalars["ID"]["output"];
  categories?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  createdBy?: Maybe<Scalars["String"]["output"]>;
  description: Scalars["String"]["output"];
  duration?: Maybe<Scalars["Int"]["output"]>;
  enrollmentId?: Maybe<Array<Maybe<Enrollment>>>;
  price: Scalars["Float"]["output"];
  sectionId?: Maybe<Array<Maybe<Section>>>;
  status?: Maybe<CourseStatus>;
  tags?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  thumbnail?: Maybe<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
};

export enum CourseStatus {
  Active = "active",
  Archived = "archived",
}

export type CreateCourseInput = {
  description: Scalars["String"]["input"];
  price: Scalars["Float"]["input"];
  title: Scalars["String"]["input"];
};

export type CreateEnrollmentInput = {
  courseId: Scalars["ID"]["input"];
  userId: Scalars["ID"]["input"];
};

export type CreateLessonInput = {
  sectionId: Scalars["ID"]["input"];
  title: Scalars["String"]["input"];
};

export type CreateSectionInput = {
  courseId: Scalars["ID"]["input"];
  title: Scalars["String"]["input"];
};

export type DeleteLessonReponse = {
  __typename?: "DeleteLessonReponse";
  message?: Maybe<Scalars["String"]["output"]>;
  success: Scalars["Boolean"]["output"];
};

export type DeleteSectionResponse = {
  __typename?: "DeleteSectionResponse";
  message?: Maybe<Scalars["String"]["output"]>;
  success: Scalars["Boolean"]["output"];
};

export type Enrollment = {
  __typename?: "Enrollment";
  _id: Scalars["ID"]["output"];
  courseId: Course;
  createdAt: Scalars["String"]["output"];
  history?: Maybe<Array<EnrollmentHistory>>;
  isCompleted: Scalars["Boolean"]["output"];
  isDeleted: Scalars["Boolean"]["output"];
  lastAccessedAt?: Maybe<Scalars["String"]["output"]>;
  progress: Scalars["Float"]["output"];
  status: EnrollmentStatus;
  updatedAt: Scalars["String"]["output"];
  userId?: Maybe<User>;
};

export type EnrollmentHistory = {
  __typename?: "EnrollmentHistory";
  progress: Scalars["Float"]["output"];
  status: EnrollmentStatus;
  updatedAt: Scalars["String"]["output"];
};

export enum EnrollmentStatus {
  Active = "ACTIVE",
  Cancelled = "CANCELLED",
  Completed = "COMPLETED",
  Pending = "PENDING",
}

export type Lesson = {
  __typename?: "Lesson";
  _id: Scalars["ID"]["output"];
  content?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["String"]["output"];
  isPublished: Scalars["Boolean"]["output"];
  order: Scalars["Int"]["output"];
  sectionId: Section;
  title: Scalars["String"]["output"];
  updatedAt: Scalars["String"]["output"];
  videoUrl?: Maybe<Scalars["String"]["output"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  createCourse: Course;
  createEnrollment?: Maybe<Enrollment>;
  createLesson: Lesson;
  createSection?: Maybe<Section>;
  createTest: Test;
  createUser: RegisterResponse;
  deleteCourse: Scalars["Boolean"]["output"];
  deleteLesson: DeleteLessonReponse;
  deleteSection: DeleteSectionResponse;
  deleteTest: Test;
  deleteUser: User;
  updateCourse: Course;
  updateEnrollment?: Maybe<Enrollment>;
  updateLesson: Lesson;
  updateSection: Section;
  updateTest: Test;
  updateUser: User;
};

export type MutationCreateCourseArgs = {
  input: CreateCourseInput;
};

export type MutationCreateEnrollmentArgs = {
  input?: InputMaybe<CreateEnrollmentInput>;
};

export type MutationCreateLessonArgs = {
  input: CreateLessonInput;
};

export type MutationCreateSectionArgs = {
  input?: InputMaybe<CreateSectionInput>;
};

export type MutationCreateTestArgs = {
  name: Scalars["String"]["input"];
};

export type MutationCreateUserArgs = {
  input: RegisterInput;
};

export type MutationDeleteCourseArgs = {
  _id: Scalars["ID"]["input"];
};

export type MutationDeleteLessonArgs = {
  _id: Scalars["ID"]["input"];
};

export type MutationDeleteSectionArgs = {
  _id: Scalars["ID"]["input"];
};

export type MutationDeleteTestArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationDeleteUserArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationUpdateCourseArgs = {
  input: UpdateCourseInput;
};

export type MutationUpdateEnrollmentArgs = {
  input?: InputMaybe<UpdateEnrollmentInput>;
};

export type MutationUpdateLessonArgs = {
  _id: Scalars["ID"]["input"];
  input: UpdateLessonInput;
};

export type MutationUpdateSectionArgs = {
  _id: Scalars["ID"]["input"];
  input: UpdateSectionInput;
};

export type MutationUpdateTestArgs = {
  id: Scalars["ID"]["input"];
  name: Scalars["String"]["input"];
};

export type MutationUpdateUserArgs = {
  _id: Scalars["ID"]["input"];
  input: UpdateInput;
};

export type Query = {
  __typename?: "Query";
  getAllCourse: Array<Course>;
  getAllTest: Array<Test>;
  getAllUser: Array<User>;
  getCourseById?: Maybe<Course>;
  getEnrollmentsByCourse: Array<Enrollment>;
  getEnrollmentsByUser: Array<Enrollment>;
  getLessonById: Lesson;
  getLessonsBySection: Array<Lesson>;
  getSectionById: Section;
  getSections: Array<Section>;
  getUserById: User;
};

export type QueryGetCourseByIdArgs = {
  _id: Scalars["ID"]["input"];
};

export type QueryGetEnrollmentsByCourseArgs = {
  courseId: Scalars["ID"]["input"];
};

export type QueryGetEnrollmentsByUserArgs = {
  userId: Scalars["ID"]["input"];
};

export type QueryGetLessonByIdArgs = {
  _id: Scalars["ID"]["input"];
};

export type QueryGetLessonsBySectionArgs = {
  sectionId: Scalars["ID"]["input"];
};

export type QueryGetSectionByIdArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryGetSectionsArgs = {
  courseId: Scalars["ID"]["input"];
};

export type QueryGetUserByIdArgs = {
  _id: Scalars["ID"]["input"];
};

export type RegisterInput = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type RegisterResponse = {
  __typename?: "RegisterResponse";
  message: Scalars["String"]["output"];
  user: User;
};

export type Section = {
  __typename?: "Section";
  _id: Scalars["ID"]["output"];
  courseId: Course;
  createdAt: Scalars["String"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  lessonId?: Maybe<Array<Maybe<Lesson>>>;
  order: Scalars["Int"]["output"];
  title: Scalars["String"]["output"];
  updatedAt: Scalars["String"]["output"];
};

export type Test = {
  __typename?: "Test";
  _id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
};

export type UpdateCourseInput = {
  _id: Scalars["ID"]["input"];
  categories?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  createdBy?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  duration?: InputMaybe<Scalars["Int"]["input"]>;
  price?: InputMaybe<Scalars["Float"]["input"]>;
  status?: InputMaybe<CourseStatus>;
  tags?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  thumbnail?: InputMaybe<Scalars["String"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateEnrollmentInput = {
  _id: Scalars["ID"]["input"];
  progress?: InputMaybe<Scalars["Float"]["input"]>;
  status?: InputMaybe<EnrollmentStatus>;
};

export type UpdateInput = {
  email?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateLessonInput = {
  content?: InputMaybe<Scalars["String"]["input"]>;
  isPublished?: InputMaybe<Scalars["Boolean"]["input"]>;
  order?: InputMaybe<Scalars["Int"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  videoUrl?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateSectionInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  order?: InputMaybe<Scalars["Int"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type User = {
  __typename?: "User";
  _id: Scalars["ID"]["output"];
  email: Scalars["String"]["output"];
  isVerified: Scalars["String"]["output"];
  role: Scalars["String"]["output"];
  studentId: Scalars["String"]["output"];
};

export type CreateCourseMutationVariables = Exact<{
  input: CreateCourseInput;
}>;

export type CreateCourseMutation = {
  __typename?: "Mutation";
  createCourse: { __typename?: "Course"; _id: string };
};

export type UpdateCourseMutationVariables = Exact<{
  input: UpdateCourseInput;
}>;

export type UpdateCourseMutation = {
  __typename?: "Mutation";
  updateCourse: {
    __typename?: "Course";
    _id: string;
    title: string;
    description: string;
    price: number;
    status?: CourseStatus | null;
    thumbnail?: string | null;
  };
};

export type GetAllCourseQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllCourseQuery = {
  __typename?: "Query";
  getAllCourse: Array<{
    __typename?: "Course";
    _id: string;
    title: string;
    description: string;
    price: number;
    duration?: number | null;
    categories?: Array<string | null> | null;
    tags?: Array<string | null> | null;
    status?: CourseStatus | null;
    thumbnail?: string | null;
    enrollmentId?: Array<{
      __typename?: "Enrollment";
      _id: string;
    } | null> | null;
  }>;
};

export type GetCourseByIdQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GetCourseByIdQuery = {
  __typename?: "Query";
  getCourseById?: {
    __typename?: "Course";
    _id: string;
    title: string;
    description: string;
    price: number;
    duration?: number | null;
    createdBy?: string | null;
    categories?: Array<string | null> | null;
    tags?: Array<string | null> | null;
    status?: CourseStatus | null;
    thumbnail?: string | null;
    sectionId?: Array<{
      __typename?: "Section";
      _id: string;
      title: string;
      lessonId?: Array<{
        __typename?: "Lesson";
        _id: string;
        title: string;
        isPublished: boolean;
      } | null> | null;
    } | null> | null;
    enrollmentId?: Array<{
      __typename?: "Enrollment";
      _id: string;
      userId?: { __typename?: "User"; _id: string; email: string } | null;
    } | null> | null;
  } | null;
};

export type CreateLessonMutationVariables = Exact<{
  input: CreateLessonInput;
}>;

export type CreateLessonMutation = {
  __typename?: "Mutation";
  createLesson: { __typename?: "Lesson"; _id: string };
};

export type UpdateLessonMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  input: UpdateLessonInput;
}>;

export type UpdateLessonMutation = {
  __typename?: "Mutation";
  updateLesson: { __typename?: "Lesson"; _id: string };
};

export type DeleteLessonMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type DeleteLessonMutation = {
  __typename?: "Mutation";
  deleteLesson: {
    __typename?: "DeleteLessonReponse";
    success: boolean;
    message?: string | null;
  };
};

export type GetLessonByIdQueryVariables = Exact<{
  getLessonByIdId: Scalars["ID"]["input"];
}>;

export type GetLessonByIdQuery = {
  __typename?: "Query";
  getLessonById: {
    __typename?: "Lesson";
    _id: string;
    title: string;
    content?: string | null;
    videoUrl?: string | null;
    order: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type CreateSectionMutationVariables = Exact<{
  input?: InputMaybe<CreateSectionInput>;
}>;

export type CreateSectionMutation = {
  __typename?: "Mutation";
  createSection?: { __typename?: "Section"; _id: string } | null;
};

export type UpdateSectionMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  input: UpdateSectionInput;
}>;

export type UpdateSectionMutation = {
  __typename?: "Mutation";
  updateSection: { __typename?: "Section"; _id: string };
};

export type DeleteSectionMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type DeleteSectionMutation = {
  __typename?: "Mutation";
  deleteSection: {
    __typename?: "DeleteSectionResponse";
    success: boolean;
    message?: string | null;
  };
};

export type GetAllTestQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllTestQuery = {
  __typename?: "Query";
  getAllTest: Array<{ __typename?: "Test"; _id: string; name: string }>;
};

export type CreateTestMutationVariables = Exact<{
  name: Scalars["String"]["input"];
}>;

export type CreateTestMutation = {
  __typename?: "Mutation";
  createTest: { __typename?: "Test"; _id: string; name: string };
};

export type DeleteTestMutationVariables = Exact<{
  deleteTestId: Scalars["ID"]["input"];
}>;

export type DeleteTestMutation = {
  __typename?: "Mutation";
  deleteTest: { __typename?: "Test"; _id: string; name: string };
};

export type UpdateTestMutationVariables = Exact<{
  updateTestId: Scalars["ID"]["input"];
  name: Scalars["String"]["input"];
}>;

export type UpdateTestMutation = {
  __typename?: "Mutation";
  updateTest: { __typename?: "Test"; _id: string; name: string };
};

export type CreateUserMutationVariables = Exact<{
  input: RegisterInput;
}>;

export type CreateUserMutation = {
  __typename?: "Mutation";
  createUser: {
    __typename?: "RegisterResponse";
    message: string;
    user: {
      __typename?: "User";
      _id: string;
      email: string;
      studentId: string;
      role: string;
      isVerified: string;
    };
  };
};

export type GetAllUserQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllUserQuery = {
  __typename?: "Query";
  getAllUser: Array<{
    __typename?: "User";
    _id: string;
    email: string;
    studentId: string;
    role: string;
    isVerified: string;
  }>;
};

export type GetUserByIdQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GetUserByIdQuery = {
  __typename?: "Query";
  getUserById: {
    __typename?: "User";
    _id: string;
    email: string;
    studentId: string;
    role: string;
    isVerified: string;
  };
};

export const CreateCourseDocument = gql`
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
      _id
    }
  }
`;
export type CreateCourseMutationFn = Apollo.MutationFunction<
  CreateCourseMutation,
  CreateCourseMutationVariables
>;

/**
 * __useCreateCourseMutation__
 *
 * To run a mutation, you first call `useCreateCourseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCourseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCourseMutation, { data, loading, error }] = useCreateCourseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCourseMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateCourseMutation,
    CreateCourseMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateCourseMutation,
    CreateCourseMutationVariables
  >(CreateCourseDocument, options);
}
export type CreateCourseMutationHookResult = ReturnType<
  typeof useCreateCourseMutation
>;
export type CreateCourseMutationResult =
  Apollo.MutationResult<CreateCourseMutation>;
export type CreateCourseMutationOptions = Apollo.BaseMutationOptions<
  CreateCourseMutation,
  CreateCourseMutationVariables
>;
export const UpdateCourseDocument = gql`
  mutation UpdateCourse($input: UpdateCourseInput!) {
    updateCourse(input: $input) {
      _id
      title
      description
      price
      status
      thumbnail
    }
  }
`;
export type UpdateCourseMutationFn = Apollo.MutationFunction<
  UpdateCourseMutation,
  UpdateCourseMutationVariables
>;

/**
 * __useUpdateCourseMutation__
 *
 * To run a mutation, you first call `useUpdateCourseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCourseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCourseMutation, { data, loading, error }] = useUpdateCourseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCourseMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCourseMutation,
    UpdateCourseMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateCourseMutation,
    UpdateCourseMutationVariables
  >(UpdateCourseDocument, options);
}
export type UpdateCourseMutationHookResult = ReturnType<
  typeof useUpdateCourseMutation
>;
export type UpdateCourseMutationResult =
  Apollo.MutationResult<UpdateCourseMutation>;
export type UpdateCourseMutationOptions = Apollo.BaseMutationOptions<
  UpdateCourseMutation,
  UpdateCourseMutationVariables
>;
export const GetAllCourseDocument = gql`
  query GetAllCourse {
    getAllCourse {
      _id
      title
      description
      price
      duration
      categories
      tags
      status
      enrollmentId {
        _id
      }
      thumbnail
    }
  }
`;

/**
 * __useGetAllCourseQuery__
 *
 * To run a query within a React component, call `useGetAllCourseQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllCourseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllCourseQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllCourseQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetAllCourseQuery,
    GetAllCourseQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAllCourseQuery, GetAllCourseQueryVariables>(
    GetAllCourseDocument,
    options,
  );
}
export function useGetAllCourseLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAllCourseQuery,
    GetAllCourseQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAllCourseQuery, GetAllCourseQueryVariables>(
    GetAllCourseDocument,
    options,
  );
}
export function useGetAllCourseSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetAllCourseQuery,
        GetAllCourseQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetAllCourseQuery, GetAllCourseQueryVariables>(
    GetAllCourseDocument,
    options,
  );
}
export type GetAllCourseQueryHookResult = ReturnType<
  typeof useGetAllCourseQuery
>;
export type GetAllCourseLazyQueryHookResult = ReturnType<
  typeof useGetAllCourseLazyQuery
>;
export type GetAllCourseSuspenseQueryHookResult = ReturnType<
  typeof useGetAllCourseSuspenseQuery
>;
export type GetAllCourseQueryResult = Apollo.QueryResult<
  GetAllCourseQuery,
  GetAllCourseQueryVariables
>;
export const GetCourseByIdDocument = gql`
  query GetCourseById($id: ID!) {
    getCourseById(_id: $id) {
      _id
      title
      description
      price
      sectionId {
        _id
        title
        lessonId {
          _id
          title
          isPublished
        }
      }
      duration
      createdBy
      categories
      tags
      status
      enrollmentId {
        _id
        userId {
          _id
          email
        }
      }
      thumbnail
    }
  }
`;

/**
 * __useGetCourseByIdQuery__
 *
 * To run a query within a React component, call `useGetCourseByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCourseByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCourseByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCourseByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetCourseByIdQuery,
    GetCourseByIdQueryVariables
  > &
    (
      | { variables: GetCourseByIdQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetCourseByIdQuery, GetCourseByIdQueryVariables>(
    GetCourseByIdDocument,
    options,
  );
}
export function useGetCourseByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCourseByIdQuery,
    GetCourseByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetCourseByIdQuery, GetCourseByIdQueryVariables>(
    GetCourseByIdDocument,
    options,
  );
}
export function useGetCourseByIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetCourseByIdQuery,
        GetCourseByIdQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetCourseByIdQuery,
    GetCourseByIdQueryVariables
  >(GetCourseByIdDocument, options);
}
export type GetCourseByIdQueryHookResult = ReturnType<
  typeof useGetCourseByIdQuery
>;
export type GetCourseByIdLazyQueryHookResult = ReturnType<
  typeof useGetCourseByIdLazyQuery
>;
export type GetCourseByIdSuspenseQueryHookResult = ReturnType<
  typeof useGetCourseByIdSuspenseQuery
>;
export type GetCourseByIdQueryResult = Apollo.QueryResult<
  GetCourseByIdQuery,
  GetCourseByIdQueryVariables
>;
export const CreateLessonDocument = gql`
  mutation CreateLesson($input: CreateLessonInput!) {
    createLesson(input: $input) {
      _id
    }
  }
`;
export type CreateLessonMutationFn = Apollo.MutationFunction<
  CreateLessonMutation,
  CreateLessonMutationVariables
>;

/**
 * __useCreateLessonMutation__
 *
 * To run a mutation, you first call `useCreateLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLessonMutation, { data, loading, error }] = useCreateLessonMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateLessonMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateLessonMutation,
    CreateLessonMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateLessonMutation,
    CreateLessonMutationVariables
  >(CreateLessonDocument, options);
}
export type CreateLessonMutationHookResult = ReturnType<
  typeof useCreateLessonMutation
>;
export type CreateLessonMutationResult =
  Apollo.MutationResult<CreateLessonMutation>;
export type CreateLessonMutationOptions = Apollo.BaseMutationOptions<
  CreateLessonMutation,
  CreateLessonMutationVariables
>;
export const UpdateLessonDocument = gql`
  mutation UpdateLesson($id: ID!, $input: UpdateLessonInput!) {
    updateLesson(_id: $id, input: $input) {
      _id
    }
  }
`;
export type UpdateLessonMutationFn = Apollo.MutationFunction<
  UpdateLessonMutation,
  UpdateLessonMutationVariables
>;

/**
 * __useUpdateLessonMutation__
 *
 * To run a mutation, you first call `useUpdateLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLessonMutation, { data, loading, error }] = useUpdateLessonMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateLessonMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateLessonMutation,
    UpdateLessonMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateLessonMutation,
    UpdateLessonMutationVariables
  >(UpdateLessonDocument, options);
}
export type UpdateLessonMutationHookResult = ReturnType<
  typeof useUpdateLessonMutation
>;
export type UpdateLessonMutationResult =
  Apollo.MutationResult<UpdateLessonMutation>;
export type UpdateLessonMutationOptions = Apollo.BaseMutationOptions<
  UpdateLessonMutation,
  UpdateLessonMutationVariables
>;
export const DeleteLessonDocument = gql`
  mutation DeleteLesson($id: ID!) {
    deleteLesson(_id: $id) {
      success
      message
    }
  }
`;
export type DeleteLessonMutationFn = Apollo.MutationFunction<
  DeleteLessonMutation,
  DeleteLessonMutationVariables
>;

/**
 * __useDeleteLessonMutation__
 *
 * To run a mutation, you first call `useDeleteLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLessonMutation, { data, loading, error }] = useDeleteLessonMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteLessonMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteLessonMutation,
    DeleteLessonMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    DeleteLessonMutation,
    DeleteLessonMutationVariables
  >(DeleteLessonDocument, options);
}
export type DeleteLessonMutationHookResult = ReturnType<
  typeof useDeleteLessonMutation
>;
export type DeleteLessonMutationResult =
  Apollo.MutationResult<DeleteLessonMutation>;
export type DeleteLessonMutationOptions = Apollo.BaseMutationOptions<
  DeleteLessonMutation,
  DeleteLessonMutationVariables
>;
export const GetLessonByIdDocument = gql`
  query GetLessonById($getLessonByIdId: ID!) {
    getLessonById(_id: $getLessonByIdId) {
      _id
      title
      content
      videoUrl
      order
      isPublished
      createdAt
      updatedAt
    }
  }
`;

/**
 * __useGetLessonByIdQuery__
 *
 * To run a query within a React component, call `useGetLessonByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLessonByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLessonByIdQuery({
 *   variables: {
 *      getLessonByIdId: // value for 'getLessonByIdId'
 *   },
 * });
 */
export function useGetLessonByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetLessonByIdQuery,
    GetLessonByIdQueryVariables
  > &
    (
      | { variables: GetLessonByIdQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetLessonByIdQuery, GetLessonByIdQueryVariables>(
    GetLessonByIdDocument,
    options,
  );
}
export function useGetLessonByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLessonByIdQuery,
    GetLessonByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetLessonByIdQuery, GetLessonByIdQueryVariables>(
    GetLessonByIdDocument,
    options,
  );
}
export function useGetLessonByIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetLessonByIdQuery,
        GetLessonByIdQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetLessonByIdQuery,
    GetLessonByIdQueryVariables
  >(GetLessonByIdDocument, options);
}
export type GetLessonByIdQueryHookResult = ReturnType<
  typeof useGetLessonByIdQuery
>;
export type GetLessonByIdLazyQueryHookResult = ReturnType<
  typeof useGetLessonByIdLazyQuery
>;
export type GetLessonByIdSuspenseQueryHookResult = ReturnType<
  typeof useGetLessonByIdSuspenseQuery
>;
export type GetLessonByIdQueryResult = Apollo.QueryResult<
  GetLessonByIdQuery,
  GetLessonByIdQueryVariables
>;
export const CreateSectionDocument = gql`
  mutation CreateSection($input: CreateSectionInput) {
    createSection(input: $input) {
      _id
    }
  }
`;
export type CreateSectionMutationFn = Apollo.MutationFunction<
  CreateSectionMutation,
  CreateSectionMutationVariables
>;

/**
 * __useCreateSectionMutation__
 *
 * To run a mutation, you first call `useCreateSectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSectionMutation, { data, loading, error }] = useCreateSectionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateSectionMutation,
    CreateSectionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateSectionMutation,
    CreateSectionMutationVariables
  >(CreateSectionDocument, options);
}
export type CreateSectionMutationHookResult = ReturnType<
  typeof useCreateSectionMutation
>;
export type CreateSectionMutationResult =
  Apollo.MutationResult<CreateSectionMutation>;
export type CreateSectionMutationOptions = Apollo.BaseMutationOptions<
  CreateSectionMutation,
  CreateSectionMutationVariables
>;
export const UpdateSectionDocument = gql`
  mutation UpdateSection($id: ID!, $input: UpdateSectionInput!) {
    updateSection(_id: $id, input: $input) {
      _id
    }
  }
`;
export type UpdateSectionMutationFn = Apollo.MutationFunction<
  UpdateSectionMutation,
  UpdateSectionMutationVariables
>;

/**
 * __useUpdateSectionMutation__
 *
 * To run a mutation, you first call `useUpdateSectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSectionMutation, { data, loading, error }] = useUpdateSectionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateSectionMutation,
    UpdateSectionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateSectionMutation,
    UpdateSectionMutationVariables
  >(UpdateSectionDocument, options);
}
export type UpdateSectionMutationHookResult = ReturnType<
  typeof useUpdateSectionMutation
>;
export type UpdateSectionMutationResult =
  Apollo.MutationResult<UpdateSectionMutation>;
export type UpdateSectionMutationOptions = Apollo.BaseMutationOptions<
  UpdateSectionMutation,
  UpdateSectionMutationVariables
>;
export const DeleteSectionDocument = gql`
  mutation DeleteSection($id: ID!) {
    deleteSection(_id: $id) {
      success
      message
    }
  }
`;
export type DeleteSectionMutationFn = Apollo.MutationFunction<
  DeleteSectionMutation,
  DeleteSectionMutationVariables
>;

/**
 * __useDeleteSectionMutation__
 *
 * To run a mutation, you first call `useDeleteSectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSectionMutation, { data, loading, error }] = useDeleteSectionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteSectionMutation,
    DeleteSectionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    DeleteSectionMutation,
    DeleteSectionMutationVariables
  >(DeleteSectionDocument, options);
}
export type DeleteSectionMutationHookResult = ReturnType<
  typeof useDeleteSectionMutation
>;
export type DeleteSectionMutationResult =
  Apollo.MutationResult<DeleteSectionMutation>;
export type DeleteSectionMutationOptions = Apollo.BaseMutationOptions<
  DeleteSectionMutation,
  DeleteSectionMutationVariables
>;
export const GetAllTestDocument = gql`
  query GetAllTest {
    getAllTest {
      _id
      name
    }
  }
`;

/**
 * __useGetAllTestQuery__
 *
 * To run a query within a React component, call `useGetAllTestQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllTestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllTestQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllTestQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetAllTestQuery,
    GetAllTestQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAllTestQuery, GetAllTestQueryVariables>(
    GetAllTestDocument,
    options,
  );
}
export function useGetAllTestLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAllTestQuery,
    GetAllTestQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAllTestQuery, GetAllTestQueryVariables>(
    GetAllTestDocument,
    options,
  );
}
export function useGetAllTestSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetAllTestQuery,
        GetAllTestQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetAllTestQuery, GetAllTestQueryVariables>(
    GetAllTestDocument,
    options,
  );
}
export type GetAllTestQueryHookResult = ReturnType<typeof useGetAllTestQuery>;
export type GetAllTestLazyQueryHookResult = ReturnType<
  typeof useGetAllTestLazyQuery
>;
export type GetAllTestSuspenseQueryHookResult = ReturnType<
  typeof useGetAllTestSuspenseQuery
>;
export type GetAllTestQueryResult = Apollo.QueryResult<
  GetAllTestQuery,
  GetAllTestQueryVariables
>;
export const CreateTestDocument = gql`
  mutation CreateTest($name: String!) {
    createTest(name: $name) {
      _id
      name
    }
  }
`;
export type CreateTestMutationFn = Apollo.MutationFunction<
  CreateTestMutation,
  CreateTestMutationVariables
>;

/**
 * __useCreateTestMutation__
 *
 * To run a mutation, you first call `useCreateTestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTestMutation, { data, loading, error }] = useCreateTestMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateTestMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateTestMutation,
    CreateTestMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateTestMutation, CreateTestMutationVariables>(
    CreateTestDocument,
    options,
  );
}
export type CreateTestMutationHookResult = ReturnType<
  typeof useCreateTestMutation
>;
export type CreateTestMutationResult =
  Apollo.MutationResult<CreateTestMutation>;
export type CreateTestMutationOptions = Apollo.BaseMutationOptions<
  CreateTestMutation,
  CreateTestMutationVariables
>;
export const DeleteTestDocument = gql`
  mutation DeleteTest($deleteTestId: ID!) {
    deleteTest(id: $deleteTestId) {
      _id
      name
    }
  }
`;
export type DeleteTestMutationFn = Apollo.MutationFunction<
  DeleteTestMutation,
  DeleteTestMutationVariables
>;

/**
 * __useDeleteTestMutation__
 *
 * To run a mutation, you first call `useDeleteTestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTestMutation, { data, loading, error }] = useDeleteTestMutation({
 *   variables: {
 *      deleteTestId: // value for 'deleteTestId'
 *   },
 * });
 */
export function useDeleteTestMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteTestMutation,
    DeleteTestMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteTestMutation, DeleteTestMutationVariables>(
    DeleteTestDocument,
    options,
  );
}
export type DeleteTestMutationHookResult = ReturnType<
  typeof useDeleteTestMutation
>;
export type DeleteTestMutationResult =
  Apollo.MutationResult<DeleteTestMutation>;
export type DeleteTestMutationOptions = Apollo.BaseMutationOptions<
  DeleteTestMutation,
  DeleteTestMutationVariables
>;
export const UpdateTestDocument = gql`
  mutation updateTest($updateTestId: ID!, $name: String!) {
    updateTest(id: $updateTestId, name: $name) {
      _id
      name
    }
  }
`;
export type UpdateTestMutationFn = Apollo.MutationFunction<
  UpdateTestMutation,
  UpdateTestMutationVariables
>;

/**
 * __useUpdateTestMutation__
 *
 * To run a mutation, you first call `useUpdateTestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTestMutation, { data, loading, error }] = useUpdateTestMutation({
 *   variables: {
 *      updateTestId: // value for 'updateTestId'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateTestMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateTestMutation,
    UpdateTestMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateTestMutation, UpdateTestMutationVariables>(
    UpdateTestDocument,
    options,
  );
}
export type UpdateTestMutationHookResult = ReturnType<
  typeof useUpdateTestMutation
>;
export type UpdateTestMutationResult =
  Apollo.MutationResult<UpdateTestMutation>;
export type UpdateTestMutationOptions = Apollo.BaseMutationOptions<
  UpdateTestMutation,
  UpdateTestMutationVariables
>;
export const CreateUserDocument = gql`
  mutation CreateUser($input: RegisterInput!) {
    createUser(input: $input) {
      message
      user {
        _id
        email
        studentId
        role
        isVerified
      }
    }
  }
`;
export type CreateUserMutationFn = Apollo.MutationFunction<
  CreateUserMutation,
  CreateUserMutationVariables
>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateUserMutation,
    CreateUserMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(
    CreateUserDocument,
    options,
  );
}
export type CreateUserMutationHookResult = ReturnType<
  typeof useCreateUserMutation
>;
export type CreateUserMutationResult =
  Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<
  CreateUserMutation,
  CreateUserMutationVariables
>;
export const GetAllUserDocument = gql`
  query GetAllUser {
    getAllUser {
      _id
      email
      studentId
      role
      isVerified
    }
  }
`;

/**
 * __useGetAllUserQuery__
 *
 * To run a query within a React component, call `useGetAllUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllUserQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetAllUserQuery,
    GetAllUserQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAllUserQuery, GetAllUserQueryVariables>(
    GetAllUserDocument,
    options,
  );
}
export function useGetAllUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAllUserQuery,
    GetAllUserQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAllUserQuery, GetAllUserQueryVariables>(
    GetAllUserDocument,
    options,
  );
}
export function useGetAllUserSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetAllUserQuery,
        GetAllUserQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetAllUserQuery, GetAllUserQueryVariables>(
    GetAllUserDocument,
    options,
  );
}
export type GetAllUserQueryHookResult = ReturnType<typeof useGetAllUserQuery>;
export type GetAllUserLazyQueryHookResult = ReturnType<
  typeof useGetAllUserLazyQuery
>;
export type GetAllUserSuspenseQueryHookResult = ReturnType<
  typeof useGetAllUserSuspenseQuery
>;
export type GetAllUserQueryResult = Apollo.QueryResult<
  GetAllUserQuery,
  GetAllUserQueryVariables
>;
export const GetUserByIdDocument = gql`
  query GetUserById($id: ID!) {
    getUserById(_id: $id) {
      _id
      email
      studentId
      role
      isVerified
    }
  }
`;

/**
 * __useGetUserByIdQuery__
 *
 * To run a query within a React component, call `useGetUserByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetUserByIdQuery,
    GetUserByIdQueryVariables
  > &
    (
      | { variables: GetUserByIdQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(
    GetUserByIdDocument,
    options,
  );
}
export function useGetUserByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetUserByIdQuery,
    GetUserByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(
    GetUserByIdDocument,
    options,
  );
}
export function useGetUserByIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetUserByIdQuery,
        GetUserByIdQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(
    GetUserByIdDocument,
    options,
  );
}
export type GetUserByIdQueryHookResult = ReturnType<typeof useGetUserByIdQuery>;
export type GetUserByIdLazyQueryHookResult = ReturnType<
  typeof useGetUserByIdLazyQuery
>;
export type GetUserByIdSuspenseQueryHookResult = ReturnType<
  typeof useGetUserByIdSuspenseQuery
>;
export type GetUserByIdQueryResult = Apollo.QueryResult<
  GetUserByIdQuery,
  GetUserByIdQueryVariables
>;
