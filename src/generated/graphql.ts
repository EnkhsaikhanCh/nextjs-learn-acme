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

export type Mutation = {
  __typename?: 'Mutation';
  createTest: Test;
  deleteTest: Test;
  updateTest: Test;
};


export type MutationCreateTestArgs = {
  name: Scalars['String']['input'];
};


export type MutationDeleteTestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateTestArgs = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  getAllTest: Array<Test>;
};

export type Test = {
  __typename?: 'Test';
  _id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type GetAllTestQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllTestQuery = { __typename?: 'Query', getAllTest: Array<{ __typename?: 'Test', _id: string, name: string }> };

export type CreateTestMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateTestMutation = { __typename?: 'Mutation', createTest: { __typename?: 'Test', _id: string, name: string } };


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