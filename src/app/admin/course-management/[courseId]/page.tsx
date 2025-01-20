"use client";
import { useParams } from "next/navigation";
import { useGetCourseByIdQuery } from "@/generated/graphql";
import { Loader } from "lucide-react";
import { toast, Toaster } from "sonner";
import { CourseInfo } from "./_components/CourseInfo";
import { SectionList } from "./_components/SectionList";
import { AddSectionForm } from "./_components/AddSectionForm";

export default function CourseDetailPage() {
  const { courseId } = useParams();

  const { data, loading, error, refetch } = useGetCourseByIdQuery({
    variables: { id: courseId as string },
    skip: !courseId,
  });

  if (!courseId) {
    return <div>No ID provided in the URL</div>;
  }

  if (!courseId || Array.isArray(courseId)) {
    return <div>Invalid Course ID</div>;
  }

  if (loading) {
    return (
      <div className="mt-2 flex items-center gap-2">
        <Loader className="h-4 w-4 animate-spin" /> Loading...
      </div>
    );
  }

  if (error) {
    toast.error(error.message || "Error Loading Course");
    const message = (error as Error).message;
    return <div>Error loading course data: {message}</div>;
  }

  if (!data?.getCourseById) {
    return <div>No data found</div>;
  }

  const course = data.getCourseById;

  return (
    <div className="p-4">
      <Toaster richColors position="top-center" />

      {/* Курсын үндсэн мэдээлэл, статистикууд */}
      <CourseInfo course={course} />

      {/* Section-ууд болон тэдгээрийн lesson-үүд */}
      <SectionList sections={course.sectionId || []} refetchCourse={refetch} />

      {/* Section нэмэх хэсэг */}
      <AddSectionForm courseId={courseId} refetchCourse={refetch} />
    </div>
  );
}
