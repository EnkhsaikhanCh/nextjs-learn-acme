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
  DateTime: { input: Date; output: Date; }
};

export type AdminUserV2 = UserV2 & {
  __typename?: 'AdminUserV2';
  _id: Scalars['ID']['output'];
  adminLevel?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  isVerified: Scalars['Boolean']['output'];
  role: UserV2Role;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type AssignmentLesson = LessonV2 & {
  __typename?: 'AssignmentLesson';
  _id: Scalars['ID']['output'];
  assignmentDetails?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  isFree: Scalars['Boolean']['output'];
  isPublished: Scalars['Boolean']['output'];
  order: Scalars['Int']['output'];
  sectionId: Section;
  title: Scalars['String']['output'];
  type: LessonType;
  updatedAt: Scalars['DateTime']['output'];
};

export enum BankName {
  ArigBank = 'ARIG_BANK',
  BogdBank = 'BOGD_BANK',
  CapitronBank = 'CAPITRON_BANK',
  GolomtBank = 'GOLOMT_BANK',
  KhanBank = 'KHAN_BANK',
  MBank = 'M_BANK',
  StateBankOfMongolia = 'STATE_BANK_OF_MONGOLIA',
  TradeAndDevelopmentBank = 'TRADE_AND_DEVELOPMENT_BANK',
  XacBank = 'XAC_BANK'
}

export type ChangePasswordInput = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};

export type ChangePasswordResponse = {
  __typename?: 'ChangePasswordResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Course = {
  __typename?: 'Course';
  _id: Scalars['ID']['output'];
  category?: Maybe<Scalars['String']['output']>;
  courseCode?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<InstructorUserV2>;
  description?: Maybe<Scalars['String']['output']>;
  difficulty?: Maybe<Difficulty>;
  isEnrolled?: Maybe<Scalars['Boolean']['output']>;
  price?: Maybe<PricingPlan>;
  requirements?: Maybe<Scalars['String']['output']>;
  sectionId?: Maybe<Array<Maybe<Section>>>;
  slug?: Maybe<Scalars['String']['output']>;
  status?: Maybe<CourseStatus>;
  subtitle?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<Thumbnail>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  whatYouWillLearn?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  whoIsThisFor?: Maybe<Scalars['String']['output']>;
};

/**
 * Хэрэглэгч курсэд нэвтэрсэн байдал болон бусад төлөв:
 * GUEST         - Одоогоор нэвтрээгүй буюу бүртгэлгүй
 * NOT_ENROLLED  - Нэвтэрсэн боловч курсэд бүртгэлгүй (эсвэл хугацаа дууссан)
 * ENROLLED      - Курсэд бүрэн эрхтэй
 * EXPIRED       - Бүртгэл байсан ч хугацаа дууссан
 */
export enum CourseAccessStatus {
  AdminEnrolled = 'ADMIN_ENROLLED',
  AdminNotEnrolled = 'ADMIN_NOT_ENROLLED',
  Enrolled = 'ENROLLED',
  Expired = 'EXPIRED',
  Guest = 'GUEST',
  NotEnrolled = 'NOT_ENROLLED'
}

export type CourseBasicInfoInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  difficulty?: InputMaybe<Difficulty>;
  requirements?: InputMaybe<Scalars['String']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  whoIsThisFor?: InputMaybe<Scalars['String']['input']>;
};

/**
 * Нэг Query-д буцах нэгдсэн бүтэц
 *   - status: Хэрэглэгчийн төлөв
 *   - coursePreviewData: Хэрэв GUEST эсвэл NOT_ENROLLED бол үзүүлэх 'preview' талын мэдээлэл
 *   - fullContent: Хэрэв ENROLLED бол үзүүлэх курсийн бүрэн агуулга
 */
