"use client";

import {
  Course,
  useCheckEnrollmentQuery,
  useGetCourseBySlugQuery,
  useGetUserByIdQuery,
  User,
} from "@/generated/graphql";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { NotEnrolledUserView } from "./_components/NotEnrolledUserView";
import { EnrolledUserView } from "./_components/EnrolledUserView";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import ErrorFallback from "@/components/ErrorFallback";
import CourseNotFound from "@/components/CourseNotFound";

export default function CourseDetailPage() {
  const { data: session } = useSession();
  const { slug } = useParams();

  const {
    data: courseData,
    loading: courseLoading,
    error: courseError,
    refetch: refetchCourse,
  } = useGetCourseBySlugQuery({
    variables: { slug: slug as string },
    skip: !slug,
  });

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useGetUserByIdQuery({
    variables: { id: session?.user?.id as string },
    skip: !session?.user?.id,
  });

  const {
    data: enrollData,
    loading: enrollLoading,
    error: enrollError,
  } = useCheckEnrollmentQuery({
    variables: {
      userId: userData?.getUserById?._id as string,
      courseId: courseData?.getCourseBySlug?._id as string,
    },
    skip: !userData?.getUserById?._id || !courseData?.getCourseBySlug?._id,
  });

  if (courseLoading || userLoading || enrollLoading) {
    return <LoadingOverlay />;
  }

  if (courseError || userError || enrollError) {
    return (
      <ErrorFallback
        error={
          courseError ?? userError ?? enrollError ?? new Error("Unknown error")
        }
        reset={refetchCourse}
      />
    );
  }

  if (!courseData?.getCourseBySlug) {
    return <CourseNotFound />;
  }

  const isEnrolled = enrollData?.checkEnrollment;

  const handleScrollToPayment = () => {
    const paymentSection = document.getElementById("payment");
    if (paymentSection) {
      paymentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main>
      {isEnrolled ? (
        <EnrolledUserView courseData={courseData?.getCourseBySlug} />
      ) : (
        <NotEnrolledUserView
          course={courseData?.getCourseBySlug as Course}
          user={userData?.getUserById as User}
          onScrollToPayment={handleScrollToPayment}
        />
      )}
    </main>
  );
}
