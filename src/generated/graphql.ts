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

export type Course = {
  __typename?: 'Course';
  _id: Scalars['ID']['output'];
  categories?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  courseCode?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  difficulty?: Maybe<Difficulty>;
  price?: Maybe<Price>;
  pricingDetails?: Maybe<PricingDetails>;
  sectionId?: Maybe<Array<Maybe<Section>>>;
  slug?: Maybe<Scalars['String']['output']>;
  status?: Maybe<CourseStatus>;
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  whatYouWillLearn?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  whyChooseOurCourse?: Maybe<Array<Maybe<WhyChoose>>>;
};

export enum CourseStatus {
  Archived = 'ARCHIVED',
  Draft = 'DRAFT',
  Published = 'PUBLISHED'
}

export type CreateCourseInput = {
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CreateEnrollmentInput = {
  courseId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateLessonInput = {
  sectionId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type CreatePaymentInput = {
  amount: Scalars['Float']['input'];
  courseId: Scalars['ID']['input'];
  paymentMethod: PaymentMethod;
  transactionNote?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};

export type CreateSectionInput = {
  courseId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export enum Currency {
  Mnt = 'MNT',
  Usd = 'USD'
}

export type DeleteLessonReponse = {
  __typename?: 'DeleteLessonReponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type DeleteSectionResponse = {
  __typename?: 'DeleteSectionResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export enum Difficulty {
  Advanced = 'ADVANCED',
  Beginner = 'BEGINNER',
  Intermediate = 'INTERMEDIATE'
}

export type Enrollment = {
  __typename?: 'Enrollment';
  _id: Scalars['ID']['output'];
  completedLessons?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  courseId?: Maybe<Course>;
  createdAt?: Maybe<Scalars['String']['output']>;
  expiryDate?: Maybe<Scalars['String']['output']>;
  history?: Maybe<Array<Maybe<EnrollmentHistory>>>;
  isCompleted?: Maybe<Scalars['Boolean']['output']>;
  isDeleted?: Maybe<Scalars['Boolean']['output']>;
  lastAccessedAt?: Maybe<Scalars['String']['output']>;
  progress?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<EnrollmentStatus>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<User>;
};

export type EnrollmentHistory = {
  __typename?: 'EnrollmentHistory';
  progress: Scalars['Float']['output'];
  status: EnrollmentStatus;
  updatedAt: Scalars['String']['output'];
};

export enum EnrollmentStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Expired = 'EXPIRED',
  Pending = 'PENDING'
}

export type Lesson = {
  __typename?: 'Lesson';
  _id: Scalars['ID']['output'];
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  isPublished: Scalars['Boolean']['output'];
  order: Scalars['Int']['output'];
  sectionId: Section;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  videoUrl?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createCourse: Course;
  createEnrollment?: Maybe<Enrollment>;
  createLesson: Lesson;
  createPayment?: Maybe<Payment>;
  createSection?: Maybe<Section>;
  createTest: Test;
  createUser: RegisterResponse;
  deleteCourse: Scalars['Boolean']['output'];
  deleteLesson: DeleteLessonReponse;
  deleteSection: DeleteSectionResponse;
  deleteTest: Test;
  deleteUser: User;
  markLessonAsCompleted?: Maybe<Enrollment>;
  undoLessonCompletion?: Maybe<Enrollment>;
  updateCourse: Course;
  updateEnrollment?: Maybe<Enrollment>;
  updateLesson: Lesson;
  updatePaymentStatus?: Maybe<Payment>;
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


export type MutationCreatePaymentArgs = {
  input: CreatePaymentInput;
};


export type MutationCreateSectionArgs = {
  input?: InputMaybe<CreateSectionInput>;
};


export type MutationCreateTestArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateUserArgs = {
  input: RegisterInput;
};


export type MutationDeleteCourseArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLessonArgs = {
  _id: Scalars['ID']['input'];
};


export type MutationDeleteSectionArgs = {
  _id: Scalars['ID']['input'];
};


export type MutationDeleteTestArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationMarkLessonAsCompletedArgs = {
  input?: InputMaybe<MarkLessonAsCompletedInput>;
};


export type MutationUndoLessonCompletionArgs = {
  input?: InputMaybe<UndoLessonCompletionInput>;
};


export type MutationUpdateCourseArgs = {
  input: UpdateCourseInput;
};


export type MutationUpdateEnrollmentArgs = {
  input?: InputMaybe<UpdateEnrollmentInput>;
};


export type MutationUpdateLessonArgs = {
  _id: Scalars['ID']['input'];
  input: UpdateLessonInput;
};


export type MutationUpdatePaymentStatusArgs = {
  _id: Scalars['ID']['input'];
  refundReason?: InputMaybe<Scalars['String']['input']>;
  status: PaymentStatus;
};


export type MutationUpdateSectionArgs = {
  _id: Scalars['ID']['input'];
  input: UpdateSectionInput;
};


export type MutationUpdateTestArgs = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  _id: Scalars['ID']['input'];
  input: UpdateInput;
};

export type Payment = {
  __typename?: 'Payment';
  _id: Scalars['ID']['output'];
  amount: Scalars['Float']['output'];
  courseId: Course;
  createdAt: Scalars['String']['output'];
  paymentMethod: PaymentMethod;
  refundReason?: Maybe<Scalars['String']['output']>;
  status: PaymentStatus;
  transactionNote: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  userId: User;
};

export enum PaymentMethod {
  BankTransfer = 'BANK_TRANSFER',
  CreditCard = 'CREDIT_CARD',
  Other = 'OTHER',
  Qpay = 'QPAY'
}

export enum PaymentStatus {
  Approved = 'APPROVED',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Refunded = 'REFUNDED'
}

export type Price = {
  __typename?: 'Price';
  amount?: Maybe<Scalars['Float']['output']>;
  currency?: Maybe<Currency>;
  discount?: Maybe<Scalars['Float']['output']>;
};

export type PriceInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  currency?: InputMaybe<Currency>;
  discount?: InputMaybe<Scalars['Float']['input']>;
};

export type PricingDetails = {
  __typename?: 'PricingDetails';
  description?: Maybe<Scalars['String']['output']>;
  details?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  planTitle?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['String']['output']>;
};

export type PricingDetailsInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  details?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  planTitle?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  checkEnrollment?: Maybe<Enrollment>;
  getAllCourse: Array<Course>;
  getAllPayments?: Maybe<Array<Maybe<Payment>>>;
  getAllTest: Array<Test>;
  getAllUser: Array<User>;
  getCourseById?: Maybe<Course>;
  getCourseBySlug?: Maybe<Course>;
  getCourseIdBySlug?: Maybe<Course>;
  getEnrolledCourseContentBySlug?: Maybe<Course>;
  getEnrollmentByUserAndCourse?: Maybe<Enrollment>;
  getEnrollmentsByCourse: Array<Enrollment>;
  getEnrollmentsByUser: Array<Enrollment>;
  getLessonById: Lesson;
  getLessonsBySection: Array<Lesson>;
  getPaymentById?: Maybe<Payment>;
  getPaymentByUserAndCourse?: Maybe<Payment>;
  getPaymentsByUser?: Maybe<Array<Maybe<Payment>>>;
  getSectionById: Section;
  getSectionsByCourseId: Array<Section>;
  getUserById: User;
};


export type QueryCheckEnrollmentArgs = {
  courseId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type QueryGetCourseByIdArgs = {
  _id: Scalars['ID']['input'];
};


export type QueryGetCourseBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryGetCourseIdBySlugArgs = {
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetEnrolledCourseContentBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryGetEnrollmentByUserAndCourseArgs = {
  courseId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type QueryGetEnrollmentsByCourseArgs = {
  courseId: Scalars['ID']['input'];
};


export type QueryGetEnrollmentsByUserArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetLessonByIdArgs = {
  _id: Scalars['ID']['input'];
};


export type QueryGetLessonsBySectionArgs = {
  sectionId: Scalars['ID']['input'];
};


export type QueryGetPaymentByIdArgs = {
  _id: Scalars['ID']['input'];
};


export type QueryGetPaymentByUserAndCourseArgs = {
  courseId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type QueryGetPaymentsByUserArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetSectionByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetSectionsByCourseIdArgs = {
  courseId: Scalars['ID']['input'];
};


export type QueryGetUserByIdArgs = {
  _id: Scalars['ID']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type RegisterResponse = {
  __typename?: 'RegisterResponse';
  message: Scalars['String']['output'];
  user: User;
};

export enum Role {
  Admin = 'ADMIN',
  Instructor = 'INSTRUCTOR',
  Student = 'STUDENT'
}

export type Section = {
  __typename?: 'Section';
  _id: Scalars['ID']['output'];
  courseId: Course;
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  lessonId?: Maybe<Array<Maybe<Lesson>>>;
  order: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type Test = {
  __typename?: 'Test';
  _id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type UpdateCourseInput = {
  _id: Scalars['ID']['input'];
  categories?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  difficulty?: InputMaybe<Difficulty>;
  price?: InputMaybe<PriceInput>;
  pricingDetails?: InputMaybe<PricingDetailsInput>;
  status?: InputMaybe<CourseStatus>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  whatYouWillLearn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  whyChooseOurCourse?: InputMaybe<Array<InputMaybe<WhyChooseInput>>>;
};

export type UpdateEnrollmentInput = {
  _id: Scalars['ID']['input'];
  progress?: InputMaybe<Scalars['Float']['input']>;
  status?: InputMaybe<EnrollmentStatus>;
};

export type UpdateInput = {
  email?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLessonInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  isPublished?: InputMaybe<Scalars['Boolean']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  videoUrl?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSectionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  email: Scalars['String']['output'];
  isVerified: Scalars['Boolean']['output'];
  role: Role;
  studentId: Scalars['String']['output'];
};

export type WhyChoose = {
  __typename?: 'WhyChoose';
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type WhyChooseInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type MarkLessonAsCompletedInput = {
  enrollmentId: Scalars['ID']['input'];
  lessonId: Scalars['ID']['input'];
};

export type UndoLessonCompletionInput = {
  enrollmentId: Scalars['ID']['input'];
  lessonId: Scalars['ID']['input'];
};

export type CreateCourseMutationVariables = Exact<{
  input: CreateCourseInput;
}>;


export type CreateCourseMutation = { __typename?: 'Mutation', createCourse: { __typename?: 'Course', _id: string } };

export type UpdateCourseMutationVariables = Exact<{
  input: UpdateCourseInput;
}>;


export type UpdateCourseMutation = { __typename?: 'Mutation', updateCourse: { __typename?: 'Course', _id: string } };

export type GetAllCourseQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCourseQuery = { __typename?: 'Query', getAllCourse: Array<{ __typename?: 'Course', _id: string, title: string, slug?: string | null, status?: CourseStatus | null, thumbnail?: string | null }> };

export type GetCourseByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCourseByIdQuery = { __typename?: 'Query', getCourseById?: { __typename?: 'Course', _id: string, title: string, slug?: string | null, description?: string | null, courseCode?: string | null, difficulty?: Difficulty | null, thumbnail?: string | null, status?: CourseStatus | null } | null };

export type GetCourseBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetCourseBySlugQuery = { __typename?: 'Query', getCourseBySlug?: { __typename?: 'Course', _id: string, title: string, slug?: string | null, description?: string | null, courseCode?: string | null, difficulty?: Difficulty | null, status?: CourseStatus | null, categories?: Array<string | null> | null, tags?: Array<string | null> | null, whatYouWillLearn?: Array<string | null> | null, price?: { __typename?: 'Price', amount?: number | null, currency?: Currency | null, discount?: number | null } | null, pricingDetails?: { __typename?: 'PricingDetails', planTitle?: string | null, description?: string | null, price?: string | null, details?: Array<string | null> | null } | null, whyChooseOurCourse?: Array<{ __typename?: 'WhyChoose', icon?: string | null, title?: string | null, description?: string | null } | null> | null } | null };

export type GetEnrolledCourseContentBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetEnrolledCourseContentBySlugQuery = { __typename?: 'Query', getEnrolledCourseContentBySlug?: { __typename?: 'Course', _id: string, title: string, slug?: string | null, description?: string | null, status?: CourseStatus | null, sectionId?: Array<{ __typename?: 'Section', _id: string, title: string, lessonId?: Array<{ __typename?: 'Lesson', _id: string, title: string, content?: string | null, videoUrl?: string | null } | null> | null } | null> | null } | null };

export type GetCourseIdBySlugQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCourseIdBySlugQuery = { __typename?: 'Query', getCourseIdBySlug?: { __typename?: 'Course', _id: string } | null };

export type MarkLessonAsCompletedMutationVariables = Exact<{
  input?: InputMaybe<MarkLessonAsCompletedInput>;
}>;


export type MarkLessonAsCompletedMutation = { __typename?: 'Mutation', markLessonAsCompleted?: { __typename?: 'Enrollment', _id: string } | null };

export type UndoLessonCompletionMutationVariables = Exact<{
  input?: InputMaybe<UndoLessonCompletionInput>;
}>;


export type UndoLessonCompletionMutation = { __typename?: 'Mutation', undoLessonCompletion?: { __typename?: 'Enrollment', _id: string } | null };

export type GetEnrollmentByUserAndCourseQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
  courseId: Scalars['ID']['input'];
}>;


export type GetEnrollmentByUserAndCourseQuery = { __typename?: 'Query', getEnrollmentByUserAndCourse?: { __typename?: 'Enrollment', _id: string, progress?: number | null, status?: EnrollmentStatus | null, completedLessons?: Array<string | null> | null } | null };

export type CheckEnrollmentQueryVariables = Exact<{
  courseId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
}>;


export type CheckEnrollmentQuery = { __typename?: 'Query', checkEnrollment?: { __typename?: 'Enrollment', _id: string, expiryDate?: string | null, status?: EnrollmentStatus | null, userId?: { __typename?: 'User', _id: string } | null, courseId?: { __typename?: 'Course', _id: string } | null } | null };

export type CreateLessonMutationVariables = Exact<{
  input: CreateLessonInput;
}>;


export type CreateLessonMutation = { __typename?: 'Mutation', createLesson: { __typename?: 'Lesson', _id: string } };

export type UpdateLessonMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateLessonInput;
}>;


export type UpdateLessonMutation = { __typename?: 'Mutation', updateLesson: { __typename?: 'Lesson', _id: string } };

export type DeleteLessonMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteLessonMutation = { __typename?: 'Mutation', deleteLesson: { __typename?: 'DeleteLessonReponse', success: boolean, message?: string | null } };

export type GetLessonByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetLessonByIdQuery = { __typename?: 'Query', getLessonById: { __typename?: 'Lesson', _id: string, title: string, content?: string | null, videoUrl?: string | null, order: number, isPublished: boolean, createdAt: string, updatedAt: string } };

export type CreatePaymentMutationVariables = Exact<{
  input: CreatePaymentInput;
}>;


export type CreatePaymentMutation = { __typename?: 'Mutation', createPayment?: { __typename?: 'Payment', _id: string } | null };

export type UpdatePaymentStatusMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  status: PaymentStatus;
  refundReason?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdatePaymentStatusMutation = { __typename?: 'Mutation', updatePaymentStatus?: { __typename?: 'Payment', _id: string } | null };

export type GetAllPaymentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllPaymentsQuery = { __typename?: 'Query', getAllPayments?: Array<{ __typename?: 'Payment', _id: string, amount: number, transactionNote: string, status: PaymentStatus, paymentMethod: PaymentMethod, refundReason?: string | null, createdAt: string, userId: { __typename?: 'User', _id: string, email: string }, courseId: { __typename?: 'Course', _id: string, title: string } } | null> | null };

export type GetPaymentByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPaymentByIdQuery = { __typename?: 'Query', getPaymentById?: { __typename?: 'Payment', _id: string, status: PaymentStatus, userId: { __typename?: 'User', _id: string }, courseId: { __typename?: 'Course', _id: string } } | null };

export type GetPaymentByUserAndCourseQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
  courseId: Scalars['ID']['input'];
}>;


export type GetPaymentByUserAndCourseQuery = { __typename?: 'Query', getPaymentByUserAndCourse?: { __typename?: 'Payment', _id: string, amount: number, transactionNote: string, status: PaymentStatus, paymentMethod: PaymentMethod, refundReason?: string | null, createdAt: string, userId: { __typename?: 'User', _id: string, email: string }, courseId: { __typename?: 'Course', _id: string, title: string } } | null };

export type CreateSectionMutationVariables = Exact<{
  input?: InputMaybe<CreateSectionInput>;
}>;


export type CreateSectionMutation = { __typename?: 'Mutation', createSection?: { __typename?: 'Section', _id: string } | null };

export type UpdateSectionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateSectionInput;
}>;


export type UpdateSectionMutation = { __typename?: 'Mutation', updateSection: { __typename?: 'Section', _id: string } };

export type DeleteSectionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteSectionMutation = { __typename?: 'Mutation', deleteSection: { __typename?: 'DeleteSectionResponse', success: boolean, message?: string | null } };

export type GetSectionsByCourseIdQueryVariables = Exact<{
  courseId: Scalars['ID']['input'];
}>;


export type GetSectionsByCourseIdQuery = { __typename?: 'Query', getSectionsByCourseId: Array<{ __typename?: 'Section', _id: string, title: string, order: number, lessonId?: Array<{ __typename?: 'Lesson', _id: string, title: string, content?: string | null, videoUrl?: string | null, order: number, isPublished: boolean } | null> | null }> };

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


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'RegisterResponse', message: string, user: { __typename?: 'User', _id: string, email: string, studentId: string, role: Role, isVerified: boolean } } };

export type GetAllUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUserQuery = { __typename?: 'Query', getAllUser: Array<{ __typename?: 'User', _id: string, email: string, studentId: string, role: Role, isVerified: boolean }> };

export type GetUserByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserByIdQuery = { __typename?: 'Query', getUserById: { __typename?: 'User', _id: string, email: string, studentId: string, role: Role, isVerified: boolean } };


export const CreateCourseDocument = gql`
    mutation CreateCourse($input: CreateCourseInput!) {
  createCourse(input: $input) {
    _id
  }
}
    `;
export type CreateCourseMutationFn = Apollo.MutationFunction<CreateCourseMutation, CreateCourseMutationVariables>;

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
export function useCreateCourseMutation(baseOptions?: Apollo.MutationHookOptions<CreateCourseMutation, CreateCourseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCourseMutation, CreateCourseMutationVariables>(CreateCourseDocument, options);
      }
export type CreateCourseMutationHookResult = ReturnType<typeof useCreateCourseMutation>;
export type CreateCourseMutationResult = Apollo.MutationResult<CreateCourseMutation>;
export type CreateCourseMutationOptions = Apollo.BaseMutationOptions<CreateCourseMutation, CreateCourseMutationVariables>;
export const UpdateCourseDocument = gql`
    mutation UpdateCourse($input: UpdateCourseInput!) {
  updateCourse(input: $input) {
    _id
  }
}
    `;
export type UpdateCourseMutationFn = Apollo.MutationFunction<UpdateCourseMutation, UpdateCourseMutationVariables>;

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
export function useUpdateCourseMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCourseMutation, UpdateCourseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCourseMutation, UpdateCourseMutationVariables>(UpdateCourseDocument, options);
      }
export type UpdateCourseMutationHookResult = ReturnType<typeof useUpdateCourseMutation>;
export type UpdateCourseMutationResult = Apollo.MutationResult<UpdateCourseMutation>;
export type UpdateCourseMutationOptions = Apollo.BaseMutationOptions<UpdateCourseMutation, UpdateCourseMutationVariables>;
export const GetAllCourseDocument = gql`
    query GetAllCourse {
  getAllCourse {
    _id
    title
    slug
    status
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
export function useGetAllCourseQuery(baseOptions?: Apollo.QueryHookOptions<GetAllCourseQuery, GetAllCourseQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllCourseQuery, GetAllCourseQueryVariables>(GetAllCourseDocument, options);
      }
export function useGetAllCourseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllCourseQuery, GetAllCourseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllCourseQuery, GetAllCourseQueryVariables>(GetAllCourseDocument, options);
        }
export function useGetAllCourseSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllCourseQuery, GetAllCourseQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllCourseQuery, GetAllCourseQueryVariables>(GetAllCourseDocument, options);
        }
export type GetAllCourseQueryHookResult = ReturnType<typeof useGetAllCourseQuery>;
export type GetAllCourseLazyQueryHookResult = ReturnType<typeof useGetAllCourseLazyQuery>;
export type GetAllCourseSuspenseQueryHookResult = ReturnType<typeof useGetAllCourseSuspenseQuery>;
export type GetAllCourseQueryResult = Apollo.QueryResult<GetAllCourseQuery, GetAllCourseQueryVariables>;
export const GetCourseByIdDocument = gql`
    query GetCourseById($id: ID!) {
  getCourseById(_id: $id) {
    _id
    title
    slug
    description
    courseCode
    difficulty
    thumbnail
    status
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
export function useGetCourseByIdQuery(baseOptions: Apollo.QueryHookOptions<GetCourseByIdQuery, GetCourseByIdQueryVariables> & ({ variables: GetCourseByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCourseByIdQuery, GetCourseByIdQueryVariables>(GetCourseByIdDocument, options);
      }
export function useGetCourseByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCourseByIdQuery, GetCourseByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCourseByIdQuery, GetCourseByIdQueryVariables>(GetCourseByIdDocument, options);
        }
export function useGetCourseByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCourseByIdQuery, GetCourseByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCourseByIdQuery, GetCourseByIdQueryVariables>(GetCourseByIdDocument, options);
        }
export type GetCourseByIdQueryHookResult = ReturnType<typeof useGetCourseByIdQuery>;
export type GetCourseByIdLazyQueryHookResult = ReturnType<typeof useGetCourseByIdLazyQuery>;
export type GetCourseByIdSuspenseQueryHookResult = ReturnType<typeof useGetCourseByIdSuspenseQuery>;
export type GetCourseByIdQueryResult = Apollo.QueryResult<GetCourseByIdQuery, GetCourseByIdQueryVariables>;
export const GetCourseBySlugDocument = gql`
    query GetCourseBySlug($slug: String!) {
  getCourseBySlug(slug: $slug) {
    _id
    title
    slug
    description
    courseCode
    difficulty
    status
    price {
      amount
      currency
      discount
    }
    pricingDetails {
      planTitle
      description
      price
      details
    }
    categories
    tags
    whatYouWillLearn
    whyChooseOurCourse {
      icon
      title
      description
    }
  }
}
    `;

/**
 * __useGetCourseBySlugQuery__
 *
 * To run a query within a React component, call `useGetCourseBySlugQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCourseBySlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCourseBySlugQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetCourseBySlugQuery(baseOptions: Apollo.QueryHookOptions<GetCourseBySlugQuery, GetCourseBySlugQueryVariables> & ({ variables: GetCourseBySlugQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCourseBySlugQuery, GetCourseBySlugQueryVariables>(GetCourseBySlugDocument, options);
      }
export function useGetCourseBySlugLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCourseBySlugQuery, GetCourseBySlugQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCourseBySlugQuery, GetCourseBySlugQueryVariables>(GetCourseBySlugDocument, options);
        }
export function useGetCourseBySlugSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCourseBySlugQuery, GetCourseBySlugQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCourseBySlugQuery, GetCourseBySlugQueryVariables>(GetCourseBySlugDocument, options);
        }
export type GetCourseBySlugQueryHookResult = ReturnType<typeof useGetCourseBySlugQuery>;
export type GetCourseBySlugLazyQueryHookResult = ReturnType<typeof useGetCourseBySlugLazyQuery>;
export type GetCourseBySlugSuspenseQueryHookResult = ReturnType<typeof useGetCourseBySlugSuspenseQuery>;
export type GetCourseBySlugQueryResult = Apollo.QueryResult<GetCourseBySlugQuery, GetCourseBySlugQueryVariables>;
export const GetEnrolledCourseContentBySlugDocument = gql`
    query GetEnrolledCourseContentBySlug($slug: String!) {
  getEnrolledCourseContentBySlug(slug: $slug) {
    _id
    title
    slug
    description
    status
    sectionId {
      _id
      title
      lessonId {
        _id
        title
        content
        videoUrl
      }
    }
  }
}
    `;

/**
 * __useGetEnrolledCourseContentBySlugQuery__
 *
 * To run a query within a React component, call `useGetEnrolledCourseContentBySlugQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEnrolledCourseContentBySlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEnrolledCourseContentBySlugQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetEnrolledCourseContentBySlugQuery(baseOptions: Apollo.QueryHookOptions<GetEnrolledCourseContentBySlugQuery, GetEnrolledCourseContentBySlugQueryVariables> & ({ variables: GetEnrolledCourseContentBySlugQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEnrolledCourseContentBySlugQuery, GetEnrolledCourseContentBySlugQueryVariables>(GetEnrolledCourseContentBySlugDocument, options);
      }
export function useGetEnrolledCourseContentBySlugLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEnrolledCourseContentBySlugQuery, GetEnrolledCourseContentBySlugQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEnrolledCourseContentBySlugQuery, GetEnrolledCourseContentBySlugQueryVariables>(GetEnrolledCourseContentBySlugDocument, options);
        }
export function useGetEnrolledCourseContentBySlugSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEnrolledCourseContentBySlugQuery, GetEnrolledCourseContentBySlugQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEnrolledCourseContentBySlugQuery, GetEnrolledCourseContentBySlugQueryVariables>(GetEnrolledCourseContentBySlugDocument, options);
        }
export type GetEnrolledCourseContentBySlugQueryHookResult = ReturnType<typeof useGetEnrolledCourseContentBySlugQuery>;
export type GetEnrolledCourseContentBySlugLazyQueryHookResult = ReturnType<typeof useGetEnrolledCourseContentBySlugLazyQuery>;
export type GetEnrolledCourseContentBySlugSuspenseQueryHookResult = ReturnType<typeof useGetEnrolledCourseContentBySlugSuspenseQuery>;
export type GetEnrolledCourseContentBySlugQueryResult = Apollo.QueryResult<GetEnrolledCourseContentBySlugQuery, GetEnrolledCourseContentBySlugQueryVariables>;
export const GetCourseIdBySlugDocument = gql`
    query GetCourseIdBySlug($slug: String) {
  getCourseIdBySlug(slug: $slug) {
    _id
  }
}
    `;

/**
 * __useGetCourseIdBySlugQuery__
 *
 * To run a query within a React component, call `useGetCourseIdBySlugQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCourseIdBySlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCourseIdBySlugQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetCourseIdBySlugQuery(baseOptions?: Apollo.QueryHookOptions<GetCourseIdBySlugQuery, GetCourseIdBySlugQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCourseIdBySlugQuery, GetCourseIdBySlugQueryVariables>(GetCourseIdBySlugDocument, options);
      }
export function useGetCourseIdBySlugLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCourseIdBySlugQuery, GetCourseIdBySlugQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCourseIdBySlugQuery, GetCourseIdBySlugQueryVariables>(GetCourseIdBySlugDocument, options);
        }
export function useGetCourseIdBySlugSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCourseIdBySlugQuery, GetCourseIdBySlugQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCourseIdBySlugQuery, GetCourseIdBySlugQueryVariables>(GetCourseIdBySlugDocument, options);
        }
export type GetCourseIdBySlugQueryHookResult = ReturnType<typeof useGetCourseIdBySlugQuery>;
export type GetCourseIdBySlugLazyQueryHookResult = ReturnType<typeof useGetCourseIdBySlugLazyQuery>;
export type GetCourseIdBySlugSuspenseQueryHookResult = ReturnType<typeof useGetCourseIdBySlugSuspenseQuery>;
export type GetCourseIdBySlugQueryResult = Apollo.QueryResult<GetCourseIdBySlugQuery, GetCourseIdBySlugQueryVariables>;
export const MarkLessonAsCompletedDocument = gql`
    mutation MarkLessonAsCompleted($input: markLessonAsCompletedInput) {
  markLessonAsCompleted(input: $input) {
    _id
  }
}
    `;
export type MarkLessonAsCompletedMutationFn = Apollo.MutationFunction<MarkLessonAsCompletedMutation, MarkLessonAsCompletedMutationVariables>;

/**
 * __useMarkLessonAsCompletedMutation__
 *
 * To run a mutation, you first call `useMarkLessonAsCompletedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkLessonAsCompletedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markLessonAsCompletedMutation, { data, loading, error }] = useMarkLessonAsCompletedMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useMarkLessonAsCompletedMutation(baseOptions?: Apollo.MutationHookOptions<MarkLessonAsCompletedMutation, MarkLessonAsCompletedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkLessonAsCompletedMutation, MarkLessonAsCompletedMutationVariables>(MarkLessonAsCompletedDocument, options);
      }
export type MarkLessonAsCompletedMutationHookResult = ReturnType<typeof useMarkLessonAsCompletedMutation>;
export type MarkLessonAsCompletedMutationResult = Apollo.MutationResult<MarkLessonAsCompletedMutation>;
export type MarkLessonAsCompletedMutationOptions = Apollo.BaseMutationOptions<MarkLessonAsCompletedMutation, MarkLessonAsCompletedMutationVariables>;
export const UndoLessonCompletionDocument = gql`
    mutation UndoLessonCompletion($input: undoLessonCompletionInput) {
  undoLessonCompletion(input: $input) {
    _id
  }
}
    `;
export type UndoLessonCompletionMutationFn = Apollo.MutationFunction<UndoLessonCompletionMutation, UndoLessonCompletionMutationVariables>;

/**
 * __useUndoLessonCompletionMutation__
 *
 * To run a mutation, you first call `useUndoLessonCompletionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUndoLessonCompletionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [undoLessonCompletionMutation, { data, loading, error }] = useUndoLessonCompletionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUndoLessonCompletionMutation(baseOptions?: Apollo.MutationHookOptions<UndoLessonCompletionMutation, UndoLessonCompletionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UndoLessonCompletionMutation, UndoLessonCompletionMutationVariables>(UndoLessonCompletionDocument, options);
      }
export type UndoLessonCompletionMutationHookResult = ReturnType<typeof useUndoLessonCompletionMutation>;
export type UndoLessonCompletionMutationResult = Apollo.MutationResult<UndoLessonCompletionMutation>;
export type UndoLessonCompletionMutationOptions = Apollo.BaseMutationOptions<UndoLessonCompletionMutation, UndoLessonCompletionMutationVariables>;
export const GetEnrollmentByUserAndCourseDocument = gql`
    query GetEnrollmentByUserAndCourse($userId: ID!, $courseId: ID!) {
  getEnrollmentByUserAndCourse(userId: $userId, courseId: $courseId) {
    _id
    progress
    status
    completedLessons
  }
}
    `;

/**
 * __useGetEnrollmentByUserAndCourseQuery__
 *
 * To run a query within a React component, call `useGetEnrollmentByUserAndCourseQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEnrollmentByUserAndCourseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEnrollmentByUserAndCourseQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      courseId: // value for 'courseId'
 *   },
 * });
 */
export function useGetEnrollmentByUserAndCourseQuery(baseOptions: Apollo.QueryHookOptions<GetEnrollmentByUserAndCourseQuery, GetEnrollmentByUserAndCourseQueryVariables> & ({ variables: GetEnrollmentByUserAndCourseQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEnrollmentByUserAndCourseQuery, GetEnrollmentByUserAndCourseQueryVariables>(GetEnrollmentByUserAndCourseDocument, options);
      }
export function useGetEnrollmentByUserAndCourseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEnrollmentByUserAndCourseQuery, GetEnrollmentByUserAndCourseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEnrollmentByUserAndCourseQuery, GetEnrollmentByUserAndCourseQueryVariables>(GetEnrollmentByUserAndCourseDocument, options);
        }
export function useGetEnrollmentByUserAndCourseSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEnrollmentByUserAndCourseQuery, GetEnrollmentByUserAndCourseQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEnrollmentByUserAndCourseQuery, GetEnrollmentByUserAndCourseQueryVariables>(GetEnrollmentByUserAndCourseDocument, options);
        }
export type GetEnrollmentByUserAndCourseQueryHookResult = ReturnType<typeof useGetEnrollmentByUserAndCourseQuery>;
export type GetEnrollmentByUserAndCourseLazyQueryHookResult = ReturnType<typeof useGetEnrollmentByUserAndCourseLazyQuery>;
export type GetEnrollmentByUserAndCourseSuspenseQueryHookResult = ReturnType<typeof useGetEnrollmentByUserAndCourseSuspenseQuery>;
export type GetEnrollmentByUserAndCourseQueryResult = Apollo.QueryResult<GetEnrollmentByUserAndCourseQuery, GetEnrollmentByUserAndCourseQueryVariables>;
export const CheckEnrollmentDocument = gql`
    query CheckEnrollment($courseId: ID!, $userId: ID!) {
  checkEnrollment(courseId: $courseId, userId: $userId) {
    _id
    expiryDate
    userId {
      _id
    }
    courseId {
      _id
    }
    status
  }
}
    `;

/**
 * __useCheckEnrollmentQuery__
 *
 * To run a query within a React component, call `useCheckEnrollmentQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckEnrollmentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckEnrollmentQuery({
 *   variables: {
 *      courseId: // value for 'courseId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useCheckEnrollmentQuery(baseOptions: Apollo.QueryHookOptions<CheckEnrollmentQuery, CheckEnrollmentQueryVariables> & ({ variables: CheckEnrollmentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CheckEnrollmentQuery, CheckEnrollmentQueryVariables>(CheckEnrollmentDocument, options);
      }
export function useCheckEnrollmentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckEnrollmentQuery, CheckEnrollmentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CheckEnrollmentQuery, CheckEnrollmentQueryVariables>(CheckEnrollmentDocument, options);
        }
export function useCheckEnrollmentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CheckEnrollmentQuery, CheckEnrollmentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CheckEnrollmentQuery, CheckEnrollmentQueryVariables>(CheckEnrollmentDocument, options);
        }
export type CheckEnrollmentQueryHookResult = ReturnType<typeof useCheckEnrollmentQuery>;
export type CheckEnrollmentLazyQueryHookResult = ReturnType<typeof useCheckEnrollmentLazyQuery>;
export type CheckEnrollmentSuspenseQueryHookResult = ReturnType<typeof useCheckEnrollmentSuspenseQuery>;
export type CheckEnrollmentQueryResult = Apollo.QueryResult<CheckEnrollmentQuery, CheckEnrollmentQueryVariables>;
export const CreateLessonDocument = gql`
    mutation CreateLesson($input: CreateLessonInput!) {
  createLesson(input: $input) {
    _id
  }
}
    `;
export type CreateLessonMutationFn = Apollo.MutationFunction<CreateLessonMutation, CreateLessonMutationVariables>;

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
export function useCreateLessonMutation(baseOptions?: Apollo.MutationHookOptions<CreateLessonMutation, CreateLessonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLessonMutation, CreateLessonMutationVariables>(CreateLessonDocument, options);
      }
export type CreateLessonMutationHookResult = ReturnType<typeof useCreateLessonMutation>;
export type CreateLessonMutationResult = Apollo.MutationResult<CreateLessonMutation>;
export type CreateLessonMutationOptions = Apollo.BaseMutationOptions<CreateLessonMutation, CreateLessonMutationVariables>;
export const UpdateLessonDocument = gql`
    mutation UpdateLesson($id: ID!, $input: UpdateLessonInput!) {
  updateLesson(_id: $id, input: $input) {
    _id
  }
}
    `;
export type UpdateLessonMutationFn = Apollo.MutationFunction<UpdateLessonMutation, UpdateLessonMutationVariables>;

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
export function useUpdateLessonMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLessonMutation, UpdateLessonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLessonMutation, UpdateLessonMutationVariables>(UpdateLessonDocument, options);
      }
export type UpdateLessonMutationHookResult = ReturnType<typeof useUpdateLessonMutation>;
export type UpdateLessonMutationResult = Apollo.MutationResult<UpdateLessonMutation>;
export type UpdateLessonMutationOptions = Apollo.BaseMutationOptions<UpdateLessonMutation, UpdateLessonMutationVariables>;
export const DeleteLessonDocument = gql`
    mutation DeleteLesson($id: ID!) {
  deleteLesson(_id: $id) {
    success
    message
  }
}
    `;
export type DeleteLessonMutationFn = Apollo.MutationFunction<DeleteLessonMutation, DeleteLessonMutationVariables>;

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
export function useDeleteLessonMutation(baseOptions?: Apollo.MutationHookOptions<DeleteLessonMutation, DeleteLessonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLessonMutation, DeleteLessonMutationVariables>(DeleteLessonDocument, options);
      }
export type DeleteLessonMutationHookResult = ReturnType<typeof useDeleteLessonMutation>;
export type DeleteLessonMutationResult = Apollo.MutationResult<DeleteLessonMutation>;
export type DeleteLessonMutationOptions = Apollo.BaseMutationOptions<DeleteLessonMutation, DeleteLessonMutationVariables>;
export const GetLessonByIdDocument = gql`
    query GetLessonById($id: ID!) {
  getLessonById(_id: $id) {
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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetLessonByIdQuery(baseOptions: Apollo.QueryHookOptions<GetLessonByIdQuery, GetLessonByIdQueryVariables> & ({ variables: GetLessonByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLessonByIdQuery, GetLessonByIdQueryVariables>(GetLessonByIdDocument, options);
      }
export function useGetLessonByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLessonByIdQuery, GetLessonByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLessonByIdQuery, GetLessonByIdQueryVariables>(GetLessonByIdDocument, options);
        }
export function useGetLessonByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLessonByIdQuery, GetLessonByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLessonByIdQuery, GetLessonByIdQueryVariables>(GetLessonByIdDocument, options);
        }
export type GetLessonByIdQueryHookResult = ReturnType<typeof useGetLessonByIdQuery>;
export type GetLessonByIdLazyQueryHookResult = ReturnType<typeof useGetLessonByIdLazyQuery>;
export type GetLessonByIdSuspenseQueryHookResult = ReturnType<typeof useGetLessonByIdSuspenseQuery>;
export type GetLessonByIdQueryResult = Apollo.QueryResult<GetLessonByIdQuery, GetLessonByIdQueryVariables>;
export const CreatePaymentDocument = gql`
    mutation CreatePayment($input: CreatePaymentInput!) {
  createPayment(input: $input) {
    _id
  }
}
    `;
export type CreatePaymentMutationFn = Apollo.MutationFunction<CreatePaymentMutation, CreatePaymentMutationVariables>;

/**
 * __useCreatePaymentMutation__
 *
 * To run a mutation, you first call `useCreatePaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPaymentMutation, { data, loading, error }] = useCreatePaymentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePaymentMutation(baseOptions?: Apollo.MutationHookOptions<CreatePaymentMutation, CreatePaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePaymentMutation, CreatePaymentMutationVariables>(CreatePaymentDocument, options);
      }
export type CreatePaymentMutationHookResult = ReturnType<typeof useCreatePaymentMutation>;
export type CreatePaymentMutationResult = Apollo.MutationResult<CreatePaymentMutation>;
export type CreatePaymentMutationOptions = Apollo.BaseMutationOptions<CreatePaymentMutation, CreatePaymentMutationVariables>;
export const UpdatePaymentStatusDocument = gql`
    mutation UpdatePaymentStatus($id: ID!, $status: PaymentStatus!, $refundReason: String) {
  updatePaymentStatus(_id: $id, status: $status, refundReason: $refundReason) {
    _id
  }
}
    `;
export type UpdatePaymentStatusMutationFn = Apollo.MutationFunction<UpdatePaymentStatusMutation, UpdatePaymentStatusMutationVariables>;

/**
 * __useUpdatePaymentStatusMutation__
 *
 * To run a mutation, you first call `useUpdatePaymentStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePaymentStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePaymentStatusMutation, { data, loading, error }] = useUpdatePaymentStatusMutation({
 *   variables: {
 *      id: // value for 'id'
 *      status: // value for 'status'
 *      refundReason: // value for 'refundReason'
 *   },
 * });
 */
export function useUpdatePaymentStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePaymentStatusMutation, UpdatePaymentStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePaymentStatusMutation, UpdatePaymentStatusMutationVariables>(UpdatePaymentStatusDocument, options);
      }
export type UpdatePaymentStatusMutationHookResult = ReturnType<typeof useUpdatePaymentStatusMutation>;
export type UpdatePaymentStatusMutationResult = Apollo.MutationResult<UpdatePaymentStatusMutation>;
export type UpdatePaymentStatusMutationOptions = Apollo.BaseMutationOptions<UpdatePaymentStatusMutation, UpdatePaymentStatusMutationVariables>;
export const GetAllPaymentsDocument = gql`
    query GetAllPayments {
  getAllPayments {
    _id
    userId {
      _id
      email
    }
    courseId {
      _id
      title
    }
    amount
    transactionNote
    status
    paymentMethod
    refundReason
    createdAt
  }
}
    `;

/**
 * __useGetAllPaymentsQuery__
 *
 * To run a query within a React component, call `useGetAllPaymentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllPaymentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllPaymentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllPaymentsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllPaymentsQuery, GetAllPaymentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllPaymentsQuery, GetAllPaymentsQueryVariables>(GetAllPaymentsDocument, options);
      }
export function useGetAllPaymentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllPaymentsQuery, GetAllPaymentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllPaymentsQuery, GetAllPaymentsQueryVariables>(GetAllPaymentsDocument, options);
        }
export function useGetAllPaymentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllPaymentsQuery, GetAllPaymentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllPaymentsQuery, GetAllPaymentsQueryVariables>(GetAllPaymentsDocument, options);
        }
export type GetAllPaymentsQueryHookResult = ReturnType<typeof useGetAllPaymentsQuery>;
export type GetAllPaymentsLazyQueryHookResult = ReturnType<typeof useGetAllPaymentsLazyQuery>;
export type GetAllPaymentsSuspenseQueryHookResult = ReturnType<typeof useGetAllPaymentsSuspenseQuery>;
export type GetAllPaymentsQueryResult = Apollo.QueryResult<GetAllPaymentsQuery, GetAllPaymentsQueryVariables>;
export const GetPaymentByIdDocument = gql`
    query GetPaymentById($id: ID!) {
  getPaymentById(_id: $id) {
    _id
    userId {
      _id
    }
    courseId {
      _id
    }
    status
  }
}
    `;

/**
 * __useGetPaymentByIdQuery__
 *
 * To run a query within a React component, call `useGetPaymentByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPaymentByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPaymentByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPaymentByIdQuery(baseOptions: Apollo.QueryHookOptions<GetPaymentByIdQuery, GetPaymentByIdQueryVariables> & ({ variables: GetPaymentByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPaymentByIdQuery, GetPaymentByIdQueryVariables>(GetPaymentByIdDocument, options);
      }
export function useGetPaymentByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPaymentByIdQuery, GetPaymentByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPaymentByIdQuery, GetPaymentByIdQueryVariables>(GetPaymentByIdDocument, options);
        }
export function useGetPaymentByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPaymentByIdQuery, GetPaymentByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPaymentByIdQuery, GetPaymentByIdQueryVariables>(GetPaymentByIdDocument, options);
        }
export type GetPaymentByIdQueryHookResult = ReturnType<typeof useGetPaymentByIdQuery>;
export type GetPaymentByIdLazyQueryHookResult = ReturnType<typeof useGetPaymentByIdLazyQuery>;
export type GetPaymentByIdSuspenseQueryHookResult = ReturnType<typeof useGetPaymentByIdSuspenseQuery>;
export type GetPaymentByIdQueryResult = Apollo.QueryResult<GetPaymentByIdQuery, GetPaymentByIdQueryVariables>;
export const GetPaymentByUserAndCourseDocument = gql`
    query GetPaymentByUserAndCourse($userId: ID!, $courseId: ID!) {
  getPaymentByUserAndCourse(userId: $userId, courseId: $courseId) {
    _id
    userId {
      _id
      email
    }
    courseId {
      _id
      title
    }
    amount
    transactionNote
    status
    paymentMethod
    refundReason
    createdAt
  }
}
    `;

/**
 * __useGetPaymentByUserAndCourseQuery__
 *
 * To run a query within a React component, call `useGetPaymentByUserAndCourseQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPaymentByUserAndCourseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPaymentByUserAndCourseQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *      courseId: // value for 'courseId'
 *   },
 * });
 */
export function useGetPaymentByUserAndCourseQuery(baseOptions: Apollo.QueryHookOptions<GetPaymentByUserAndCourseQuery, GetPaymentByUserAndCourseQueryVariables> & ({ variables: GetPaymentByUserAndCourseQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPaymentByUserAndCourseQuery, GetPaymentByUserAndCourseQueryVariables>(GetPaymentByUserAndCourseDocument, options);
      }
export function useGetPaymentByUserAndCourseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPaymentByUserAndCourseQuery, GetPaymentByUserAndCourseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPaymentByUserAndCourseQuery, GetPaymentByUserAndCourseQueryVariables>(GetPaymentByUserAndCourseDocument, options);
        }
export function useGetPaymentByUserAndCourseSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPaymentByUserAndCourseQuery, GetPaymentByUserAndCourseQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPaymentByUserAndCourseQuery, GetPaymentByUserAndCourseQueryVariables>(GetPaymentByUserAndCourseDocument, options);
        }
export type GetPaymentByUserAndCourseQueryHookResult = ReturnType<typeof useGetPaymentByUserAndCourseQuery>;
export type GetPaymentByUserAndCourseLazyQueryHookResult = ReturnType<typeof useGetPaymentByUserAndCourseLazyQuery>;
export type GetPaymentByUserAndCourseSuspenseQueryHookResult = ReturnType<typeof useGetPaymentByUserAndCourseSuspenseQuery>;
export type GetPaymentByUserAndCourseQueryResult = Apollo.QueryResult<GetPaymentByUserAndCourseQuery, GetPaymentByUserAndCourseQueryVariables>;
export const CreateSectionDocument = gql`
    mutation CreateSection($input: CreateSectionInput) {
  createSection(input: $input) {
    _id
  }
}
    `;
export type CreateSectionMutationFn = Apollo.MutationFunction<CreateSectionMutation, CreateSectionMutationVariables>;

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
export function useCreateSectionMutation(baseOptions?: Apollo.MutationHookOptions<CreateSectionMutation, CreateSectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSectionMutation, CreateSectionMutationVariables>(CreateSectionDocument, options);
      }
export type CreateSectionMutationHookResult = ReturnType<typeof useCreateSectionMutation>;
export type CreateSectionMutationResult = Apollo.MutationResult<CreateSectionMutation>;
export type CreateSectionMutationOptions = Apollo.BaseMutationOptions<CreateSectionMutation, CreateSectionMutationVariables>;
export const UpdateSectionDocument = gql`
    mutation UpdateSection($id: ID!, $input: UpdateSectionInput!) {
  updateSection(_id: $id, input: $input) {
    _id
  }
}
    `;
export type UpdateSectionMutationFn = Apollo.MutationFunction<UpdateSectionMutation, UpdateSectionMutationVariables>;

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
export function useUpdateSectionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSectionMutation, UpdateSectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSectionMutation, UpdateSectionMutationVariables>(UpdateSectionDocument, options);
      }
export type UpdateSectionMutationHookResult = ReturnType<typeof useUpdateSectionMutation>;
export type UpdateSectionMutationResult = Apollo.MutationResult<UpdateSectionMutation>;
export type UpdateSectionMutationOptions = Apollo.BaseMutationOptions<UpdateSectionMutation, UpdateSectionMutationVariables>;
export const DeleteSectionDocument = gql`
    mutation DeleteSection($id: ID!) {
  deleteSection(_id: $id) {
    success
    message
  }
}
    `;
export type DeleteSectionMutationFn = Apollo.MutationFunction<DeleteSectionMutation, DeleteSectionMutationVariables>;

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
export function useDeleteSectionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSectionMutation, DeleteSectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSectionMutation, DeleteSectionMutationVariables>(DeleteSectionDocument, options);
      }
export type DeleteSectionMutationHookResult = ReturnType<typeof useDeleteSectionMutation>;
export type DeleteSectionMutationResult = Apollo.MutationResult<DeleteSectionMutation>;
export type DeleteSectionMutationOptions = Apollo.BaseMutationOptions<DeleteSectionMutation, DeleteSectionMutationVariables>;
export const GetSectionsByCourseIdDocument = gql`
    query GetSectionsByCourseId($courseId: ID!) {
  getSectionsByCourseId(courseId: $courseId) {
    _id
    title
    order
    lessonId {
      _id
      title
      content
      videoUrl
      order
      isPublished
    }
  }
}
    `;

/**
 * __useGetSectionsByCourseIdQuery__
 *
 * To run a query within a React component, call `useGetSectionsByCourseIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSectionsByCourseIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSectionsByCourseIdQuery({
 *   variables: {
 *      courseId: // value for 'courseId'
 *   },
 * });
 */
export function useGetSectionsByCourseIdQuery(baseOptions: Apollo.QueryHookOptions<GetSectionsByCourseIdQuery, GetSectionsByCourseIdQueryVariables> & ({ variables: GetSectionsByCourseIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSectionsByCourseIdQuery, GetSectionsByCourseIdQueryVariables>(GetSectionsByCourseIdDocument, options);
      }
export function useGetSectionsByCourseIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSectionsByCourseIdQuery, GetSectionsByCourseIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSectionsByCourseIdQuery, GetSectionsByCourseIdQueryVariables>(GetSectionsByCourseIdDocument, options);
        }
export function useGetSectionsByCourseIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSectionsByCourseIdQuery, GetSectionsByCourseIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSectionsByCourseIdQuery, GetSectionsByCourseIdQueryVariables>(GetSectionsByCourseIdDocument, options);
        }
export type GetSectionsByCourseIdQueryHookResult = ReturnType<typeof useGetSectionsByCourseIdQuery>;
export type GetSectionsByCourseIdLazyQueryHookResult = ReturnType<typeof useGetSectionsByCourseIdLazyQuery>;
export type GetSectionsByCourseIdSuspenseQueryHookResult = ReturnType<typeof useGetSectionsByCourseIdSuspenseQuery>;
export type GetSectionsByCourseIdQueryResult = Apollo.QueryResult<GetSectionsByCourseIdQuery, GetSectionsByCourseIdQueryVariables>;
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
export function useGetAllUserQuery(baseOptions?: Apollo.QueryHookOptions<GetAllUserQuery, GetAllUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllUserQuery, GetAllUserQueryVariables>(GetAllUserDocument, options);
      }
export function useGetAllUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllUserQuery, GetAllUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllUserQuery, GetAllUserQueryVariables>(GetAllUserDocument, options);
        }