export type CourseForUserPayload = {
  __typename?: 'CourseForUserPayload';
  coursePreviewData?: Maybe<Course>;
  fullContent?: Maybe<Course>;
  status: CourseAccessStatus;
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

export type CreateLessonResponse = {
  __typename?: 'CreateLessonResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type CreateLessonV2Input = {
  order?: InputMaybe<Scalars['Int']['input']>;
  sectionId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
  type: LessonType;
};

export type CreateLessonV2Response = {
  __typename?: 'CreateLessonV2Response';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
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

export type CreateSectionResponse = {
  __typename?: 'CreateSectionResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export enum Currency {
  Mnt = 'MNT'
}

export type DeleteLessonReponse = {
  __typename?: 'DeleteLessonReponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type DeleteLessonV2Response = {
  __typename?: 'DeleteLessonV2Response';
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
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  expiryDate?: Maybe<Scalars['String']['output']>;
  history?: Maybe<Array<Maybe<EnrollmentHistory>>>;
  isCompleted?: Maybe<Scalars['Boolean']['output']>;
  isDeleted?: Maybe<Scalars['Boolean']['output']>;
  lastAccessedAt?: Maybe<Scalars['DateTime']['output']>;
  progress?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<EnrollmentStatus>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
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

export type FileLesson = LessonV2 & {
  __typename?: 'FileLesson';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  fileUrl?: Maybe<Scalars['String']['output']>;
  isFree: Scalars['Boolean']['output'];
  isPublished: Scalars['Boolean']['output'];
  order: Scalars['Int']['output'];
  sectionId: Section;
  title: Scalars['String']['output'];
  type: LessonType;
  updatedAt: Scalars['DateTime']['output'];
};

export type GenerateTempTokenResponse = {
  __typename?: 'GenerateTempTokenResponse';
  token: Scalars['String']['output'];
};

export type GetEmailFromTokenResponse = {
  __typename?: 'GetEmailFromTokenResponse';
  email: Scalars['String']['output'];
};

export type GetUserEnrolledCoursesCountResponse = {
  __typename?: 'GetUserEnrolledCoursesCountResponse';
  completedCount: Scalars['Int']['output'];
  courseCompletionPercentage: Scalars['Float']['output'];
  inProgressCount: Scalars['Int']['output'];
  totalCourses: Scalars['Int']['output'];
};

export type InstructorPayoutInfo = {
  __typename?: 'InstructorPayoutInfo';
  accountHolderName?: Maybe<Scalars['String']['output']>;
  accountNumber?: Maybe<Scalars['String']['output']>;
  bankName?: Maybe<BankName>;
  payoutMethod?: Maybe<PayoutMethod>;
};

export type InstructorUserV2 = UserV2 & {
  __typename?: 'InstructorUserV2';
  _id: Scalars['ID']['output'];
  bio?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  fullName?: Maybe<Scalars['String']['output']>;
  isVerified: Scalars['Boolean']['output'];
  payout?: Maybe<InstructorPayoutInfo>;
  profilePicture?: Maybe<ProfilePicture>;
  role: UserV2Role;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

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

export enum LessonType {
  Assignment = 'ASSIGNMENT',
  File = 'FILE',
  Quiz = 'QUIZ',
  Text = 'TEXT',
  Video = 'VIDEO'
}

export type LessonV2 = {
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  isFree: Scalars['Boolean']['output'];
  isPublished: Scalars['Boolean']['output'];
  order: Scalars['Int']['output'];
  sectionId: Section;
  title: Scalars['String']['output'];
  type: LessonType;
  updatedAt: Scalars['DateTime']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changeUserPassword: ChangePasswordResponse;
  createCourse: Course;
  createEnrollment?: Maybe<Enrollment>;
  createLesson: CreateLessonResponse;
  createLessonV2: CreateLessonV2Response;
  createMuxUploadUrl: MuxUpload;
  createPayment?: Maybe<Payment>;
  createSection: CreateSectionResponse;
  createSubscriber: SubscribeResponse;
  createUser: RegisterResponse;
  deleteCourse: Scalars['Boolean']['output'];
  deleteLesson: DeleteLessonReponse;
  deleteLessonV2: DeleteLessonV2Response;
  deleteSection: DeleteSectionResponse;
  deleteUser: User;
  generateTempToken: GenerateTempTokenResponse;
  markLessonAsCompleted?: Maybe<Enrollment>;
  registerUserV2: RegisterUserV2Response;
  sendOTP: SendOtpResponse;
  undoLessonCompletion?: Maybe<Enrollment>;
  updateAssignmentLessonV2: UpdateLessonV2Response;
  updateCourseBasicInfo: Course;
  updateCoursePricing: Course;
  updateCoursePricingV2: UpdateCourseResponse;
  updateCourseThumbnail: Course;
  updateCourseVisibilityAndAccess: Course;
  updateCourseWhatYouWillLearn: Course;
  updateEnrollment?: Maybe<Enrollment>;
  updateFileLessonV2: UpdateLessonV2Response;
  updateInstructorPayoutInfo: UpdateUserV2Response;
  updateInstructorProfilePicture: UpdateUserV2Response;
  updateInstructorUserV2: UpdateUserV2Response;
  updateLesson: Lesson;
  updateLessonV2GeneralInfo: UpdateLessonV2Response;
  updateLessonV2Video: UpdateLessonV2Response;
  updatePaymentStatus?: Maybe<Payment>;
  updateQuizLessonV2: UpdateLessonV2Response;
  updateSection: UpdateSectionResponse;
  updateTextLessonV2: UpdateLessonV2Response;
  updateUser: User;
  verifyOTP: VerifyOtpResponse;
};


export type MutationChangeUserPasswordArgs = {
  input: ChangePasswordInput;
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


export type MutationCreateLessonV2Args = {
  input: CreateLessonV2Input;
};


export type MutationCreateMuxUploadUrlArgs = {
  corsOrigin?: InputMaybe<Scalars['String']['input']>;
  playbackPolicy?: InputMaybe<Array<PlaybackPolicy>>;
};


export type MutationCreatePaymentArgs = {
  input: CreatePaymentInput;
};


export type MutationCreateSectionArgs = {
  input?: InputMaybe<CreateSectionInput>;
};


export type MutationCreateSubscriberArgs = {
  input: SubscribeInput;
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


export type MutationDeleteLessonV2Args = {
  _id: Scalars['ID']['input'];
};


export type MutationDeleteSectionArgs = {
  _id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationGenerateTempTokenArgs = {
  email: Scalars['String']['input'];
};


export type MutationMarkLessonAsCompletedArgs = {
  input?: InputMaybe<MarkLessonAsCompletedInput>;
};


export type MutationRegisterUserV2Args = {
  input: RegisterUserV2Input;
};


export type MutationSendOtpArgs = {
  email: Scalars['String']['input'];
};


export type MutationUndoLessonCompletionArgs = {
  input?: InputMaybe<UndoLessonCompletionInput>;
};


export type MutationUpdateAssignmentLessonV2Args = {
  _id: Scalars['ID']['input'];
  input: UpdateAssignmentLessonV2Input;
};


export type MutationUpdateCourseBasicInfoArgs = {
  courseId: Scalars['ID']['input'];
  input: CourseBasicInfoInput;
};


export type MutationUpdateCoursePricingArgs = {
  courseId: Scalars['ID']['input'];
  input: UpdateCoursePricingInput;
};


export type MutationUpdateCoursePricingV2Args = {
  courseId: Scalars['ID']['input'];
  input: UpdateCoursePricingInput;
};


export type MutationUpdateCourseThumbnailArgs = {
  courseId: Scalars['ID']['input'];
  input: ThumbnailInput;
};


export type MutationUpdateCourseVisibilityAndAccessArgs = {
  input: UpdateCourseVisibilityAndAccessInput;
};


export type MutationUpdateCourseWhatYouWillLearnArgs = {
  courseId: Scalars['ID']['input'];
  input: UpdateCourseWhatYouWillLearnInput;
};


export type MutationUpdateEnrollmentArgs = {
  input?: InputMaybe<UpdateEnrollmentInput>;
};


export type MutationUpdateFileLessonV2Args = {
  _id: Scalars['ID']['input'];
  input: UpdateFileLessonV2Input;
};


export type MutationUpdateInstructorPayoutInfoArgs = {
  input: UpdateInstructorPayoutInfoInput;
};


export type MutationUpdateInstructorProfilePictureArgs = {
  _id: Scalars['ID']['input'];
  input: UploadProfilePictureInput;
};


export type MutationUpdateInstructorUserV2Args = {
  _id: Scalars['ID']['input'];
  input: UpdateInstructorUserV2Input;
};


export type MutationUpdateLessonArgs = {
  _id: Scalars['ID']['input'];
  input: UpdateLessonInput;
};


export type MutationUpdateLessonV2GeneralInfoArgs = {
  _id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<UpdateLessonV2GeneralInfoInput>;
};


export type MutationUpdateLessonV2VideoArgs = {
  _id: Scalars['ID']['input'];
  input: UpdateLessonV2VideoInput;
};


export type MutationUpdatePaymentStatusArgs = {
  _id: Scalars['ID']['input'];
  refundReason?: InputMaybe<Scalars['String']['input']>;
  status: PaymentStatus;
};


export type MutationUpdateQuizLessonV2Args = {
  _id: Scalars['ID']['input'];
  input: UpdateQuizLessonV2Input;
};


export type MutationUpdateSectionArgs = {
  _id: Scalars['ID']['input'];
  input: UpdateSectionInput;
};


export type MutationUpdateTextLessonV2Args = {
  _id: Scalars['ID']['input'];
  input: UpdateTextLessonV2Input;
};


export type MutationUpdateUserArgs = {
  _id: Scalars['ID']['input'];
  input: UpdateUserInput;
};


export type MutationVerifyOtpArgs = {
  email: Scalars['String']['input'];
  otp: Scalars['String']['input'];
};

export type MuxUpload = {
  __typename?: 'MuxUpload';
  passthrough: Scalars['String']['output'];
  uploadId: Scalars['String']['output'];
  uploadUrl: Scalars['String']['output'];
};

export type Payment = {
  __typename?: 'Payment';
  _id: Scalars['ID']['output'];
  amount: Scalars['Float']['output'];
  courseId: Course;
  createdAt: Scalars['DateTime']['output'];
  paymentMethod: PaymentMethod;
  refundReason?: Maybe<Scalars['String']['output']>;
  status: PaymentStatus;
  transactionNote: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  userId: User;
};

export type PaymentFilterInput = {
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<PaymentStatus>;
};

export enum PaymentMethod {
  BankTransfer = 'BANK_TRANSFER',
  CreditCard = 'CREDIT_CARD',
  Other = 'OTHER',
  Qpay = 'QPAY'
}

export type PaymentPaginationResult = {
  __typename?: 'PaymentPaginationResult';
  hasNextPage: Scalars['Boolean']['output'];
  payments: Array<Payment>;
  totalAmount: Scalars['Float']['output'];
  totalCount: Scalars['Int']['output'];
};

export enum PaymentStatus {
  Approved = 'APPROVED',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Refunded = 'REFUNDED'
}

export enum PayoutMethod {
  BankTransfer = 'BANK_TRANSFER'
}

export enum PlaybackPolicy {
  Public = 'PUBLIC',
  Signed = 'SIGNED'
}

export type PricingPlan = {
  __typename?: 'PricingPlan';
  amount?: Maybe<Scalars['Int']['output']>;
  currency?: Maybe<Currency>;
  description?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  planTitle?: Maybe<Scalars['String']['output']>;
};

export type PricingPlanInput = {
  amount?: InputMaybe<Scalars['Int']['input']>;
  currency?: InputMaybe<Currency>;
  description?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  planTitle?: InputMaybe<Scalars['String']['input']>;
};

export type ProfilePicture = {
  __typename?: 'ProfilePicture';
  format?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['Int']['output']>;
  publicId: Scalars['String']['output'];
  width?: Maybe<Scalars['Int']['output']>;
};

export type Query = {
  __typename?: 'Query';
  checkEnrollment?: Maybe<Enrollment>;
  getAllCourse: Array<Course>;
  getAllCourseWithEnrollment: Array<Course>;
  getAllCoursesByInstructurId?: Maybe<Array<Maybe<Course>>>;
  getAllPayments: PaymentPaginationResult;
  getAllSubscribers: SubscriberPaginationResult;
  getAllUser: UserPaginationResult;
  getAllUsersV2: UserV2PaginationResult;
  getCourseBasicInfoForEdit?: Maybe<Course>;
  getCourseDetailsForInstructor?: Maybe<GetCourseDetailsForInstructorResponse>;
  getCourseForUser: CourseForUserPayload;
  getCoursePreviewData?: Maybe<GetCoursePreviewDataResponse>;
  getEmailFromToken: GetEmailFromTokenResponse;
  getEnrollmentByUserAndCourse?: Maybe<Enrollment>;
  getEnrollmentsByCourse: Array<Enrollment>;
  getEnrollmentsByUser: Array<Enrollment>;
  getInstructorCourseContent?: Maybe<Course>;
  getInstructorUserV2InfoById: InstructorUserV2;
  getLessonById: Lesson;
  getLessonV2ByIdForInstructor: LessonV2;
  getLessonV2byIdForStudent: LessonV2;
  getLessonsBySection: Array<Lesson>;
  getLessonsV2BySection: Array<LessonV2>;
  getPaymentById?: Maybe<Payment>;
  getPaymentByUserAndCourse?: Maybe<Payment>;
  getPaymentsByUser?: Maybe<Array<Maybe<Payment>>>;
  getUserById: User;
  getUserEnrolledCourses?: Maybe<Array<Maybe<Enrollment>>>;
  getUserEnrolledCoursesCount: GetUserEnrolledCoursesCountResponse;
  getUserNotEnrolledCourses?: Maybe<Array<Maybe<Course>>>;
  getUserV2ById: UserV2;
};


export type QueryCheckEnrollmentArgs = {
  courseId: Scalars['ID']['input'];
};


export type QueryGetAllPaymentsArgs = {
  filter?: InputMaybe<PaymentFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetAllSubscribersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetAllUserArgs = {
  filter?: InputMaybe<UserFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetAllUsersV2Args = {
  filter?: InputMaybe<UserV2FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetCourseBasicInfoForEditArgs = {
  slug: Scalars['String']['input'];
};


export type QueryGetCourseDetailsForInstructorArgs = {
  slug: Scalars['String']['input'];
};


export type QueryGetCourseForUserArgs = {
  slug: Scalars['String']['input'];
};


export type QueryGetCoursePreviewDataArgs = {
  slug: Scalars['String']['input'];
};


export type QueryGetEmailFromTokenArgs = {
  token: Scalars['String']['input'];
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


export type QueryGetInstructorCourseContentArgs = {
  slug: Scalars['String']['input'];
};


export type QueryGetInstructorUserV2InfoByIdArgs = {
  _id: Scalars['ID']['input'];
};


export type QueryGetLessonByIdArgs = {
  _id: Scalars['ID']['input'];
};


export type QueryGetLessonV2ByIdForInstructorArgs = {
  _id: Scalars['ID']['input'];
};


export type QueryGetLessonV2byIdForStudentArgs = {
  _id: Scalars['ID']['input'];
};


export type QueryGetLessonsBySectionArgs = {
  sectionId: Scalars['ID']['input'];
};


export type QueryGetLessonsV2BySectionArgs = {
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


export type QueryGetUserByIdArgs = {
  _id: Scalars['ID']['input'];
};


export type QueryGetUserEnrolledCoursesArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetUserEnrolledCoursesCountArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetUserNotEnrolledCoursesArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetUserV2ByIdArgs = {
  _id: Scalars['ID']['input'];
};

export type QuizLesson = LessonV2 & {
  __typename?: 'QuizLesson';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  isFree: Scalars['Boolean']['output'];
  isPublished: Scalars['Boolean']['output'];
  order: Scalars['Int']['output'];
  quizQuestions: Array<QuizQuestion>;
  sectionId: Section;
  title: Scalars['String']['output'];
  type: LessonType;
  updatedAt: Scalars['DateTime']['output'];
};

export type QuizQuestion = {
  __typename?: 'QuizQuestion';
  answers: Array<Scalars['String']['output']>;
  correctAnswer: Scalars['String']['output'];
  question: Scalars['String']['output'];
};

export type QuizQuestionInput = {
  answers: Array<Scalars['String']['input']>;
  correctAnswer: Scalars['String']['input'];
  question: Scalars['String']['input'];
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

export type RegisterUserV2Input = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type RegisterUserV2Response = {
  __typename?: 'RegisterUserV2Response';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  userV2?: Maybe<UserV2>;
};

export enum Role {
  Admin = 'ADMIN',
  Instructor = 'INSTRUCTOR',
  Student = 'STUDENT'
}

export type Section = {
  __typename?: 'Section';
  _id: Scalars['ID']['output'];
  courseId?: Maybe<Course>;
  createdAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  lessonId?: Maybe<Array<Maybe<LessonV2>>>;
  order?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type SendOtpResponse = {
  __typename?: 'SendOTPResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type StudentUserV2 = UserV2 & {
  __typename?: 'StudentUserV2';
  _id: Scalars['ID']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  isVerified: Scalars['Boolean']['output'];
  role: UserV2Role;
  studentId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type SubscribeInput = {
  email: Scalars['String']['input'];
};

export type SubscribeResponse = {
  __typename?: 'SubscribeResponse';
  message: Scalars['String']['output'];
  subscriber?: Maybe<Subscriber>;
  success: Scalars['Boolean']['output'];
};

export type Subscriber = {
  __typename?: 'Subscriber';
  _id: Scalars['ID']['output'];
  email: Scalars['String']['output'];
  subscribedAt: Scalars['DateTime']['output'];
};

export type SubscriberPaginationResult = {
  __typename?: 'SubscriberPaginationResult';
  hasNextPage: Scalars['Boolean']['output'];
  subscribers: Array<Subscriber>;
  totalCount: Scalars['Int']['output'];
};

export type TextLesson = LessonV2 & {
  __typename?: 'TextLesson';
  _id: Scalars['ID']['output'];
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  isFree: Scalars['Boolean']['output'];
  isPublished: Scalars['Boolean']['output'];
  order: Scalars['Int']['output'];
  sectionId: Section;
  title: Scalars['String']['output'];
  type: LessonType;
  updatedAt: Scalars['DateTime']['output'];
};

export type Thumbnail = {
  __typename?: 'Thumbnail';
  format?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['Int']['output']>;
  publicId: Scalars['String']['output'];
  width?: Maybe<Scalars['Int']['output']>;
};

export type ThumbnailInput = {
  format?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  publicId: Scalars['String']['input'];
  width?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateAssignmentLessonV2Input = {
  assignmentDetails: Scalars['String']['input'];
};

export type UpdateCoursePricingInput = {
  amount?: InputMaybe<Scalars['Int']['input']>;
  currency?: InputMaybe<Currency>;
  description?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  planTitle?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCourseResponse = {
  __typename?: 'UpdateCourseResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type UpdateCourseVisibilityAndAccessInput = {
  courseId: Scalars['ID']['input'];
  status: CourseStatus;
};

export type UpdateCourseWhatYouWillLearnInput = {
  points: Array<Scalars['String']['input']>;
};

export type UpdateEnrollmentInput = {
  _id: Scalars['ID']['input'];
  progress?: InputMaybe<Scalars['Float']['input']>;
  status?: InputMaybe<EnrollmentStatus>;
};

export type UpdateFileLessonV2Input = {
  fileUrl: Scalars['String']['input'];
};

export type UpdateInstructorPayoutInfoInput = {
  accountHolderName?: InputMaybe<Scalars['String']['input']>;
  accountNumber?: InputMaybe<Scalars['String']['input']>;
  bankName?: InputMaybe<BankName>;
  payoutMethod?: InputMaybe<PayoutMethod>;
};

export type UpdateInstructorUserV2Input = {
  bio?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLessonInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  isPublished?: InputMaybe<Scalars['Boolean']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  videoUrl?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLessonV2Response = {
  __typename?: 'UpdateLessonV2Response';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type UpdateLessonV2VideoInput = {
  duration?: InputMaybe<Scalars['Float']['input']>;
  muxAssetId?: InputMaybe<Scalars['String']['input']>;
  muxPlaybackId?: InputMaybe<Scalars['String']['input']>;
  muxUploadId?: InputMaybe<Scalars['String']['input']>;
  passthrough?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateQuizLessonV2Input = {
  quizQuestions: Array<QuizQuestionInput>;
};

export type UpdateSectionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSectionResponse = {
  __typename?: 'UpdateSectionResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type UpdateTextLessonV2Input = {
  content: Scalars['String']['input'];
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Role>;
};

export type UpdateUserV2Response = {
  __typename?: 'UpdateUserV2Response';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type UploadProfilePictureInput = {
  format?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  publicId: Scalars['String']['input'];
  width?: InputMaybe<Scalars['Int']['input']>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  isVerified: Scalars['Boolean']['output'];
  role: Role;
  studentId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UserFilterInput = {
  isVerified?: InputMaybe<Scalars['Boolean']['input']>;
  role?: InputMaybe<Role>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type UserPaginationResult = {
  __typename?: 'UserPaginationResult';
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
  users: Array<User>;
};

export type UserV2 = {
  _id: Scalars['ID']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  isVerified: Scalars['Boolean']['output'];
  role: UserV2Role;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UserV2FilterInput = {
  isVerified?: InputMaybe<Scalars['Boolean']['input']>;
  role?: InputMaybe<UserV2Role>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type UserV2PaginationResult = {
  __typename?: 'UserV2PaginationResult';
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
  users: Array<UserV2>;
};

export enum UserV2Role {
  Admin = 'ADMIN',
  Instructor = 'INSTRUCTOR',
  Student = 'STUDENT'
}

export type VerifyOtpResponse = {
  __typename?: 'VerifyOTPResponse';
  message: Scalars['String']['output'];
  signInToken?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type VideoLesson = LessonV2 & {
  __typename?: 'VideoLesson';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  duration?: Maybe<Scalars['Float']['output']>;
  isFree: Scalars['Boolean']['output'];
  isPublished: Scalars['Boolean']['output'];
  muxAssetId?: Maybe<Scalars['String']['output']>;
  muxPlaybackId?: Maybe<Scalars['String']['output']>;
  muxUploadId?: Maybe<Scalars['String']['output']>;
  order: Scalars['Int']['output'];
  passthrough?: Maybe<Scalars['String']['output']>;
  sectionId: Section;
  status?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  type: LessonType;
  updatedAt: Scalars['DateTime']['output'];
};

export type GetCourseDetailsForInstructorResponse = {
  __typename?: 'getCourseDetailsForInstructorResponse';
  course?: Maybe<Course>;
  totalEnrollment?: Maybe<Scalars['Int']['output']>;
  totalLessons?: Maybe<Scalars['Int']['output']>;
  totalSections?: Maybe<Scalars['Int']['output']>;
};

export type GetCoursePreviewDataResponse = {
  __typename?: 'getCoursePreviewDataResponse';
  course?: Maybe<Course>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  totalAllLessonsVideosHours?: Maybe<Scalars['Int']['output']>;
  totalLessons?: Maybe<Scalars['Int']['output']>;
  totalSections?: Maybe<Scalars['Int']['output']>;
};

export type MarkLessonAsCompletedInput = {
  enrollmentId: Scalars['ID']['input'];
  lessonId: Scalars['ID']['input'];
};

export type UndoLessonCompletionInput = {
  enrollmentId: Scalars['ID']['input'];
  lessonId: Scalars['ID']['input'];
};

export type UpdateLessonV2GeneralInfoInput = {
  isFree?: InputMaybe<Scalars['Boolean']['input']>;
  isPublished?: InputMaybe<Scalars['Boolean']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type GenerateTempTokenMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type GenerateTempTokenMutation = { __typename?: 'Mutation', generateTempToken: { __typename?: 'GenerateTempTokenResponse', token: string } };

export type SendOtpMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type SendOtpMutation = { __typename?: 'Mutation', sendOTP: { __typename?: 'SendOTPResponse', success: boolean, message?: string | null } };

export type VerifyOtpMutationVariables = Exact<{
  email: Scalars['String']['input'];
  otp: Scalars['String']['input'];
}>;


export type VerifyOtpMutation = { __typename?: 'Mutation', verifyOTP: { __typename?: 'VerifyOTPResponse', success: boolean, message: string, signInToken?: string | null } };

export type GetEmailFromTokenQueryVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type GetEmailFromTokenQuery = { __typename?: 'Query', getEmailFromToken: { __typename?: 'GetEmailFromTokenResponse', email: string } };

export type CreateCourseMutationVariables = Exact<{
  input: CreateCourseInput;
}>;


export type CreateCourseMutation = { __typename?: 'Mutation', createCourse: { __typename?: 'Course', _id: string } };

export type UpdateCourseBasicInfoMutationVariables = Exact<{
  courseId: Scalars['ID']['input'];
  input: CourseBasicInfoInput;
}>;


export type UpdateCourseBasicInfoMutation = { __typename?: 'Mutation', updateCourseBasicInfo: { __typename?: 'Course', _id: string } };

export type UpdateCoursePricingMutationVariables = Exact<{
  courseId: Scalars['ID']['input'];
  input: UpdateCoursePricingInput;
}>;


export type UpdateCoursePricingMutation = { __typename?: 'Mutation', updateCoursePricing: { __typename?: 'Course', _id: string } };

export type UpdateCoursePricingV2MutationVariables = Exact<{
  courseId: Scalars['ID']['input'];
  input: UpdateCoursePricingInput;
}>;


export type UpdateCoursePricingV2Mutation = { __typename?: 'Mutation', updateCoursePricingV2: { __typename?: 'UpdateCourseResponse', success: boolean, message: string } };

export type UpdateCourseThumbnailMutationVariables = Exact<{
  courseId: Scalars['ID']['input'];
  input: ThumbnailInput;
}>;


export type UpdateCourseThumbnailMutation = { __typename?: 'Mutation', updateCourseThumbnail: { __typename?: 'Course', _id: string } };

export type UpdateCourseVisibilityAndAccessMutationVariables = Exact<{
  input: UpdateCourseVisibilityAndAccessInput;
}>;


export type UpdateCourseVisibilityAndAccessMutation = { __typename?: 'Mutation', updateCourseVisibilityAndAccess: { __typename?: 'Course', _id: string } };

export type UpdateCourseWhatYouWillLearnMutationVariables = Exact<{
  courseId: Scalars['ID']['input'];
  input: UpdateCourseWhatYouWillLearnInput;
}>;


export type UpdateCourseWhatYouWillLearnMutation = { __typename?: 'Mutation', updateCourseWhatYouWillLearn: { __typename?: 'Course', _id: string } };

export type GetAllCourseQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCourseQuery = { __typename?: 'Query', getAllCourse: Array<{ __typename?: 'Course', _id: string, title: string, slug?: string | null, courseCode?: string | null, status?: CourseStatus | null }> };

export type GetAllCourseWithEnrollmentQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCourseWithEnrollmentQuery = { __typename?: 'Query', getAllCourseWithEnrollment: Array<{ __typename?: 'Course', _id: string, title: string, slug?: string | null, isEnrolled?: boolean | null, thumbnail?: { __typename?: 'Thumbnail', publicId: string, width?: number | null, height?: number | null, format?: string | null } | null }> };

export type GetCourseForUserQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetCourseForUserQuery = { __typename?: 'Query', getCourseForUser: { __typename?: 'CourseForUserPayload', status: CourseAccessStatus, fullContent?: { __typename?: 'Course', _id: string, title: string, slug?: string | null, status?: CourseStatus | null, sectionId?: Array<{ __typename?: 'Section', _id: string, title?: string | null, description?: string | null, order?: number | null, lessonId?: Array<{ __typename?: 'AssignmentLesson', _id: string, title: string, order: number, isPublished: boolean, type: LessonType } | { __typename?: 'FileLesson', _id: string, title: string, order: number, isPublished: boolean, type: LessonType } | { __typename?: 'QuizLesson', _id: string, title: string, order: number, isPublished: boolean, type: LessonType } | { __typename?: 'TextLesson', _id: string, title: string, order: number, isPublished: boolean, type: LessonType } | { __typename?: 'VideoLesson', _id: string, title: string, order: number, isPublished: boolean, type: LessonType } | null> | null } | null> | null } | null, coursePreviewData?: { __typename?: 'Course', _id: string, title: string, slug?: string | null, description?: string | null, courseCode?: string | null, difficulty?: Difficulty | null, category?: string | null, status?: CourseStatus | null, whatYouWillLearn?: Array<string | null> | null, thumbnail?: { __typename?: 'Thumbnail', publicId: string, width?: number | null, height?: number | null, format?: string | null } | null, price?: { __typename?: 'PricingPlan', planTitle?: string | null, description?: Array<string | null> | null, amount?: number | null, currency?: Currency | null } | null } | null } };

export type GetUserEnrolledCoursesCountQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserEnrolledCoursesCountQuery = { __typename?: 'Query', getUserEnrolledCoursesCount: { __typename?: 'GetUserEnrolledCoursesCountResponse', totalCourses: number, completedCount: number, inProgressCount: number, courseCompletionPercentage: number } };

export type GetUserNotEnrolledCoursesQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetUserNotEnrolledCoursesQuery = { __typename?: 'Query', getUserNotEnrolledCourses?: Array<{ __typename?: 'Course', _id: string, title: string, slug?: string | null, thumbnail?: { __typename?: 'Thumbnail', publicId: string, width?: number | null, height?: number | null, format?: string | null } | null, price?: { __typename?: 'PricingPlan', planTitle?: string | null, description?: Array<string | null> | null, amount?: number | null, currency?: Currency | null } | null } | null> | null };

export type GetAllCoursesByInstructurIdQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCoursesByInstructurIdQuery = { __typename?: 'Query', getAllCoursesByInstructurId?: Array<{ __typename?: 'Course', _id: string, title: string, slug?: string | null, courseCode?: string | null, status?: CourseStatus | null } | null> | null };

export type GetCourseDetailsForInstructorQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetCourseDetailsForInstructorQuery = { __typename?: 'Query', getCourseDetailsForInstructor?: { __typename?: 'getCourseDetailsForInstructorResponse', totalSections?: number | null, totalLessons?: number | null, totalEnrollment?: number | null, course?: { __typename?: 'Course', _id: string, title: string, slug?: string | null, courseCode?: string | null, status?: CourseStatus | null, updatedAt?: Date | null } | null } | null };

export type GetCourseBasicInfoForEditQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetCourseBasicInfoForEditQuery = { __typename?: 'Query', getCourseBasicInfoForEdit?: { __typename?: 'Course', _id: string, title: string, subtitle?: string | null, slug?: string | null, description?: string | null, requirements?: string | null, courseCode?: string | null, difficulty?: Difficulty | null, category?: string | null, status?: CourseStatus | null, updatedAt?: Date | null, whoIsThisFor?: string | null, whatYouWillLearn?: Array<string | null> | null, thumbnail?: { __typename?: 'Thumbnail', publicId: string, width?: number | null, height?: number | null, format?: string | null } | null, price?: { __typename?: 'PricingPlan', planTitle?: string | null, description?: Array<string | null> | null, amount?: number | null, currency?: Currency | null } | null } | null };

export type GetCoursePreviewDataQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetCoursePreviewDataQuery = { __typename?: 'Query', getCoursePreviewData?: { __typename?: 'getCoursePreviewDataResponse', success: boolean, message?: string | null, totalSections?: number | null, totalLessons?: number | null, totalAllLessonsVideosHours?: number | null, course?: { __typename?: 'Course', _id: string, title: string, subtitle?: string | null, slug?: string | null, description?: string | null, requirements?: string | null, courseCode?: string | null, difficulty?: Difficulty | null, category?: string | null, whatYouWillLearn?: Array<string | null> | null, whoIsThisFor?: string | null, updatedAt?: Date | null, createdBy?: { __typename?: 'InstructorUserV2', email: string, role: UserV2Role, fullName?: string | null, bio?: string | null, profilePicture?: { __typename?: 'ProfilePicture', publicId: string, width?: number | null, height?: number | null, format?: string | null } | null } | null, price?: { __typename?: 'PricingPlan', planTitle?: string | null, description?: Array<string | null> | null, amount?: number | null, currency?: Currency | null } | null, sectionId?: Array<{ __typename?: 'Section', _id: string, title?: string | null, description?: string | null, order?: number | null, lessonId?: Array<{ __typename?: 'AssignmentLesson', _id: string, title: string, order: number, type: LessonType } | { __typename?: 'FileLesson', _id: string, title: string, order: number, type: LessonType } | { __typename?: 'QuizLesson', _id: string, title: string, order: number, type: LessonType } | { __typename?: 'TextLesson', _id: string, title: string, order: number, type: LessonType } | { __typename?: 'VideoLesson', _id: string, title: string, order: number, type: LessonType } | null> | null } | null> | null } | null } | null };

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
}>;


export type CheckEnrollmentQuery = { __typename?: 'Query', checkEnrollment?: { __typename?: 'Enrollment', _id: string, status?: EnrollmentStatus | null, expiryDate?: string | null, courseId?: { __typename?: 'Course', _id: string } | null, userId?: { __typename?: 'User', _id: string } | null } | null };

export type GetUserEnrolledCoursesQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetUserEnrolledCoursesQuery = { __typename?: 'Query', getUserEnrolledCourses?: Array<{ __typename?: 'Enrollment', _id: string, progress?: number | null, lastAccessedAt?: Date | null, courseId?: { __typename?: 'Course', _id: string, title: string, slug?: string | null, thumbnail?: { __typename?: 'Thumbnail', publicId: string, width?: number | null, height?: number | null, format?: string | null } | null } | null } | null> | null };

export type GetInstructorCourseContentQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetInstructorCourseContentQuery = { __typename?: 'Query', getInstructorCourseContent?: { __typename?: 'Course', _id: string, sectionId?: Array<{ __typename?: 'Section', _id: string, title?: string | null, description?: string | null, order?: number | null, lessonId?: Array<{ __typename?: 'AssignmentLesson', assignmentDetails?: string | null, _id: string, title: string, isPublished: boolean, order: number, type: LessonType, sectionId: { __typename?: 'Section', courseId?: { __typename?: 'Course', slug?: string | null } | null } } | { __typename?: 'FileLesson', fileUrl?: string | null, _id: string, title: string, isPublished: boolean, order: number, type: LessonType, sectionId: { __typename?: 'Section', courseId?: { __typename?: 'Course', slug?: string | null } | null } } | { __typename?: 'QuizLesson', _id: string, title: string, isPublished: boolean, order: number, type: LessonType, quizQuestions: Array<{ __typename?: 'QuizQuestion', question: string, answers: Array<string>, correctAnswer: string }>, sectionId: { __typename?: 'Section', courseId?: { __typename?: 'Course', slug?: string | null } | null } } | { __typename?: 'TextLesson', content?: string | null, _id: string, title: string, isPublished: boolean, order: number, type: LessonType, sectionId: { __typename?: 'Section', courseId?: { __typename?: 'Course', slug?: string | null } | null } } | { __typename?: 'VideoLesson', duration?: number | null, _id: string, title: string, isPublished: boolean, order: number, type: LessonType, sectionId: { __typename?: 'Section', courseId?: { __typename?: 'Course', slug?: string | null } | null } } | null> | null } | null> | null } | null };

export type CreateLessonMutationVariables = Exact<{
  input: CreateLessonInput;
}>;


export type CreateLessonMutation = { __typename?: 'Mutation', createLesson: { __typename?: 'CreateLessonResponse', success: boolean, message: string } };

export type CreateLessonV2MutationVariables = Exact<{
  input: CreateLessonV2Input;
}>;


export type CreateLessonV2Mutation = { __typename?: 'Mutation', createLessonV2: { __typename?: 'CreateLessonV2Response', success: boolean, message: string } };

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

export type DeleteLessonV2MutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteLessonV2Mutation = { __typename?: 'Mutation', deleteLessonV2: { __typename?: 'DeleteLessonV2Response', success: boolean, message?: string | null } };

export type CreateMuxUploadUrlMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateMuxUploadUrlMutation = { __typename?: 'Mutation', createMuxUploadUrl: { __typename?: 'MuxUpload', uploadId: string, uploadUrl: string, passthrough: string } };

export type UpdateLessonV2GeneralInfoMutationVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<UpdateLessonV2GeneralInfoInput>;
}>;


export type UpdateLessonV2GeneralInfoMutation = { __typename?: 'Mutation', updateLessonV2GeneralInfo: { __typename?: 'UpdateLessonV2Response', success: boolean, message: string } };

export type UpdateLessonV2VideoMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateLessonV2VideoInput;
}>;


export type UpdateLessonV2VideoMutation = { __typename?: 'Mutation', updateLessonV2Video: { __typename?: 'UpdateLessonV2Response', success: boolean, message: string } };

export type GetLessonV2ByIdForInstructorQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetLessonV2ByIdForInstructorQuery = { __typename?: 'Query', getLessonV2ByIdForInstructor: { __typename?: 'AssignmentLesson', assignmentDetails?: string | null, _id: string, title: string, order: number, isPublished: boolean, isFree: boolean, createdAt: Date, updatedAt: Date, type: LessonType, sectionId: { __typename?: 'Section', _id: string, courseId?: { __typename?: 'Course', _id: string, slug?: string | null } | null } } | { __typename?: 'FileLesson', fileUrl?: string | null, _id: string, title: string, order: number, isPublished: boolean, isFree: boolean, createdAt: Date, updatedAt: Date, type: LessonType, sectionId: { __typename?: 'Section', _id: string, courseId?: { __typename?: 'Course', _id: string, slug?: string | null } | null } } | { __typename?: 'QuizLesson', _id: string, title: string, order: number, isPublished: boolean, isFree: boolean, createdAt: Date, updatedAt: Date, type: LessonType, quizQuestions: Array<{ __typename?: 'QuizQuestion', question: string, answers: Array<string>, correctAnswer: string }>, sectionId: { __typename?: 'Section', _id: string, courseId?: { __typename?: 'Course', _id: string, slug?: string | null } | null } } | { __typename?: 'TextLesson', content?: string | null, _id: string, title: string, order: number, isPublished: boolean, isFree: boolean, createdAt: Date, updatedAt: Date, type: LessonType, sectionId: { __typename?: 'Section', _id: string, courseId?: { __typename?: 'Course', _id: string, slug?: string | null } | null } } | { __typename?: 'VideoLesson', passthrough?: string | null, muxUploadId?: string | null, muxAssetId?: string | null, muxPlaybackId?: string | null, status?: string | null, duration?: number | null, _id: string, title: string, order: number, isPublished: boolean, isFree: boolean, createdAt: Date, updatedAt: Date, type: LessonType, sectionId: { __typename?: 'Section', _id: string, courseId?: { __typename?: 'Course', _id: string, slug?: string | null } | null } } };

export type GetLessonV2byIdForStudentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetLessonV2byIdForStudentQuery = { __typename?: 'Query', getLessonV2byIdForStudent: { __typename?: 'AssignmentLesson', assignmentDetails?: string | null, _id: string, title: string, order: number, type: LessonType } | { __typename?: 'FileLesson', fileUrl?: string | null, _id: string, title: string, order: number, type: LessonType } | { __typename?: 'QuizLesson', _id: string, title: string, order: number, type: LessonType, quizQuestions: Array<{ __typename?: 'QuizQuestion', question: string, answers: Array<string>, correctAnswer: string }> } | { __typename?: 'TextLesson', content?: string | null, _id: string, title: string, order: number, type: LessonType } | { __typename?: 'VideoLesson', muxPlaybackId?: string | null, _id: string, title: string, order: number, type: LessonType } };

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

export type GetAllPaymentsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  filter?: InputMaybe<PaymentFilterInput>;
}>;


export type GetAllPaymentsQuery = { __typename?: 'Query', getAllPayments: { __typename?: 'PaymentPaginationResult', totalCount: number, totalAmount: number, hasNextPage: boolean, payments: Array<{ __typename?: 'Payment', _id: string, amount: number, transactionNote: string, status: PaymentStatus, paymentMethod: PaymentMethod, refundReason?: string | null, createdAt: Date, userId: { __typename?: 'User', _id: string, email: string }, courseId: { __typename?: 'Course', _id: string, title: string } }> } };

export type GetPaymentByUserAndCourseQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
  courseId: Scalars['ID']['input'];
}>;


export type GetPaymentByUserAndCourseQuery = { __typename?: 'Query', getPaymentByUserAndCourse?: { __typename?: 'Payment', _id: string, amount: number, transactionNote: string, status: PaymentStatus, paymentMethod: PaymentMethod, refundReason?: string | null, createdAt: Date, userId: { __typename?: 'User', _id: string, email: string }, courseId: { __typename?: 'Course', _id: string, title: string } } | null };

export type CreateSectionMutationVariables = Exact<{
  input?: InputMaybe<CreateSectionInput>;
}>;


export type CreateSectionMutation = { __typename?: 'Mutation', createSection: { __typename?: 'CreateSectionResponse', success: boolean, message: string } };

export type UpdateSectionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateSectionInput;
}>;


export type UpdateSectionMutation = { __typename?: 'Mutation', updateSection: { __typename?: 'UpdateSectionResponse', success: boolean, message: string } };

export type DeleteSectionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteSectionMutation = { __typename?: 'Mutation', deleteSection: { __typename?: 'DeleteSectionResponse', success: boolean, message?: string | null } };

export type CreateSubscriberMutationVariables = Exact<{
  input: SubscribeInput;
}>;


export type CreateSubscriberMutation = { __typename?: 'Mutation', createSubscriber: { __typename?: 'SubscribeResponse', success: boolean, message: string, subscriber?: { __typename?: 'Subscriber', email: string } | null } };

export type GetAllSubscribersQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllSubscribersQuery = { __typename?: 'Query', getAllSubscribers: { __typename?: 'SubscriberPaginationResult', totalCount: number, hasNextPage: boolean, subscribers: Array<{ __typename?: 'Subscriber', _id: string, email: string, subscribedAt: Date }> } };

export type CreateUserMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'RegisterResponse', message: string, user: { __typename?: 'User', _id: string, email: string, studentId?: string | null, role: Role, isVerified: boolean } } };

export type GetAllUserQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<UserFilterInput>;
}>;


export type GetAllUserQuery = { __typename?: 'Query', getAllUser: { __typename?: 'UserPaginationResult', totalCount: number, hasNextPage: boolean, users: Array<{ __typename?: 'User', _id: string, email: string, studentId?: string | null, role: Role, isVerified: boolean, createdAt?: Date | null, updatedAt?: Date | null }> } };

export type GetUserByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserByIdQuery = { __typename?: 'Query', getUserById: { __typename?: 'User', _id: string, email: string, studentId?: string | null, role: Role, isVerified: boolean } };

export type RegisterUserV2MutationVariables = Exact<{
  input: RegisterUserV2Input;
}>;


export type RegisterUserV2Mutation = { __typename?: 'Mutation', registerUserV2: { __typename?: 'RegisterUserV2Response', success: boolean, message: string, userV2?: { __typename?: 'AdminUserV2', _id: string, email: string, isVerified: boolean, role: UserV2Role } | { __typename?: 'InstructorUserV2', _id: string, email: string, isVerified: boolean, role: UserV2Role } | { __typename?: 'StudentUserV2', _id: string, email: string, isVerified: boolean, role: UserV2Role } | null } };

export type UpdateInstructorUserV2MutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateInstructorUserV2Input;
}>;


export type UpdateInstructorUserV2Mutation = { __typename?: 'Mutation', updateInstructorUserV2: { __typename?: 'UpdateUserV2Response', success: boolean, message: string } };

export type UpdateInstructorProfilePictureMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UploadProfilePictureInput;
}>;


export type UpdateInstructorProfilePictureMutation = { __typename?: 'Mutation', updateInstructorProfilePicture: { __typename?: 'UpdateUserV2Response', success: boolean, message: string } };

export type ChangeUserPasswordMutationVariables = Exact<{
  input: ChangePasswordInput;
}>;


export type ChangeUserPasswordMutation = { __typename?: 'Mutation', changeUserPassword: { __typename?: 'ChangePasswordResponse', success: boolean, message: string } };

export type UpdateInstructorPayoutInfoMutationVariables = Exact<{
  input: UpdateInstructorPayoutInfoInput;
}>;


export type UpdateInstructorPayoutInfoMutation = { __typename?: 'Mutation', updateInstructorPayoutInfo: { __typename?: 'UpdateUserV2Response', success: boolean, message: string } };

export type GetUserV2ByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserV2ByIdQuery = { __typename?: 'Query', getUserV2ById: { __typename?: 'AdminUserV2', adminLevel?: number | null, _id: string, email: string, isVerified: boolean, role: UserV2Role } | { __typename?: 'InstructorUserV2', fullName?: string | null, bio?: string | null, _id: string, email: string, isVerified: boolean, role: UserV2Role, profilePicture?: { __typename?: 'ProfilePicture', publicId: string, width?: number | null, height?: number | null, format?: string | null } | null } | { __typename?: 'StudentUserV2', studentId?: string | null, _id: string, email: string, isVerified: boolean, role: UserV2Role } };

export type GetInstructorUserV2InfoByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetInstructorUserV2InfoByIdQuery = { __typename?: 'Query', getInstructorUserV2InfoById: { __typename?: 'InstructorUserV2', _id: string, email: string, isVerified: boolean, createdAt?: Date | null, updatedAt?: Date | null, role: UserV2Role, fullName?: string | null, bio?: string | null, profilePicture?: { __typename?: 'ProfilePicture', publicId: string, width?: number | null, height?: number | null, format?: string | null } | null, payout?: { __typename?: 'InstructorPayoutInfo', payoutMethod?: PayoutMethod | null, bankName?: BankName | null, accountHolderName?: string | null, accountNumber?: string | null } | null } };


export const GenerateTempTokenDocument = gql`
    mutation GenerateTempToken($email: String!) {
  generateTempToken(email: $email) {
    token
  }
}
    `;
export type GenerateTempTokenMutationFn = Apollo.MutationFunction<GenerateTempTokenMutation, GenerateTempTokenMutationVariables>;

/**
 * __useGenerateTempTokenMutation__
 *
 * To run a mutation, you first call `useGenerateTempTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateTempTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateTempTokenMutation, { data, loading, error }] = useGenerateTempTokenMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useGenerateTempTokenMutation(baseOptions?: Apollo.MutationHookOptions<GenerateTempTokenMutation, GenerateTempTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateTempTokenMutation, GenerateTempTokenMutationVariables>(GenerateTempTokenDocument, options);
      }
export type GenerateTempTokenMutationHookResult = ReturnType<typeof useGenerateTempTokenMutation>;
export type GenerateTempTokenMutationResult = Apollo.MutationResult<GenerateTempTokenMutation>;
export type GenerateTempTokenMutationOptions = Apollo.BaseMutationOptions<GenerateTempTokenMutation, GenerateTempTokenMutationVariables>;
export const SendOtpDocument = gql`
    mutation SendOTP($email: String!) {
  sendOTP(email: $email) {
    success
    message
  }
}
    `;
export type SendOtpMutationFn = Apollo.MutationFunction<SendOtpMutation, SendOtpMutationVariables>;

/**
 * __useSendOtpMutation__
 *
 * To run a mutation, you first call `useSendOtpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendOtpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendOtpMutation, { data, loading, error }] = useSendOtpMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useSendOtpMutation(baseOptions?: Apollo.MutationHookOptions<SendOtpMutation, SendOtpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendOtpMutation, SendOtpMutationVariables>(SendOtpDocument, options);
      }
export type SendOtpMutationHookResult = ReturnType<typeof useSendOtpMutation>;
export type SendOtpMutationResult = Apollo.MutationResult<SendOtpMutation>;
export type SendOtpMutationOptions = Apollo.BaseMutationOptions<SendOtpMutation, SendOtpMutationVariables>;
export const VerifyOtpDocument = gql`
    mutation VerifyOTP($email: String!, $otp: String!) {
  verifyOTP(email: $email, otp: $otp) {
    success
    message
    signInToken
  }
}
    `;
export type VerifyOtpMutationFn = Apollo.MutationFunction<VerifyOtpMutation, VerifyOtpMutationVariables>;

/**
 * __useVerifyOtpMutation__
 *
 * To run a mutation, you first call `useVerifyOtpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyOtpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyOtpMutation, { data, loading, error }] = useVerifyOtpMutation({
 *   variables: {
 *      email: // value for 'email'
 *      otp: // value for 'otp'
 *   },
 * });
 */
export function useVerifyOtpMutation(baseOptions?: Apollo.MutationHookOptions<VerifyOtpMutation, VerifyOtpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyOtpMutation, VerifyOtpMutationVariables>(VerifyOtpDocument, options);
      }
export type VerifyOtpMutationHookResult = ReturnType<typeof useVerifyOtpMutation>;
export type VerifyOtpMutationResult = Apollo.MutationResult<VerifyOtpMutation>;
export type VerifyOtpMutationOptions = Apollo.BaseMutationOptions<VerifyOtpMutation, VerifyOtpMutationVariables>;
export const GetEmailFromTokenDocument = gql`
    query GetEmailFromToken($token: String!) {
  getEmailFromToken(token: $token) {
    email
  }
}
    `;

/**
 * __useGetEmailFromTokenQuery__
 *
 * To run a query within a React component, call `useGetEmailFromTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEmailFromTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEmailFromTokenQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useGetEmailFromTokenQuery(baseOptions: Apollo.QueryHookOptions<GetEmailFromTokenQuery, GetEmailFromTokenQueryVariables> & ({ variables: GetEmailFromTokenQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEmailFromTokenQuery, GetEmailFromTokenQueryVariables>(GetEmailFromTokenDocument, options);
      }
export function useGetEmailFromTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEmailFromTokenQuery, GetEmailFromTokenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEmailFromTokenQuery, GetEmailFromTokenQueryVariables>(GetEmailFromTokenDocument, options);
        }
export function useGetEmailFromTokenSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEmailFromTokenQuery, GetEmailFromTokenQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEmailFromTokenQuery, GetEmailFromTokenQueryVariables>(GetEmailFromTokenDocument, options);
        }
export type GetEmailFromTokenQueryHookResult = ReturnType<typeof useGetEmailFromTokenQuery>;
export type GetEmailFromTokenLazyQueryHookResult = ReturnType<typeof useGetEmailFromTokenLazyQuery>;
export type GetEmailFromTokenSuspenseQueryHookResult = ReturnType<typeof useGetEmailFromTokenSuspenseQuery>;
export type GetEmailFromTokenQueryResult = Apollo.QueryResult<GetEmailFromTokenQuery, GetEmailFromTokenQueryVariables>;
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
export const UpdateCourseBasicInfoDocument = gql`
    mutation UpdateCourseBasicInfo($courseId: ID!, $input: CourseBasicInfoInput!) {
  updateCourseBasicInfo(courseId: $courseId, input: $input) {
    _id
  }
}
    `;
export type UpdateCourseBasicInfoMutationFn = Apollo.MutationFunction<UpdateCourseBasicInfoMutation, UpdateCourseBasicInfoMutationVariables>;

/**
 * __useUpdateCourseBasicInfoMutation__
 *
 * To run a mutation, you first call `useUpdateCourseBasicInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCourseBasicInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCourseBasicInfoMutation, { data, loading, error }] = useUpdateCourseBasicInfoMutation({
 *   variables: {
 *      courseId: // value for 'courseId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCourseBasicInfoMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCourseBasicInfoMutation, UpdateCourseBasicInfoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCourseBasicInfoMutation, UpdateCourseBasicInfoMutationVariables>(UpdateCourseBasicInfoDocument, options);
      }
export type UpdateCourseBasicInfoMutationHookResult = ReturnType<typeof useUpdateCourseBasicInfoMutation>;
export type UpdateCourseBasicInfoMutationResult = Apollo.MutationResult<UpdateCourseBasicInfoMutation>;
export type UpdateCourseBasicInfoMutationOptions = Apollo.BaseMutationOptions<UpdateCourseBasicInfoMutation, UpdateCourseBasicInfoMutationVariables>;
export const UpdateCoursePricingDocument = gql`
    mutation UpdateCoursePricing($courseId: ID!, $input: UpdateCoursePricingInput!) {
  updateCoursePricing(courseId: $courseId, input: $input) {
    _id
  }
}
    `;
export type UpdateCoursePricingMutationFn = Apollo.MutationFunction<UpdateCoursePricingMutation, UpdateCoursePricingMutationVariables>;

/**
 * __useUpdateCoursePricingMutation__
 *
 * To run a mutation, you first call `useUpdateCoursePricingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCoursePricingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCoursePricingMutation, { data, loading, error }] = useUpdateCoursePricingMutation({
 *   variables: {
 *      courseId: // value for 'courseId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCoursePricingMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCoursePricingMutation, UpdateCoursePricingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCoursePricingMutation, UpdateCoursePricingMutationVariables>(UpdateCoursePricingDocument, options);
      }
export type UpdateCoursePricingMutationHookResult = ReturnType<typeof useUpdateCoursePricingMutation>;
export type UpdateCoursePricingMutationResult = Apollo.MutationResult<UpdateCoursePricingMutation>;
export type UpdateCoursePricingMutationOptions = Apollo.BaseMutationOptions<UpdateCoursePricingMutation, UpdateCoursePricingMutationVariables>;
export const UpdateCoursePricingV2Document = gql`
    mutation UpdateCoursePricingV2($courseId: ID!, $input: UpdateCoursePricingInput!) {
  updateCoursePricingV2(courseId: $courseId, input: $input) {
    success
    message
  }
}
    `;
export type UpdateCoursePricingV2MutationFn = Apollo.MutationFunction<UpdateCoursePricingV2Mutation, UpdateCoursePricingV2MutationVariables>;

/**
 * __useUpdateCoursePricingV2Mutation__
 *
 * To run a mutation, you first call `useUpdateCoursePricingV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCoursePricingV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCoursePricingV2Mutation, { data, loading, error }] = useUpdateCoursePricingV2Mutation({
 *   variables: {
 *      courseId: // value for 'courseId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCoursePricingV2Mutation(baseOptions?: Apollo.MutationHookOptions<UpdateCoursePricingV2Mutation, UpdateCoursePricingV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCoursePricingV2Mutation, UpdateCoursePricingV2MutationVariables>(UpdateCoursePricingV2Document, options);
      }
export type UpdateCoursePricingV2MutationHookResult = ReturnType<typeof useUpdateCoursePricingV2Mutation>;
export type UpdateCoursePricingV2MutationResult = Apollo.MutationResult<UpdateCoursePricingV2Mutation>;
export type UpdateCoursePricingV2MutationOptions = Apollo.BaseMutationOptions<UpdateCoursePricingV2Mutation, UpdateCoursePricingV2MutationVariables>;
export const UpdateCourseThumbnailDocument = gql`
    mutation UpdateCourseThumbnail($courseId: ID!, $input: ThumbnailInput!) {
  updateCourseThumbnail(courseId: $courseId, input: $input) {
    _id
  }
}
    `;
export type UpdateCourseThumbnailMutationFn = Apollo.MutationFunction<UpdateCourseThumbnailMutation, UpdateCourseThumbnailMutationVariables>;

/**
 * __useUpdateCourseThumbnailMutation__
 *
 * To run a mutation, you first call `useUpdateCourseThumbnailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCourseThumbnailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCourseThumbnailMutation, { data, loading, error }] = useUpdateCourseThumbnailMutation({
 *   variables: {
 *      courseId: // value for 'courseId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCourseThumbnailMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCourseThumbnailMutation, UpdateCourseThumbnailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCourseThumbnailMutation, UpdateCourseThumbnailMutationVariables>(UpdateCourseThumbnailDocument, options);
      }
export type UpdateCourseThumbnailMutationHookResult = ReturnType<typeof useUpdateCourseThumbnailMutation>;
export type UpdateCourseThumbnailMutationResult = Apollo.MutationResult<UpdateCourseThumbnailMutation>;
export type UpdateCourseThumbnailMutationOptions = Apollo.BaseMutationOptions<UpdateCourseThumbnailMutation, UpdateCourseThumbnailMutationVariables>;
export const UpdateCourseVisibilityAndAccessDocument = gql`
    mutation UpdateCourseVisibilityAndAccess($input: UpdateCourseVisibilityAndAccessInput!) {
  updateCourseVisibilityAndAccess(input: $input) {
    _id
  }
}
    `;
export type UpdateCourseVisibilityAndAccessMutationFn = Apollo.MutationFunction<UpdateCourseVisibilityAndAccessMutation, UpdateCourseVisibilityAndAccessMutationVariables>;

/**
 * __useUpdateCourseVisibilityAndAccessMutation__
 *
 * To run a mutation, you first call `useUpdateCourseVisibilityAndAccessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCourseVisibilityAndAccessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCourseVisibilityAndAccessMutation, { data, loading, error }] = useUpdateCourseVisibilityAndAccessMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCourseVisibilityAndAccessMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCourseVisibilityAndAccessMutation, UpdateCourseVisibilityAndAccessMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCourseVisibilityAndAccessMutation, UpdateCourseVisibilityAndAccessMutationVariables>(UpdateCourseVisibilityAndAccessDocument, options);
      }
export type UpdateCourseVisibilityAndAccessMutationHookResult = ReturnType<typeof useUpdateCourseVisibilityAndAccessMutation>;
export type UpdateCourseVisibilityAndAccessMutationResult = Apollo.MutationResult<UpdateCourseVisibilityAndAccessMutation>;
export type UpdateCourseVisibilityAndAccessMutationOptions = Apollo.BaseMutationOptions<UpdateCourseVisibilityAndAccessMutation, UpdateCourseVisibilityAndAccessMutationVariables>;
export const UpdateCourseWhatYouWillLearnDocument = gql`
    mutation UpdateCourseWhatYouWillLearn($courseId: ID!, $input: UpdateCourseWhatYouWillLearnInput!) {
  updateCourseWhatYouWillLearn(courseId: $courseId, input: $input) {
    _id
  }
}
    `;
export type UpdateCourseWhatYouWillLearnMutationFn = Apollo.MutationFunction<UpdateCourseWhatYouWillLearnMutation, UpdateCourseWhatYouWillLearnMutationVariables>;

/**
 * __useUpdateCourseWhatYouWillLearnMutation__
 *
 * To run a mutation, you first call `useUpdateCourseWhatYouWillLearnMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCourseWhatYouWillLearnMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCourseWhatYouWillLearnMutation, { data, loading, error }] = useUpdateCourseWhatYouWillLearnMutation({
 *   variables: {
 *      courseId: // value for 'courseId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCourseWhatYouWillLearnMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCourseWhatYouWillLearnMutation, UpdateCourseWhatYouWillLearnMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCourseWhatYouWillLearnMutation, UpdateCourseWhatYouWillLearnMutationVariables>(UpdateCourseWhatYouWillLearnDocument, options);
      }
export type UpdateCourseWhatYouWillLearnMutationHookResult = ReturnType<typeof useUpdateCourseWhatYouWillLearnMutation>;
export type UpdateCourseWhatYouWillLearnMutationResult = Apollo.MutationResult<UpdateCourseWhatYouWillLearnMutation>;
export type UpdateCourseWhatYouWillLearnMutationOptions = Apollo.BaseMutationOptions<UpdateCourseWhatYouWillLearnMutation, UpdateCourseWhatYouWillLearnMutationVariables>;
export const GetAllCourseDocument = gql`
    query GetAllCourse {
  getAllCourse {
    _id
    title
    slug
    courseCode
    status
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
export const GetAllCourseWithEnrollmentDocument = gql`
    query GetAllCourseWithEnrollment {
  getAllCourseWithEnrollment {
    _id
    title
    slug
    thumbnail {
      publicId
      width
      height
      format
    }
    isEnrolled
  }
}
    `;

/**
 * __useGetAllCourseWithEnrollmentQuery__
 *
 * To run a query within a React component, call `useGetAllCourseWithEnrollmentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllCourseWithEnrollmentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllCourseWithEnrollmentQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllCourseWithEnrollmentQuery(baseOptions?: Apollo.QueryHookOptions<GetAllCourseWithEnrollmentQuery, GetAllCourseWithEnrollmentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllCourseWithEnrollmentQuery, GetAllCourseWithEnrollmentQueryVariables>(GetAllCourseWithEnrollmentDocument, options);
      }
export function useGetAllCourseWithEnrollmentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllCourseWithEnrollmentQuery, GetAllCourseWithEnrollmentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllCourseWithEnrollmentQuery, GetAllCourseWithEnrollmentQueryVariables>(GetAllCourseWithEnrollmentDocument, options);
        }
export function useGetAllCourseWithEnrollmentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllCourseWithEnrollmentQuery, GetAllCourseWithEnrollmentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllCourseWithEnrollmentQuery, GetAllCourseWithEnrollmentQueryVariables>(GetAllCourseWithEnrollmentDocument, options);
        }
export type GetAllCourseWithEnrollmentQueryHookResult = ReturnType<typeof useGetAllCourseWithEnrollmentQuery>;
export type GetAllCourseWithEnrollmentLazyQueryHookResult = ReturnType<typeof useGetAllCourseWithEnrollmentLazyQuery>;
export type GetAllCourseWithEnrollmentSuspenseQueryHookResult = ReturnType<typeof useGetAllCourseWithEnrollmentSuspenseQuery>;
export type GetAllCourseWithEnrollmentQueryResult = Apollo.QueryResult<GetAllCourseWithEnrollmentQuery, GetAllCourseWithEnrollmentQueryVariables>;
export const GetCourseForUserDocument = gql`
    query GetCourseForUser($slug: String!) {
  getCourseForUser(slug: $slug) {
    status
    fullContent {
      _id
      title
      slug
      sectionId {
        _id
        title
        description
        order
        lessonId {
          _id
          title
          order
          isPublished
          type
        }
      }
      status
    }
    coursePreviewData {
      _id
      title
      slug
      description
      courseCode
      difficulty
      thumbnail {
        publicId
        width
        height
        format
      }
      price {
        planTitle
        description
        amount
        currency
      }
      category
      status
      whatYouWillLearn
    }
  }
}
    `;

/**
 * __useGetCourseForUserQuery__
 *
 * To run a query within a React component, call `useGetCourseForUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCourseForUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCourseForUserQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetCourseForUserQuery(baseOptions: Apollo.QueryHookOptions<GetCourseForUserQuery, GetCourseForUserQueryVariables> & ({ variables: GetCourseForUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCourseForUserQuery, GetCourseForUserQueryVariables>(GetCourseForUserDocument, options);
      }
export function useGetCourseForUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCourseForUserQuery, GetCourseForUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCourseForUserQuery, GetCourseForUserQueryVariables>(GetCourseForUserDocument, options);
        }
export function useGetCourseForUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCourseForUserQuery, GetCourseForUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCourseForUserQuery, GetCourseForUserQueryVariables>(GetCourseForUserDocument, options);
        }
export type GetCourseForUserQueryHookResult = ReturnType<typeof useGetCourseForUserQuery>;
export type GetCourseForUserLazyQueryHookResult = ReturnType<typeof useGetCourseForUserLazyQuery>;
export type GetCourseForUserSuspenseQueryHookResult = ReturnType<typeof useGetCourseForUserSuspenseQuery>;
export type GetCourseForUserQueryResult = Apollo.QueryResult<GetCourseForUserQuery, GetCourseForUserQueryVariables>;
export const GetUserEnrolledCoursesCountDocument = gql`
    query GetUserEnrolledCoursesCount($userId: ID!) {
  getUserEnrolledCoursesCount(userId: $userId) {
    totalCourses
    completedCount
    inProgressCount
    courseCompletionPercentage
  }
}
    `;

/**
 * __useGetUserEnrolledCoursesCountQuery__
 *
 * To run a query within a React component, call `useGetUserEnrolledCoursesCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserEnrolledCoursesCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserEnrolledCoursesCountQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserEnrolledCoursesCountQuery(baseOptions: Apollo.QueryHookOptions<GetUserEnrolledCoursesCountQuery, GetUserEnrolledCoursesCountQueryVariables> & ({ variables: GetUserEnrolledCoursesCountQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserEnrolledCoursesCountQuery, GetUserEnrolledCoursesCountQueryVariables>(GetUserEnrolledCoursesCountDocument, options);
      }
export function useGetUserEnrolledCoursesCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserEnrolledCoursesCountQuery, GetUserEnrolledCoursesCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserEnrolledCoursesCountQuery, GetUserEnrolledCoursesCountQueryVariables>(GetUserEnrolledCoursesCountDocument, options);
        }
export function useGetUserEnrolledCoursesCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserEnrolledCoursesCountQuery, GetUserEnrolledCoursesCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserEnrolledCoursesCountQuery, GetUserEnrolledCoursesCountQueryVariables>(GetUserEnrolledCoursesCountDocument, options);
        }
export type GetUserEnrolledCoursesCountQueryHookResult = ReturnType<typeof useGetUserEnrolledCoursesCountQuery>;
export type GetUserEnrolledCoursesCountLazyQueryHookResult = ReturnType<typeof useGetUserEnrolledCoursesCountLazyQuery>;
export type GetUserEnrolledCoursesCountSuspenseQueryHookResult = ReturnType<typeof useGetUserEnrolledCoursesCountSuspenseQuery>;
export type GetUserEnrolledCoursesCountQueryResult = Apollo.QueryResult<GetUserEnrolledCoursesCountQuery, GetUserEnrolledCoursesCountQueryVariables>;
export const GetUserNotEnrolledCoursesDocument = gql`
    query GetUserNotEnrolledCourses($userId: ID!) {
  getUserNotEnrolledCourses(userId: $userId) {
    _id
    title
    slug
    thumbnail {
      publicId
      width
      height
      format
    }
    price {
      planTitle
      description
      amount
      currency
    }
  }
}
    `;

/**
 * __useGetUserNotEnrolledCoursesQuery__
 *
 * To run a query within a React component, call `useGetUserNotEnrolledCoursesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserNotEnrolledCoursesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserNotEnrolledCoursesQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserNotEnrolledCoursesQuery(baseOptions: Apollo.QueryHookOptions<GetUserNotEnrolledCoursesQuery, GetUserNotEnrolledCoursesQueryVariables> & ({ variables: GetUserNotEnrolledCoursesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserNotEnrolledCoursesQuery, GetUserNotEnrolledCoursesQueryVariables>(GetUserNotEnrolledCoursesDocument, options);
      }
export function useGetUserNotEnrolledCoursesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserNotEnrolledCoursesQuery, GetUserNotEnrolledCoursesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserNotEnrolledCoursesQuery, GetUserNotEnrolledCoursesQueryVariables>(GetUserNotEnrolledCoursesDocument, options);
        }
export function useGetUserNotEnrolledCoursesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserNotEnrolledCoursesQuery, GetUserNotEnrolledCoursesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserNotEnrolledCoursesQuery, GetUserNotEnrolledCoursesQueryVariables>(GetUserNotEnrolledCoursesDocument, options);
        }
export type GetUserNotEnrolledCoursesQueryHookResult = ReturnType<typeof useGetUserNotEnrolledCoursesQuery>;
export type GetUserNotEnrolledCoursesLazyQueryHookResult = ReturnType<typeof useGetUserNotEnrolledCoursesLazyQuery>;
export type GetUserNotEnrolledCoursesSuspenseQueryHookResult = ReturnType<typeof useGetUserNotEnrolledCoursesSuspenseQuery>;
export type GetUserNotEnrolledCoursesQueryResult = Apollo.QueryResult<GetUserNotEnrolledCoursesQuery, GetUserNotEnrolledCoursesQueryVariables>;
export const GetAllCoursesByInstructurIdDocument = gql`
    query GetAllCoursesByInstructurId {
  getAllCoursesByInstructurId {
    _id
    title
    slug
    courseCode
    status
  }
}
    `;

/**
 * __useGetAllCoursesByInstructurIdQuery__
 *
 * To run a query within a React component, call `useGetAllCoursesByInstructurIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllCoursesByInstructurIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllCoursesByInstructurIdQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllCoursesByInstructurIdQuery(baseOptions?: Apollo.QueryHookOptions<GetAllCoursesByInstructurIdQuery, GetAllCoursesByInstructurIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllCoursesByInstructurIdQuery, GetAllCoursesByInstructurIdQueryVariables>(GetAllCoursesByInstructurIdDocument, options);
      }
export function useGetAllCoursesByInstructurIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllCoursesByInstructurIdQuery, GetAllCoursesByInstructurIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllCoursesByInstructurIdQuery, GetAllCoursesByInstructurIdQueryVariables>(GetAllCoursesByInstructurIdDocument, options);
        }
export function useGetAllCoursesByInstructurIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllCoursesByInstructurIdQuery, GetAllCoursesByInstructurIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllCoursesByInstructurIdQuery, GetAllCoursesByInstructurIdQueryVariables>(GetAllCoursesByInstructurIdDocument, options);
        }
export type GetAllCoursesByInstructurIdQueryHookResult = ReturnType<typeof useGetAllCoursesByInstructurIdQuery>;
export type GetAllCoursesByInstructurIdLazyQueryHookResult = ReturnType<typeof useGetAllCoursesByInstructurIdLazyQuery>;
export type GetAllCoursesByInstructurIdSuspenseQueryHookResult = ReturnType<typeof useGetAllCoursesByInstructurIdSuspenseQuery>;
export type GetAllCoursesByInstructurIdQueryResult = Apollo.QueryResult<GetAllCoursesByInstructurIdQuery, GetAllCoursesByInstructurIdQueryVariables>;
export const GetCourseDetailsForInstructorDocument = gql`
    query GetCourseDetailsForInstructor($slug: String!) {
  getCourseDetailsForInstructor(slug: $slug) {
    course {
      _id
      title
      slug
      courseCode
      status
      updatedAt
    }
    totalSections
    totalLessons
    totalEnrollment
  }
}
    `;

/**
 * __useGetCourseDetailsForInstructorQuery__
 *
 * To run a query within a React component, call `useGetCourseDetailsForInstructorQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCourseDetailsForInstructorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCourseDetailsForInstructorQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetCourseDetailsForInstructorQuery(baseOptions: Apollo.QueryHookOptions<GetCourseDetailsForInstructorQuery, GetCourseDetailsForInstructorQueryVariables> & ({ variables: GetCourseDetailsForInstructorQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCourseDetailsForInstructorQuery, GetCourseDetailsForInstructorQueryVariables>(GetCourseDetailsForInstructorDocument, options);
      }
export function useGetCourseDetailsForInstructorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCourseDetailsForInstructorQuery, GetCourseDetailsForInstructorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCourseDetailsForInstructorQuery, GetCourseDetailsForInstructorQueryVariables>(GetCourseDetailsForInstructorDocument, options);
        }
export function useGetCourseDetailsForInstructorSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCourseDetailsForInstructorQuery, GetCourseDetailsForInstructorQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCourseDetailsForInstructorQuery, GetCourseDetailsForInstructorQueryVariables>(GetCourseDetailsForInstructorDocument, options);
        }
export type GetCourseDetailsForInstructorQueryHookResult = ReturnType<typeof useGetCourseDetailsForInstructorQuery>;
export type GetCourseDetailsForInstructorLazyQueryHookResult = ReturnType<typeof useGetCourseDetailsForInstructorLazyQuery>;
export type GetCourseDetailsForInstructorSuspenseQueryHookResult = ReturnType<typeof useGetCourseDetailsForInstructorSuspenseQuery>;
export type GetCourseDetailsForInstructorQueryResult = Apollo.QueryResult<GetCourseDetailsForInstructorQuery, GetCourseDetailsForInstructorQueryVariables>;
export const GetCourseBasicInfoForEditDocument = gql`
    query GetCourseBasicInfoForEdit($slug: String!) {
  getCourseBasicInfoForEdit(slug: $slug) {
    _id
    title
    subtitle
    slug
    description
    requirements
    courseCode
    difficulty
    thumbnail {
      publicId
      width
      height
      format
    }
    price {
      planTitle
      description
      amount
      currency
    }
    category
    status
    updatedAt
    whoIsThisFor
    whatYouWillLearn
  }
}
    `;

/**
 * __useGetCourseBasicInfoForEditQuery__
 *
 * To run a query within a React component, call `useGetCourseBasicInfoForEditQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCourseBasicInfoForEditQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCourseBasicInfoForEditQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetCourseBasicInfoForEditQuery(baseOptions: Apollo.QueryHookOptions<GetCourseBasicInfoForEditQuery, GetCourseBasicInfoForEditQueryVariables> & ({ variables: GetCourseBasicInfoForEditQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCourseBasicInfoForEditQuery, GetCourseBasicInfoForEditQueryVariables>(GetCourseBasicInfoForEditDocument, options);
      }
export function useGetCourseBasicInfoForEditLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCourseBasicInfoForEditQuery, GetCourseBasicInfoForEditQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCourseBasicInfoForEditQuery, GetCourseBasicInfoForEditQueryVariables>(GetCourseBasicInfoForEditDocument, options);
        }
export function useGetCourseBasicInfoForEditSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCourseBasicInfoForEditQuery, GetCourseBasicInfoForEditQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCourseBasicInfoForEditQuery, GetCourseBasicInfoForEditQueryVariables>(GetCourseBasicInfoForEditDocument, options);
        }
export type GetCourseBasicInfoForEditQueryHookResult = ReturnType<typeof useGetCourseBasicInfoForEditQuery>;
export type GetCourseBasicInfoForEditLazyQueryHookResult = ReturnType<typeof useGetCourseBasicInfoForEditLazyQuery>;
export type GetCourseBasicInfoForEditSuspenseQueryHookResult = ReturnType<typeof useGetCourseBasicInfoForEditSuspenseQuery>;
export type GetCourseBasicInfoForEditQueryResult = Apollo.QueryResult<GetCourseBasicInfoForEditQuery, GetCourseBasicInfoForEditQueryVariables>;
export const GetCoursePreviewDataDocument = gql`
    query GetCoursePreviewData($slug: String!) {
  getCoursePreviewData(slug: $slug) {
    success
    message
    course {
      _id
      createdBy {
        email
        role
        fullName
        bio
        profilePicture {
          publicId
          width
          height
          format
        }
      }
      title
      subtitle
      slug
      description
      requirements
      courseCode
      difficulty
      price {
        planTitle
        description
        amount
        currency
      }
      category
      whatYouWillLearn
      whoIsThisFor
      updatedAt
      sectionId {
        _id
        title
        description
        order
        lessonId {
          _id
          title
          order
          type
        }
      }
    }
    totalSections
    totalLessons
    totalAllLessonsVideosHours
  }
}
    `;

/**
 * __useGetCoursePreviewDataQuery__
 *
 * To run a query within a React component, call `useGetCoursePreviewDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCoursePreviewDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCoursePreviewDataQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetCoursePreviewDataQuery(baseOptions: Apollo.QueryHookOptions<GetCoursePreviewDataQuery, GetCoursePreviewDataQueryVariables> & ({ variables: GetCoursePreviewDataQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCoursePreviewDataQuery, GetCoursePreviewDataQueryVariables>(GetCoursePreviewDataDocument, options);
      }
export function useGetCoursePreviewDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCoursePreviewDataQuery, GetCoursePreviewDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCoursePreviewDataQuery, GetCoursePreviewDataQueryVariables>(GetCoursePreviewDataDocument, options);
        }
export function useGetCoursePreviewDataSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCoursePreviewDataQuery, GetCoursePreviewDataQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCoursePreviewDataQuery, GetCoursePreviewDataQueryVariables>(GetCoursePreviewDataDocument, options);
        }
export type GetCoursePreviewDataQueryHookResult = ReturnType<typeof useGetCoursePreviewDataQuery>;
export type GetCoursePreviewDataLazyQueryHookResult = ReturnType<typeof useGetCoursePreviewDataLazyQuery>;
export type GetCoursePreviewDataSuspenseQueryHookResult = ReturnType<typeof useGetCoursePreviewDataSuspenseQuery>;
export type GetCoursePreviewDataQueryResult = Apollo.QueryResult<GetCoursePreviewDataQuery, GetCoursePreviewDataQueryVariables>;
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
    query CheckEnrollment($courseId: ID!) {
  checkEnrollment(courseId: $courseId) {
    _id
    courseId {
      _id
    }
    userId {
      _id
    }
    status
    expiryDate
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
export const GetUserEnrolledCoursesDocument = gql`
    query GetUserEnrolledCourses($userId: String!) {
  getUserEnrolledCourses(userId: $userId) {
    _id
    courseId {
      _id
      title
      slug
      thumbnail {
        publicId
        width
        height
        format
      }
    }
    progress
    lastAccessedAt
  }
}
    `;

/**
 * __useGetUserEnrolledCoursesQuery__
 *
 * To run a query within a React component, call `useGetUserEnrolledCoursesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserEnrolledCoursesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserEnrolledCoursesQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserEnrolledCoursesQuery(baseOptions: Apollo.QueryHookOptions<GetUserEnrolledCoursesQuery, GetUserEnrolledCoursesQueryVariables> & ({ variables: GetUserEnrolledCoursesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserEnrolledCoursesQuery, GetUserEnrolledCoursesQueryVariables>(GetUserEnrolledCoursesDocument, options);
      }
export function useGetUserEnrolledCoursesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserEnrolledCoursesQuery, GetUserEnrolledCoursesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserEnrolledCoursesQuery, GetUserEnrolledCoursesQueryVariables>(GetUserEnrolledCoursesDocument, options);
        }
export function useGetUserEnrolledCoursesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserEnrolledCoursesQuery, GetUserEnrolledCoursesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserEnrolledCoursesQuery, GetUserEnrolledCoursesQueryVariables>(GetUserEnrolledCoursesDocument, options);
        }
export type GetUserEnrolledCoursesQueryHookResult = ReturnType<typeof useGetUserEnrolledCoursesQuery>;
export type GetUserEnrolledCoursesLazyQueryHookResult = ReturnType<typeof useGetUserEnrolledCoursesLazyQuery>;
export type GetUserEnrolledCoursesSuspenseQueryHookResult = ReturnType<typeof useGetUserEnrolledCoursesSuspenseQuery>;
export type GetUserEnrolledCoursesQueryResult = Apollo.QueryResult<GetUserEnrolledCoursesQuery, GetUserEnrolledCoursesQueryVariables>;
export const GetInstructorCourseContentDocument = gql`
    query GetInstructorCourseContent($slug: String!) {
  getInstructorCourseContent(slug: $slug) {
    _id
    sectionId {
      _id
      title
      description
      lessonId {
        _id
        title
        isPublished
        order
        type
        sectionId {
          courseId {
            slug
          }
        }
        ... on VideoLesson {
          duration
        }
        ... on TextLesson {
          content
        }
        ... on FileLesson {
          fileUrl
        }
        ... on QuizLesson {
          quizQuestions {
            question
            answers
            correctAnswer
          }
        }
        ... on AssignmentLesson {
          assignmentDetails
        }
      }
      order
    }
  }
}
    `;

/**
 * __useGetInstructorCourseContentQuery__
 *
 * To run a query within a React component, call `useGetInstructorCourseContentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInstructorCourseContentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInstructorCourseContentQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetInstructorCourseContentQuery(baseOptions: Apollo.QueryHookOptions<GetInstructorCourseContentQuery, GetInstructorCourseContentQueryVariables> & ({ variables: GetInstructorCourseContentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInstructorCourseContentQuery, GetInstructorCourseContentQueryVariables>(GetInstructorCourseContentDocument, options);
      }
export function useGetInstructorCourseContentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInstructorCourseContentQuery, GetInstructorCourseContentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInstructorCourseContentQuery, GetInstructorCourseContentQueryVariables>(GetInstructorCourseContentDocument, options);
        }
export function useGetInstructorCourseContentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInstructorCourseContentQuery, GetInstructorCourseContentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetInstructorCourseContentQuery, GetInstructorCourseContentQueryVariables>(GetInstructorCourseContentDocument, options);
        }
export type GetInstructorCourseContentQueryHookResult = ReturnType<typeof useGetInstructorCourseContentQuery>;
export type GetInstructorCourseContentLazyQueryHookResult = ReturnType<typeof useGetInstructorCourseContentLazyQuery>;
export type GetInstructorCourseContentSuspenseQueryHookResult = ReturnType<typeof useGetInstructorCourseContentSuspenseQuery>;
export type GetInstructorCourseContentQueryResult = Apollo.QueryResult<GetInstructorCourseContentQuery, GetInstructorCourseContentQueryVariables>;
export const CreateLessonDocument = gql`
    mutation CreateLesson($input: CreateLessonInput!) {
  createLesson(input: $input) {
    success
    message
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
export const CreateLessonV2Document = gql`
    mutation CreateLessonV2($input: CreateLessonV2Input!) {
  createLessonV2(input: $input) {
    success
    message
  }
}
    `;
export type CreateLessonV2MutationFn = Apollo.MutationFunction<CreateLessonV2Mutation, CreateLessonV2MutationVariables>;

/**
 * __useCreateLessonV2Mutation__
 *
 * To run a mutation, you first call `useCreateLessonV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLessonV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLessonV2Mutation, { data, loading, error }] = useCreateLessonV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateLessonV2Mutation(baseOptions?: Apollo.MutationHookOptions<CreateLessonV2Mutation, CreateLessonV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLessonV2Mutation, CreateLessonV2MutationVariables>(CreateLessonV2Document, options);
      }
export type CreateLessonV2MutationHookResult = ReturnType<typeof useCreateLessonV2Mutation>;
export type CreateLessonV2MutationResult = Apollo.MutationResult<CreateLessonV2Mutation>;
export type CreateLessonV2MutationOptions = Apollo.BaseMutationOptions<CreateLessonV2Mutation, CreateLessonV2MutationVariables>;
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
export const DeleteLessonV2Document = gql`
    mutation DeleteLessonV2($id: ID!) {
  deleteLessonV2(_id: $id) {
    success
    message
  }
}
    `;
export type DeleteLessonV2MutationFn = Apollo.MutationFunction<DeleteLessonV2Mutation, DeleteLessonV2MutationVariables>;

/**
 * __useDeleteLessonV2Mutation__
 *
 * To run a mutation, you first call `useDeleteLessonV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteLessonV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteLessonV2Mutation, { data, loading, error }] = useDeleteLessonV2Mutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteLessonV2Mutation(baseOptions?: Apollo.MutationHookOptions<DeleteLessonV2Mutation, DeleteLessonV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteLessonV2Mutation, DeleteLessonV2MutationVariables>(DeleteLessonV2Document, options);
      }
export type DeleteLessonV2MutationHookResult = ReturnType<typeof useDeleteLessonV2Mutation>;
export type DeleteLessonV2MutationResult = Apollo.MutationResult<DeleteLessonV2Mutation>;
export type DeleteLessonV2MutationOptions = Apollo.BaseMutationOptions<DeleteLessonV2Mutation, DeleteLessonV2MutationVariables>;
export const CreateMuxUploadUrlDocument = gql`
    mutation CreateMuxUploadUrl {
  createMuxUploadUrl {
    uploadId
    uploadUrl
    passthrough
  }
}
    `;
export type CreateMuxUploadUrlMutationFn = Apollo.MutationFunction<CreateMuxUploadUrlMutation, CreateMuxUploadUrlMutationVariables>;

/**
 * __useCreateMuxUploadUrlMutation__
 *
 * To run a mutation, you first call `useCreateMuxUploadUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMuxUploadUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMuxUploadUrlMutation, { data, loading, error }] = useCreateMuxUploadUrlMutation({
 *   variables: {
 *   },
 * });
 */
export function useCreateMuxUploadUrlMutation(baseOptions?: Apollo.MutationHookOptions<CreateMuxUploadUrlMutation, CreateMuxUploadUrlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMuxUploadUrlMutation, CreateMuxUploadUrlMutationVariables>(CreateMuxUploadUrlDocument, options);
      }
export type CreateMuxUploadUrlMutationHookResult = ReturnType<typeof useCreateMuxUploadUrlMutation>;
export type CreateMuxUploadUrlMutationResult = Apollo.MutationResult<CreateMuxUploadUrlMutation>;
export type CreateMuxUploadUrlMutationOptions = Apollo.BaseMutationOptions<CreateMuxUploadUrlMutation, CreateMuxUploadUrlMutationVariables>;
export const UpdateLessonV2GeneralInfoDocument = gql`
    mutation UpdateLessonV2GeneralInfo($id: ID, $input: updateLessonV2GeneralInfoInput) {
  updateLessonV2GeneralInfo(_id: $id, input: $input) {
    success
    message
  }
}
    `;
export type UpdateLessonV2GeneralInfoMutationFn = Apollo.MutationFunction<UpdateLessonV2GeneralInfoMutation, UpdateLessonV2GeneralInfoMutationVariables>;

/**
 * __useUpdateLessonV2GeneralInfoMutation__
 *
 * To run a mutation, you first call `useUpdateLessonV2GeneralInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLessonV2GeneralInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLessonV2GeneralInfoMutation, { data, loading, error }] = useUpdateLessonV2GeneralInfoMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateLessonV2GeneralInfoMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLessonV2GeneralInfoMutation, UpdateLessonV2GeneralInfoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLessonV2GeneralInfoMutation, UpdateLessonV2GeneralInfoMutationVariables>(UpdateLessonV2GeneralInfoDocument, options);
      }
export type UpdateLessonV2GeneralInfoMutationHookResult = ReturnType<typeof useUpdateLessonV2GeneralInfoMutation>;
export type UpdateLessonV2GeneralInfoMutationResult = Apollo.MutationResult<UpdateLessonV2GeneralInfoMutation>;
export type UpdateLessonV2GeneralInfoMutationOptions = Apollo.BaseMutationOptions<UpdateLessonV2GeneralInfoMutation, UpdateLessonV2GeneralInfoMutationVariables>;
export const UpdateLessonV2VideoDocument = gql`
    mutation UpdateLessonV2Video($id: ID!, $input: UpdateLessonV2VideoInput!) {
  updateLessonV2Video(_id: $id, input: $input) {
    success
    message
  }
}
    `;
export type UpdateLessonV2VideoMutationFn = Apollo.MutationFunction<UpdateLessonV2VideoMutation, UpdateLessonV2VideoMutationVariables>;

/**
 * __useUpdateLessonV2VideoMutation__
 *
 * To run a mutation, you first call `useUpdateLessonV2VideoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLessonV2VideoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLessonV2VideoMutation, { data, loading, error }] = useUpdateLessonV2VideoMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateLessonV2VideoMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLessonV2VideoMutation, UpdateLessonV2VideoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLessonV2VideoMutation, UpdateLessonV2VideoMutationVariables>(UpdateLessonV2VideoDocument, options);
      }
export type UpdateLessonV2VideoMutationHookResult = ReturnType<typeof useUpdateLessonV2VideoMutation>;
export type UpdateLessonV2VideoMutationResult = Apollo.MutationResult<UpdateLessonV2VideoMutation>;
export type UpdateLessonV2VideoMutationOptions = Apollo.BaseMutationOptions<UpdateLessonV2VideoMutation, UpdateLessonV2VideoMutationVariables>;
export const GetLessonV2ByIdForInstructorDocument = gql`
    query getLessonV2ByIdForInstructor($id: ID!) {
  getLessonV2ByIdForInstructor(_id: $id) {
    _id
    sectionId {
      _id
      courseId {
        _id
        slug
      }
    }
    title
    order
    isPublished
    isFree
    createdAt
    updatedAt
    type
    ... on VideoLesson {
      passthrough
      muxUploadId
      muxAssetId
      muxPlaybackId
      status
      duration
    }
    ... on TextLesson {
      content
    }
    ... on FileLesson {
      fileUrl
    }
    ... on QuizLesson {
      quizQuestions {
        question
        answers
        correctAnswer
      }
    }
    ... on AssignmentLesson {
      assignmentDetails
    }
  }
}
    `;

/**
 * __useGetLessonV2ByIdForInstructorQuery__
 *
 * To run a query within a React component, call `useGetLessonV2ByIdForInstructorQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLessonV2ByIdForInstructorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLessonV2ByIdForInstructorQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetLessonV2ByIdForInstructorQuery(baseOptions: Apollo.QueryHookOptions<GetLessonV2ByIdForInstructorQuery, GetLessonV2ByIdForInstructorQueryVariables> & ({ variables: GetLessonV2ByIdForInstructorQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLessonV2ByIdForInstructorQuery, GetLessonV2ByIdForInstructorQueryVariables>(GetLessonV2ByIdForInstructorDocument, options);
      }
export function useGetLessonV2ByIdForInstructorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLessonV2ByIdForInstructorQuery, GetLessonV2ByIdForInstructorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLessonV2ByIdForInstructorQuery, GetLessonV2ByIdForInstructorQueryVariables>(GetLessonV2ByIdForInstructorDocument, options);
        }
export function useGetLessonV2ByIdForInstructorSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLessonV2ByIdForInstructorQuery, GetLessonV2ByIdForInstructorQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLessonV2ByIdForInstructorQuery, GetLessonV2ByIdForInstructorQueryVariables>(GetLessonV2ByIdForInstructorDocument, options);
        }
export type GetLessonV2ByIdForInstructorQueryHookResult = ReturnType<typeof useGetLessonV2ByIdForInstructorQuery>;
export type GetLessonV2ByIdForInstructorLazyQueryHookResult = ReturnType<typeof useGetLessonV2ByIdForInstructorLazyQuery>;
export type GetLessonV2ByIdForInstructorSuspenseQueryHookResult = ReturnType<typeof useGetLessonV2ByIdForInstructorSuspenseQuery>;
export type GetLessonV2ByIdForInstructorQueryResult = Apollo.QueryResult<GetLessonV2ByIdForInstructorQuery, GetLessonV2ByIdForInstructorQueryVariables>;
export const GetLessonV2byIdForStudentDocument = gql`
    query GetLessonV2byIdForStudent($id: ID!) {
  getLessonV2byIdForStudent(_id: $id) {
    _id
    title
    order
    type
    ... on VideoLesson {
      muxPlaybackId
    }
    ... on TextLesson {
      content
    }
    ... on FileLesson {
      fileUrl
    }
    ... on QuizLesson {
      quizQuestions {
        question
        answers
        correctAnswer
      }
    }
    ... on AssignmentLesson {
      assignmentDetails
    }
  }
}
    `;

/**
 * __useGetLessonV2byIdForStudentQuery__
 *
 * To run a query within a React component, call `useGetLessonV2byIdForStudentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLessonV2byIdForStudentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLessonV2byIdForStudentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetLessonV2byIdForStudentQuery(baseOptions: Apollo.QueryHookOptions<GetLessonV2byIdForStudentQuery, GetLessonV2byIdForStudentQueryVariables> & ({ variables: GetLessonV2byIdForStudentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLessonV2byIdForStudentQuery, GetLessonV2byIdForStudentQueryVariables>(GetLessonV2byIdForStudentDocument, options);
      }
export function useGetLessonV2byIdForStudentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLessonV2byIdForStudentQuery, GetLessonV2byIdForStudentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLessonV2byIdForStudentQuery, GetLessonV2byIdForStudentQueryVariables>(GetLessonV2byIdForStudentDocument, options);
        }
export function useGetLessonV2byIdForStudentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLessonV2byIdForStudentQuery, GetLessonV2byIdForStudentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLessonV2byIdForStudentQuery, GetLessonV2byIdForStudentQueryVariables>(GetLessonV2byIdForStudentDocument, options);
        }
export type GetLessonV2byIdForStudentQueryHookResult = ReturnType<typeof useGetLessonV2byIdForStudentQuery>;
export type GetLessonV2byIdForStudentLazyQueryHookResult = ReturnType<typeof useGetLessonV2byIdForStudentLazyQuery>;
export type GetLessonV2byIdForStudentSuspenseQueryHookResult = ReturnType<typeof useGetLessonV2byIdForStudentSuspenseQuery>;
export type GetLessonV2byIdForStudentQueryResult = Apollo.QueryResult<GetLessonV2byIdForStudentQuery, GetLessonV2byIdForStudentQueryVariables>;
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
    query GetAllPayments($limit: Int, $offset: Int, $filter: PaymentFilterInput) {
  getAllPayments(limit: $limit, offset: $offset, filter: $filter) {
    payments {
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
    totalCount
    totalAmount
    hasNextPage
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
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      filter: // value for 'filter'
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
    success
    message
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
    success
    message
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
export const CreateSubscriberDocument = gql`
    mutation CreateSubscriber($input: SubscribeInput!) {
  createSubscriber(input: $input) {
    success
    message
    subscriber {
      email
    }
  }
}
    `;
export type CreateSubscriberMutationFn = Apollo.MutationFunction<CreateSubscriberMutation, CreateSubscriberMutationVariables>;

/**
 * __useCreateSubscriberMutation__
 *
 * To run a mutation, you first call `useCreateSubscriberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSubscriberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSubscriberMutation, { data, loading, error }] = useCreateSubscriberMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSubscriberMutation(baseOptions?: Apollo.MutationHookOptions<CreateSubscriberMutation, CreateSubscriberMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSubscriberMutation, CreateSubscriberMutationVariables>(CreateSubscriberDocument, options);
      }
export type CreateSubscriberMutationHookResult = ReturnType<typeof useCreateSubscriberMutation>;
export type CreateSubscriberMutationResult = Apollo.MutationResult<CreateSubscriberMutation>;
export type CreateSubscriberMutationOptions = Apollo.BaseMutationOptions<CreateSubscriberMutation, CreateSubscriberMutationVariables>;
export const GetAllSubscribersDocument = gql`
    query GetAllSubscribers($limit: Int, $offset: Int, $search: String) {
  getAllSubscribers(limit: $limit, offset: $offset, search: $search) {
    subscribers {
      _id
      email
      subscribedAt
    }
    totalCount
    hasNextPage
  }
}
    `;

/**
 * __useGetAllSubscribersQuery__
 *
 * To run a query within a React component, call `useGetAllSubscribersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllSubscribersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllSubscribersQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useGetAllSubscribersQuery(baseOptions?: Apollo.QueryHookOptions<GetAllSubscribersQuery, GetAllSubscribersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllSubscribersQuery, GetAllSubscribersQueryVariables>(GetAllSubscribersDocument, options);
      }
export function useGetAllSubscribersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllSubscribersQuery, GetAllSubscribersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllSubscribersQuery, GetAllSubscribersQueryVariables>(GetAllSubscribersDocument, options);
        }
export function useGetAllSubscribersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllSubscribersQuery, GetAllSubscribersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllSubscribersQuery, GetAllSubscribersQueryVariables>(GetAllSubscribersDocument, options);
        }
export type GetAllSubscribersQueryHookResult = ReturnType<typeof useGetAllSubscribersQuery>;
export type GetAllSubscribersLazyQueryHookResult = ReturnType<typeof useGetAllSubscribersLazyQuery>;
export type GetAllSubscribersSuspenseQueryHookResult = ReturnType<typeof useGetAllSubscribersSuspenseQuery>;
export type GetAllSubscribersQueryResult = Apollo.QueryResult<GetAllSubscribersQuery, GetAllSubscribersQueryVariables>;
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
    query GetAllUser($limit: Int, $offset: Int, $sortBy: String, $sortOrder: String, $filter: UserFilterInput) {
  getAllUser(
    limit: $limit
    offset: $offset
    sortBy: $sortBy
    sortOrder: $sortOrder
    filter: $filter
  ) {
    users {
      _id
      email
      studentId
      role
      isVerified
      createdAt
      updatedAt
    }
    totalCount
    hasNextPage
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
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      sortBy: // value for 'sortBy'
 *      sortOrder: // value for 'sortOrder'
 *      filter: // value for 'filter'
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
export const RegisterUserV2Document = gql`
    mutation RegisterUserV2($input: RegisterUserV2Input!) {
  registerUserV2(input: $input) {
    success
    message
    userV2 {
      _id
      email
      isVerified
      role
    }
  }
}
    `;
export type RegisterUserV2MutationFn = Apollo.MutationFunction<RegisterUserV2Mutation, RegisterUserV2MutationVariables>;

/**
 * __useRegisterUserV2Mutation__
 *
 * To run a mutation, you first call `useRegisterUserV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserV2Mutation, { data, loading, error }] = useRegisterUserV2Mutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterUserV2Mutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserV2Mutation, RegisterUserV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserV2Mutation, RegisterUserV2MutationVariables>(RegisterUserV2Document, options);
      }
export type RegisterUserV2MutationHookResult = ReturnType<typeof useRegisterUserV2Mutation>;
export type RegisterUserV2MutationResult = Apollo.MutationResult<RegisterUserV2Mutation>;
export type RegisterUserV2MutationOptions = Apollo.BaseMutationOptions<RegisterUserV2Mutation, RegisterUserV2MutationVariables>;
export const UpdateInstructorUserV2Document = gql`
    mutation UpdateInstructorUserV2($id: ID!, $input: UpdateInstructorUserV2Input!) {
  updateInstructorUserV2(_id: $id, input: $input) {
    success
    message
  }
}
    `;
export type UpdateInstructorUserV2MutationFn = Apollo.MutationFunction<UpdateInstructorUserV2Mutation, UpdateInstructorUserV2MutationVariables>;

/**
 * __useUpdateInstructorUserV2Mutation__
 *
 * To run a mutation, you first call `useUpdateInstructorUserV2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateInstructorUserV2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateInstructorUserV2Mutation, { data, loading, error }] = useUpdateInstructorUserV2Mutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateInstructorUserV2Mutation(baseOptions?: Apollo.MutationHookOptions<UpdateInstructorUserV2Mutation, UpdateInstructorUserV2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateInstructorUserV2Mutation, UpdateInstructorUserV2MutationVariables>(UpdateInstructorUserV2Document, options);
      }
export type UpdateInstructorUserV2MutationHookResult = ReturnType<typeof useUpdateInstructorUserV2Mutation>;
export type UpdateInstructorUserV2MutationResult = Apollo.MutationResult<UpdateInstructorUserV2Mutation>;
export type UpdateInstructorUserV2MutationOptions = Apollo.BaseMutationOptions<UpdateInstructorUserV2Mutation, UpdateInstructorUserV2MutationVariables>;
export const UpdateInstructorProfilePictureDocument = gql`
    mutation UpdateInstructorProfilePicture($id: ID!, $input: UploadProfilePictureInput!) {
  updateInstructorProfilePicture(_id: $id, input: $input) {
    success
    message
  }
}
    `;
export type UpdateInstructorProfilePictureMutationFn = Apollo.MutationFunction<UpdateInstructorProfilePictureMutation, UpdateInstructorProfilePictureMutationVariables>;

/**
 * __useUpdateInstructorProfilePictureMutation__
 *
 * To run a mutation, you first call `useUpdateInstructorProfilePictureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateInstructorProfilePictureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateInstructorProfilePictureMutation, { data, loading, error }] = useUpdateInstructorProfilePictureMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateInstructorProfilePictureMutation(baseOptions?: Apollo.MutationHookOptions<UpdateInstructorProfilePictureMutation, UpdateInstructorProfilePictureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateInstructorProfilePictureMutation, UpdateInstructorProfilePictureMutationVariables>(UpdateInstructorProfilePictureDocument, options);
      }
export type UpdateInstructorProfilePictureMutationHookResult = ReturnType<typeof useUpdateInstructorProfilePictureMutation>;
export type UpdateInstructorProfilePictureMutationResult = Apollo.MutationResult<UpdateInstructorProfilePictureMutation>;
export type UpdateInstructorProfilePictureMutationOptions = Apollo.BaseMutationOptions<UpdateInstructorProfilePictureMutation, UpdateInstructorProfilePictureMutationVariables>;
export const ChangeUserPasswordDocument = gql`
    mutation ChangeUserPassword($input: ChangePasswordInput!) {
  changeUserPassword(input: $input) {
    success
    message
  }
}
    `;
export type ChangeUserPasswordMutationFn = Apollo.MutationFunction<ChangeUserPasswordMutation, ChangeUserPasswordMutationVariables>;

/**
 * __useChangeUserPasswordMutation__
 *
 * To run a mutation, you first call `useChangeUserPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeUserPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeUserPasswordMutation, { data, loading, error }] = useChangeUserPasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChangeUserPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangeUserPasswordMutation, ChangeUserPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeUserPasswordMutation, ChangeUserPasswordMutationVariables>(ChangeUserPasswordDocument, options);
      }
export type ChangeUserPasswordMutationHookResult = ReturnType<typeof useChangeUserPasswordMutation>;
export type ChangeUserPasswordMutationResult = Apollo.MutationResult<ChangeUserPasswordMutation>;
export type ChangeUserPasswordMutationOptions = Apollo.BaseMutationOptions<ChangeUserPasswordMutation, ChangeUserPasswordMutationVariables>;
export const UpdateInstructorPayoutInfoDocument = gql`
    mutation UpdateInstructorPayoutInfo($input: UpdateInstructorPayoutInfoInput!) {
  updateInstructorPayoutInfo(input: $input) {
    success
    message
  }
}
    `;
export type UpdateInstructorPayoutInfoMutationFn = Apollo.MutationFunction<UpdateInstructorPayoutInfoMutation, UpdateInstructorPayoutInfoMutationVariables>;

/**
 * __useUpdateInstructorPayoutInfoMutation__
 *
 * To run a mutation, you first call `useUpdateInstructorPayoutInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateInstructorPayoutInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateInstructorPayoutInfoMutation, { data, loading, error }] = useUpdateInstructorPayoutInfoMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateInstructorPayoutInfoMutation(baseOptions?: Apollo.MutationHookOptions<UpdateInstructorPayoutInfoMutation, UpdateInstructorPayoutInfoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateInstructorPayoutInfoMutation, UpdateInstructorPayoutInfoMutationVariables>(UpdateInstructorPayoutInfoDocument, options);
      }
export type UpdateInstructorPayoutInfoMutationHookResult = ReturnType<typeof useUpdateInstructorPayoutInfoMutation>;
export type UpdateInstructorPayoutInfoMutationResult = Apollo.MutationResult<UpdateInstructorPayoutInfoMutation>;
export type UpdateInstructorPayoutInfoMutationOptions = Apollo.BaseMutationOptions<UpdateInstructorPayoutInfoMutation, UpdateInstructorPayoutInfoMutationVariables>;
export const GetUserV2ByIdDocument = gql`
    query GetUserV2ById($id: ID!) {
  getUserV2ById(_id: $id) {
    _id
    email
    isVerified
    role
    ... on StudentUserV2 {
      studentId
    }
    ... on InstructorUserV2 {
      fullName
      bio
      profilePicture {
        publicId
        width
        height
        format
      }
    }
    ... on AdminUserV2 {
      adminLevel
    }
  }
}
    `;

/**
 * __useGetUserV2ByIdQuery__
 *
 * To run a query within a React component, call `useGetUserV2ByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserV2ByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserV2ByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserV2ByIdQuery(baseOptions: Apollo.QueryHookOptions<GetUserV2ByIdQuery, GetUserV2ByIdQueryVariables> & ({ variables: GetUserV2ByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserV2ByIdQuery, GetUserV2ByIdQueryVariables>(GetUserV2ByIdDocument, options);
      }
export function useGetUserV2ByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserV2ByIdQuery, GetUserV2ByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserV2ByIdQuery, GetUserV2ByIdQueryVariables>(GetUserV2ByIdDocument, options);
        }
export function useGetUserV2ByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserV2ByIdQuery, GetUserV2ByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserV2ByIdQuery, GetUserV2ByIdQueryVariables>(GetUserV2ByIdDocument, options);
        }
export type GetUserV2ByIdQueryHookResult = ReturnType<typeof useGetUserV2ByIdQuery>;
export type GetUserV2ByIdLazyQueryHookResult = ReturnType<typeof useGetUserV2ByIdLazyQuery>;
export type GetUserV2ByIdSuspenseQueryHookResult = ReturnType<typeof useGetUserV2ByIdSuspenseQuery>;
export type GetUserV2ByIdQueryResult = Apollo.QueryResult<GetUserV2ByIdQuery, GetUserV2ByIdQueryVariables>;
export const GetInstructorUserV2InfoByIdDocument = gql`
    query GetInstructorUserV2InfoById($id: ID!) {
  getInstructorUserV2InfoById(_id: $id) {
    _id
    email
    isVerified
    createdAt
    updatedAt
    role
    fullName
    bio
    profilePicture {
      publicId
      width
      height
      format
    }
    payout {
      payoutMethod
      bankName
      accountHolderName
      accountNumber
    }
  }
}
    `;

/**
 * __useGetInstructorUserV2InfoByIdQuery__
 *
 * To run a query within a React component, call `useGetInstructorUserV2InfoByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInstructorUserV2InfoByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInstructorUserV2InfoByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetInstructorUserV2InfoByIdQuery(baseOptions: Apollo.QueryHookOptions<GetInstructorUserV2InfoByIdQuery, GetInstructorUserV2InfoByIdQueryVariables> & ({ variables: GetInstructorUserV2InfoByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInstructorUserV2InfoByIdQuery, GetInstructorUserV2InfoByIdQueryVariables>(GetInstructorUserV2InfoByIdDocument, options);
      }
export function useGetInstructorUserV2InfoByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInstructorUserV2InfoByIdQuery, GetInstructorUserV2InfoByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInstructorUserV2InfoByIdQuery, GetInstructorUserV2InfoByIdQueryVariables>(GetInstructorUserV2InfoByIdDocument, options);
        }
export function useGetInstructorUserV2InfoByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInstructorUserV2InfoByIdQuery, GetInstructorUserV2InfoByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetInstructorUserV2InfoByIdQuery, GetInstructorUserV2InfoByIdQueryVariables>(GetInstructorUserV2InfoByIdDocument, options);
        }
export type GetInstructorUserV2InfoByIdQueryHookResult = ReturnType<typeof useGetInstructorUserV2InfoByIdQuery>;
export type GetInstructorUserV2InfoByIdLazyQueryHookResult = ReturnType<typeof useGetInstructorUserV2InfoByIdLazyQuery>;
export type GetInstructorUserV2InfoByIdSuspenseQueryHookResult = ReturnType<typeof useGetInstructorUserV2InfoByIdSuspenseQuery>;
export type GetInstructorUserV2InfoByIdQueryResult = Apollo.QueryResult<GetInstructorUserV2InfoByIdQuery, GetInstructorUserV2InfoByIdQueryVariables>;