"use client";

import { useGetCourseByIdQuery } from "@/generated/graphql";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { EnrolledUserView } from "./_components/EnrolledUserView";
import {
  CourseData,
  NotEnrolledUserView,
} from "./_components/NotEnrolledUserView";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const { data: session } = useSession();

  const { data, loading, error } = useGetCourseByIdQuery({
    variables: { id: courseId as string },
    skip: !courseId,
  });

  const loggedInUserId = session?.user.id;
  console.log("User Id: ", loggedInUserId);
  const userEnrolled = data?.getCourseById?.enrollmentId?.some(
    (enrollment) => enrollment?.userId?._id === loggedInUserId,
  );
  console.log("User Enrolled: ", userEnrolled);

  // Төлбөрийн хэсэг рүү гулсах
  const handleScrollToPayment = () => {
    const paymentSection = document.getElementById("payment");
    if (paymentSection) {
      paymentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Ачаалалтай үед
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="mr-2 h-6 w-6 animate-spin" />
        <span>Уншиж байна...</span>
      </div>
    );
  }

  // Алдаа
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Хичээл ачааллахад алдаа гарлаа: {error.message}</p>
      </div>
    );
  }

  // Хэрэв session байхгүй ч хэрэглэгч курс авч үзэх хэсэг (бүртгэлгүй үзэх)
  // Эсвэл нэвтэрсэн, гэхдээ бүртгэлгүй бол NotEnrolledUserView-г үзүүлнэ
  if (!userEnrolled) {
    return (
      <NotEnrolledUserView
        course={data?.getCourseById as CourseData}
        onScrollToPayment={handleScrollToPayment}
      />
    );
  }

  return <EnrolledUserView courseData={data?.getCourseById} />;
}
