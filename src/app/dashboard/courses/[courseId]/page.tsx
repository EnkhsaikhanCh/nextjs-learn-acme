"use client";

import { GetCourseByIdQuery, useGetCourseByIdQuery } from "@/generated/graphql";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { NotEnrolledUserView } from "./_components/NotEnrolledUserView";
import { EnrolledUserView } from "./_components/EnrolledUserView";

// GraphQL-с буцаж ирэх хариултын төрлийг тодорхойлох (null болон undefined-г хассан төрөл)
type CourseById = NonNullable<GetCourseByIdQuery["getCourseById"]>;

// ExtendedCourse төрөл нь үндсэн CourseById дээр суурилж байна.
// Үүнийг бид өөрсдийн шаардлагад нийцүүлэн нэмэлт талбарууд болон массивын доторх
// null утгыг устгах замаар трансформ хийхэд ашиглана.
type ExtendedCourse = Omit<CourseById, "sectionId"> & {
  sectionId?: Array<{
    _id: string; // section ID (заавал байх утга)
    title: string; // section гарчиг (заавал байх утга)
    lessonId?: Array<{
      _id: string; // Хичээлийн ID
      title: string; // Хичээлийн гарчиг
      isPublished: boolean; // Хичээл нийтлэгдсэн эсэх
    }>;
  }>;
  whyChooseOurCourse?: Array<{
    icon?: keyof typeof import("lucide-react"); // Lucide icon-уудын түлхүүр
    title?: string; // Гарчиг
    description?: string; // Тайлбар
  }>;
};

export default function CourseDetailPage() {
  // URL-аас courseId-г авах
  const { courseId } = useParams();
  // Хэрэглэгчийн session мэдээллийг авах
  const { data: session } = useSession();

  // GraphQL query ашиглан курсийн мэдээлэл авах
  const { data, loading, error } = useGetCourseByIdQuery({
    variables: { id: courseId as string }, // courseId-г query-д дамжуулна
    skip: !courseId, // courseId байхгүй бол query-г алгасах
  });

  // Session-аас хэрэглэгчийн ID авах
  const loggedInUserId = session?.user?.id;

  // Ачаалалтай үеийн байдал
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="mr-2 h-6 w-6 animate-spin" />
        <span>Уншиж байна...</span>
      </div>
    );
  }

  // Алдааны байдал
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Хичээл ачааллахад алдаа гарлаа: {error.message}</p>
      </div>
    );
  }

  // Курсийн мэдээлэл олдохгүй бол
  if (!data?.getCourseById) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Курс олдсонгүй</p>
      </div>
    );
  }

  // API-с ирсэн өгөгдлийг ExtendedCourse төрөлтэй нийцүүлэхийн тулд трансформ хийх
  const course: ExtendedCourse = {
    ...data.getCourseById,
    sectionId: data.getCourseById.sectionId
      ?.filter((section) => section !== null) // null секцүүдийг устгах
      .map((section) => ({
        _id: section?._id, // ID нь заавал байх ёстой
        title: section?.title, // Гарчиг нь заавал байх ёстой
        lessonId: section?.lessonId
          ?.filter((lesson) => lesson !== null) // null хичээлийг устгах
          .map((lesson) => ({
            _id: lesson?._id, // Хичээлийн ID
            title: lesson?.title, // Хичээлийн гарчиг
            isPublished: lesson?.isPublished, // Нийтлэгдсэн эсэх
          })),
      })),
    whyChooseOurCourse: data.getCourseById.whyChooseOurCourse
      ?.filter((item) => item !== null) // null өгөгдлийг устгах
      .map((item) => ({
        icon: item?.icon as keyof typeof import("lucide-react"), // Icon-ийг Lucide-тэй тааруулах
        title: item?.title,
        description: item?.description,
      })),
  };

  // Курсэд бүртгэлтэй эсэхийг шалгах
  const userEnrolled = course.enrollmentId?.some(
    (enrollment) => enrollment?.userId?._id === loggedInUserId,
  );

  // Төлбөрийн хэсэг рүү гулсах функц
  const handleScrollToPayment = () => {
    const paymentSection = document.getElementById("payment");
    if (paymentSection) {
      paymentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Хэрэглэгч бүртгэлгүй бол NotEnrolledUserView-г үзүүлэх
  if (!userEnrolled) {
    return (
      <NotEnrolledUserView
        course={course} // ExtendedCourse өгөгдлийг дамжуулах
        onScrollToPayment={handleScrollToPayment} // Төлбөрийн хэсэг рүү гулсах функц дамжуулах
      />
    );
  }

  // Хэрэглэгч бүртгэлтэй бол EnrolledUserView-г үзүүлэх
  return <EnrolledUserView courseData={course} />;
}
