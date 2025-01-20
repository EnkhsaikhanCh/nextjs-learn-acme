// src/app/admin/course-management/[courseId]/page.tsx

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetCourseByIdQuery } from "@/generated/graphql";
import { Loader } from "lucide-react";
import { toast, Toaster } from "sonner";
import { CourseInfo } from "./_components/CourseInfo";
import { SectionList } from "./_components/SectionList";
import { AddSectionForm } from "./_components/AddSectionForm";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const { data, loading, error, refetch } = useGetCourseByIdQuery({
    variables: { id: courseId as string },
    skip: !courseId,
  });

  if (!courseId) {
    return <div>No ID provided in the URL</div>;
  }

  if (Array.isArray(courseId)) {
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
    return <div>Error loading course data: {error.message}</div>;
  }

  if (!data?.getCourseById) {
    return <div>No data found</div>;
  }

  const course = data.getCourseById;

  return (
    <div className="">
      <Toaster richColors position="top-center" />
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Зүүн талын панель */}
        <ResizablePanel
          defaultSize={30}
          minSize={35}
          maxSize={50}
          className="mr-4 p-4 sm:w-full md:w-[30%] lg:w-[40%]"
        >
          <div className="">
            {/* Курсын үндсэн мэдээлэл */}
            <CourseInfo course={course} />

            {/* Section-ууд болон хичээлүүд */}
            <SectionList
              sections={course.sectionId || []}
              refetchCourse={refetch}
              // onLessonSelect={(lessonId) => setSelectedLesson(lessonId)} // Хичээл сонгох функц
            />

            {/* Section нэмэх хэсэг */}
            <AddSectionForm courseId={courseId} refetchCourse={refetch} />
          </div>
        </ResizablePanel>

        {/* Бариул */}
        <ResizableHandle />

        {/* Баруун талын панель */}
        <ResizablePanel
          defaultSize={70}
          minSize={50}
          className="bg-gray-50 sm:w-full md:w-[70%] lg:w-[60%]"
        >
          <div className="p-4">
            {selectedLesson ? (
              <div>
                <h2 className="text-lg font-semibold">Сонгогдсон Хичээл</h2>
                <p>Хичээлийн ID: {selectedLesson}</p>
                {/* Энд тухайн хичээлийн дэлгэрэнгүй мэдээллийг нэмнэ */}
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold">Dynamic Lesson</h2>
                <p>Хичээл сонгогдоогүй байна.</p>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
