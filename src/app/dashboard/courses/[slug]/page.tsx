"use client";

import {
  Course,
  useCheckEnrollmentLazyQuery,
  useGetCourseBySlugLazyQuery,
  useGetCourseIdBySlugLazyQuery,
  useGetEnrolledCourseContentBySlugLazyQuery,
  useGetUserByIdQuery,
  User,
} from "@/generated/graphql";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { NotEnrolledUserView } from "./_components/NotEnrolledUserView";
import { EnrolledUserView } from "./_components/EnrolledUserView";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import CourseNotFound from "@/components/CourseNotFound";
import { useEffect, useState } from "react";

export default function CourseDetailPage() {
  const { data: session } = useSession();
  const { slug } = useParams();

  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  // 1. Хэрэглэгчийн мэдээлэл
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useGetUserByIdQuery({
    variables: { id: session?.user?.id as string },
    skip: !session?.user?.id,
    fetchPolicy: "cache-first",
  });

  // 2. Курсийн ID-г авах Lazy Query
  const [
    fetchCourseId,
    { data: courseIdData, loading: courseIdLoading, error: courseIdError },
  ] = useGetCourseIdBySlugLazyQuery({
    fetchPolicy: "cache-first",
  });

  // 3. Энроллмент шалгах Lazy Query
  const [
    checkEnrollment,
    { data: enrollData, loading: enrollLoading, error: enrollError },
  ] = useCheckEnrollmentLazyQuery({
    fetchPolicy: "cache-first",
  });

  // 4. Бүртгэлтэй хэрэглэгчдэд зориулсан курсийн контент
  const [
    fetchEnrolledCourseContent,
    {
      data: enrolledUserCourseData,
      loading: enrolledCourseLoading,
      error: enrolledCourseError,
    },
  ] = useGetEnrolledCourseContentBySlugLazyQuery({
    fetchPolicy: "cache-first",
  });

  // 5. Бүртгэлгүй хэрэглэгчид зориулсан курсийн мэдээлэл
  const [
    fetchCourse,
    { data: courseData, loading: courseLoading, error: courseError },
  ] = useGetCourseBySlugLazyQuery({
    fetchPolicy: "cache-first",
  });

  // --- UseEffects ---

  // (A) Slug-аар courseId авах
  useEffect(() => {
    if (slug) {
      fetchCourseId({ variables: { slug: slug as string } });
    }
  }, [slug, fetchCourseId]);

  // (B) courseId болон userId бэлэн болмогц enrollment шалгах
  useEffect(() => {
    const userId = userData?.getUserById?._id;
    const courseId = courseIdData?.getCourseIdBySlug?._id;
    if (userId && courseId) {
      checkEnrollment({ variables: { userId, courseId } });
    }
  }, [userData, courseIdData, checkEnrollment]);

  // (C) enrollment үр дүнгээс шалтгаалан дараагийн query-гаа дуудах
  useEffect(() => {
    if (enrollData?.checkEnrollment) {
      setIsEnrolled(true);

      const expiryDate = enrollData.checkEnrollment.expiryDate
        ? new Date(parseInt(enrollData.checkEnrollment.expiryDate))
        : null;
      setIsExpired(!!expiryDate && expiryDate < new Date());

      fetchEnrolledCourseContent({ variables: { slug: slug as string } });
    } else if (enrollData && !enrollData.checkEnrollment) {
      fetchCourse({ variables: { slug: slug as string } });
    }
  }, [enrollData, fetchEnrolledCourseContent, fetchCourse, slug]);

  // --- Loading / Error States ---
  if (
    userLoading ||
    enrollLoading ||
    courseIdLoading ||
    courseLoading ||
    enrolledCourseLoading
  ) {
    return <LoadingOverlay />;
  }

  if (
    userError ||
    enrollError ||
    courseIdError ||
    courseError ||
    enrolledCourseError
  ) {
    return <div>Error fetching data!</div>;
  }

  if (!isEnrolled && !courseData?.getCourseBySlug) {
    return <CourseNotFound />;
  }

  const handleScrollToPayment = () => {
    const paymentSection = document.getElementById("payment");
    if (paymentSection) {
      window.scrollTo({
        top: paymentSection.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <main>
      {!isEnrolled || isExpired ? (
        <NotEnrolledUserView
          course={courseData?.getCourseBySlug as Course}
          user={userData?.getUserById as User}
          onScrollToPayment={handleScrollToPayment}
        />
      ) : (
        <EnrolledUserView
          courseData={
            enrolledUserCourseData?.getEnrolledCourseContentBySlug as Course
          }
        />
      )}
    </main>
  );
}