export function useGetAllUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllUserQuery, GetAllUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllUserQuery, GetAllUserQueryVariables>(GetAllUserDocument, options);
        }
export type GetAllUserQueryHookResult = ReturnType<typeof useGetAllUserQuery>;
export type GetAllUserLazyQueryHookResult = ReturnType<typeof useGetAllUserLazyQuery>;
export type GetAllUserSuspenseQueryHookResult = ReturnType<typeof useGetAllUserSuspenseQuery>;
export type GetAllUserQueryResult = Apollo.QueryResult<GetAllUserQuery, GetAllUserQueryVariables>;
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
export function useGetUserByIdQuery(baseOptions: Apollo.QueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables> & ({ variables: GetUserByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, options);
      }
export function useGetUserByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, options);
        }
export function useGetUserByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, options);
        }
export type GetUserByIdQueryHookResult = ReturnType<typeof useGetUserByIdQuery>;
export type GetUserByIdLazyQueryHookResult = ReturnType<typeof useGetUserByIdLazyQuery>;
export type GetUserByIdSuspenseQueryHookResult = ReturnType<typeof useGetUserByIdSuspenseQuery>;
export type GetUserByIdQueryResult = Apollo.QueryResult<GetUserByIdQuery, GetUserByIdQueryVariables>;