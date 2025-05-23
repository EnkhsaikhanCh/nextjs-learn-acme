import { mergeTypeDefs } from "@graphql-tools/merge";

import { typeDefs as UserTypeDefs } from "./user.schema";
import { typeDefs as CourseTypeDefs } from "./course.schema";
import { typeDefs as EnrollmentTypeDefs } from "./enrollment.schema";
import { typeDefs as SectionTypeDefs } from "./section.schema";
import { typeDefs as LessonTypeDefs } from "./lesson.schema";
import { typeDefs as PaymentTypeDefs } from "./payment.schema";
import { typeDefs as SubscribeTypeDefs } from "./subscriber.schema";
import { typeDefs as AuthTypeDefs } from "./auth.schema";
import { typeDefs as InstructorTypeDefs } from "./instructor.schema";
import { typeDefs as LessonV2TypeDefs } from "./lessonV2.schema";
import { typeDefs as UserV2TypeDefs } from "./userV2.schema";
import { typeDefs as EnrollmentV2TypeDefs } from "./enrollmentV2.schema";

export const typeDefs = mergeTypeDefs([
  UserTypeDefs,
  CourseTypeDefs,
  EnrollmentTypeDefs,
  SectionTypeDefs,
  LessonTypeDefs,
  PaymentTypeDefs,
  SubscribeTypeDefs,
  AuthTypeDefs,
  InstructorTypeDefs,
  LessonV2TypeDefs,
  UserV2TypeDefs,
  EnrollmentV2TypeDefs,
]);
