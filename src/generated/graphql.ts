import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type ChangePasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type ChangePasswordResponse = {
  __typename?: 'ChangePasswordResponse';
  message: Scalars['String']['output'];
};

export type EncryptedResponse = {
  __typename?: 'EncryptedResponse';
  authTag: Scalars['String']['output'];
  encryptedData: Scalars['String']['output'];
  iv: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: ChangePasswordResponse;
  createTest: Test;
  createUser: RegisterResponse;
  decryptData: Scalars['String']['output'];
  deleteTest: Test;
  deleteUser: User;
  encryptData: EncryptedResponse;
  updateTest: Test;
  updateUser: User;
};


export type MutationChangePasswordArgs = {
  _id: Scalars['ID']['input'];
  input?: InputMaybe<ChangePasswordInput>;
};


export type MutationCreateTestArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateUserArgs = {
  input: RegisterInput;
};


export type MutationDecryptDataArgs = {
  authTag: Scalars['String']['input'];
  encryptedData: Scalars['String']['input'];
  iv: Scalars['String']['input'];
};


export type MutationDeleteTestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationEncryptDataArgs = {
  data: Scalars['String']['input'];
};


export type MutationUpdateTestArgs = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  _id: Scalars['ID']['input'];
  input: UpdateInput;
};

export type Query = {
  __typename?: 'Query';
  getAllTest: Array<Test>;
  getAllUser: Array<User>;
  getUserById: User;
};


export type QueryGetUserByIdArgs = {
  id: Scalars['ID']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type RegisterResponse = {
  __typename?: 'RegisterResponse';
  message: Scalars['String']['output'];
  token?: Maybe<Scalars['String']['output']>;
};

export type Test = {
  __typename?: 'Test';
  _id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type UpdateInput = {
  email?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  email: Scalars['String']['output'];
  password: Scalars['String']['output'];
  role: Scalars['String']['output'];
  studentId: Scalars['String']['output'];
};

export type GetAllTestQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTestQuery = { __typename?: 'Query', getAllTest: Array<{ __typename?: 'Test', _id: string, name: string }> };

export type CreateTestMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateTestMutation = { __typename?: 'Mutation', createTest: { __typename?: 'Test', _id: string, name: string } };

export type DeleteTestMutationVariables = Exact<{
  deleteTestId: Scalars['ID']['input'];
}>;


export type DeleteTestMutation = { __typename?: 'Mutation', deleteTest: { __typename?: 'Test', _id: string, name: string } };

export type UpdateTestMutationVariables = Exact<{
  updateTestId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
}>;


export type UpdateTestMutation = { __typename?: 'Mutation', updateTest: { __typename?: 'Test', _id: string, name: string } };

export type CreateUserMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'RegisterResponse', message: string, token?: string | null } };


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
export function useGetAllTestQuery(baseOptions?: Apollo.QueryHookOptions<GetAllTestQuery, GetAllTestQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllTestQuery, GetAllTestQueryVariables>(GetAllTestDocument, options);
      }
export function useGetAllTestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllTestQuery, GetAllTestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllTestQuery, GetAllTestQueryVariables>(GetAllTestDocument, options);
        }
export function useGetAllTestSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllTestQuery, GetAllTestQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllTestQuery, GetAllTestQueryVariables>(GetAllTestDocument, options);
        }
export type GetAllTestQueryHookResult = ReturnType<typeof useGetAllTestQuery>;
export type GetAllTestLazyQueryHookResult = ReturnType<typeof useGetAllTestLazyQuery>;
export type GetAllTestSuspenseQueryHookResult = ReturnType<typeof useGetAllTestSuspenseQuery>;
export type GetAllTestQueryResult = Apollo.QueryResult<GetAllTestQuery, GetAllTestQueryVariables>;
export const CreateTestDocument = gql`
    mutation CreateTest($name: String!) {
  createTest(name: $name) {
    _id
    name
  }
}
    `;
export type CreateTestMutationFn = Apollo.MutationFunction<CreateTestMutation, CreateTestMutationVariables>;

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
export function useCreateTestMutation(baseOptions?: Apollo.MutationHookOptions<CreateTestMutation, CreateTestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTestMutation, CreateTestMutationVariables>(CreateTestDocument, options);
      }
export type CreateTestMutationHookResult = ReturnType<typeof useCreateTestMutation>;
export type CreateTestMutationResult = Apollo.MutationResult<CreateTestMutation>;
export type CreateTestMutationOptions = Apollo.BaseMutationOptions<CreateTestMutation, CreateTestMutationVariables>;
export const DeleteTestDocument = gql`
    mutation DeleteTest($deleteTestId: ID!) {
  deleteTest(id: $deleteTestId) {
    _id
    name
  }
}
    `;
export type DeleteTestMutationFn = Apollo.MutationFunction<DeleteTestMutation, DeleteTestMutationVariables>;

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
export function useDeleteTestMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTestMutation, DeleteTestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTestMutation, DeleteTestMutationVariables>(DeleteTestDocument, options);
      }
export type DeleteTestMutationHookResult = ReturnType<typeof useDeleteTestMutation>;
export type DeleteTestMutationResult = Apollo.MutationResult<DeleteTestMutation>;
export type DeleteTestMutationOptions = Apollo.BaseMutationOptions<DeleteTestMutation, DeleteTestMutationVariables>;
export const UpdateTestDocument = gql`
    mutation updateTest($updateTestId: ID!, $name: String!) {
  updateTest(id: $updateTestId, name: $name) {
    _id
    name
  }
}
    `;
export type UpdateTestMutationFn = Apollo.MutationFunction<UpdateTestMutation, UpdateTestMutationVariables>;

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
export function useUpdateTestMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTestMutation, UpdateTestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTestMutation, UpdateTestMutationVariables>(UpdateTestDocument, options);
      }
export type UpdateTestMutationHookResult = ReturnType<typeof useUpdateTestMutation>;
export type UpdateTestMutationResult = Apollo.MutationResult<UpdateTestMutation>;
export type UpdateTestMutationOptions = Apollo.BaseMutationOptions<UpdateTestMutation, UpdateTestMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($input: RegisterInput!) {
  createUser(input: $input) {
    message
    token
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

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
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;