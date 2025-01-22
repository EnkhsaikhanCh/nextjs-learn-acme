// src/app/admin/course-management/[courseId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  UpdateCourseInput,
  useGetCourseByIdQuery,
  useGetLessonByIdQuery,
  useUpdateCourseMutation,
} from "@/generated/graphql";
import { Loader } from "lucide-react";
import { toast, Toaster } from "sonner";
import { CourseInfo } from "./_components/CourseInfo";
import { SectionList } from "./_components/SectionList";
import { AddSectionForm } from "./_components/AddSectionForm";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { LessonDetail } from "./_components/lesson/LessonDetail";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { data, loading, error, refetch } = useGetCourseByIdQuery({
    variables: { id: courseId as string },
    skip: !courseId,
  });

  const {
    data: lessonData,
    loading: lessonLoading,
    error: lessonError,
  } = useGetLessonByIdQuery({
    variables: { getLessonByIdId: selectedLesson || "" },
    skip: !selectedLesson, // selectedLesson байхгүй үед query хийхгүй
  });

  const [updateCourse] = useUpdateCourseMutation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditCourse = async (updatedFields: any) => {
    try {
      const allowedFields = [
        "_id",
        "title",
        "description",
        "price",
        "duration",
        "createdBy",
        "categories",
        "tags",
        "status",
        "thumbnail",
      ];

      const filteredFields = Object.fromEntries(
        Object.entries(updatedFields).filter(([key]) =>
          allowedFields.includes(key),
        ),
      ) as UpdateCourseInput;

      // Баталгаажуулах
      if (!filteredFields._id) {
        throw new Error("Course ID (_id) is required");
      }

      // Toast-д ашиглах амлалт
      const promise = updateCourse({
        variables: {
          input: filteredFields,
        },
      }).then(() => ({ name: filteredFields.title || "Course" }));

      // Toast ашиглах
      await toast.promise(promise, {
        loading: "Updating course...",
        success: (data) => `${data.name} has been updated successfully!`,
        error: (error) => {
          const message =
            error.response?.data?.message || "Error updating course.";
          return message;
        },
      });

      // Шинэчлэх
      refetch();
    } catch (error) {
      toast.error(`Error updating course: ${(error as Error).message}`);
    }
  };

  // Mobile эсэхийг шалгах (Tailwind breakpoints ашиглана)
  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < 768); // md breakpoint-ээс доош бол mobile
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  if (!courseId) {
    return <div>No ID provided in the URL</div>;
  }

  if (Array.isArray(courseId)) {
    return <div>Invalid Course ID</div>;
  }

  if (loading) {
    return (
      <div className="mt-2 flex h-full items-center justify-center gap-2">
        <Loader className="h-4 w-4 animate-spin" />
        <div>Loading...</div>
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

  const handleLessonSelect = (lessonId: string) => {
    setSelectedLesson(lessonId);
    if (isMobile) {
      setDrawerOpen(true); // Mobile үед Drawer-г нээх
    }
  };

  return (
    <div className="h-screen">
      <Toaster richColors position="top-center" />
      {isMobile ? (
        // Mobile: Drawer ашиглана
        <div>
          <div className="rounded-md p-4 shadow">
            {/* Курсын үндсэн мэдээлэл */}
            <CourseInfo course={course} onEdit={handleEditCourse} />

            {/* Section-ууд болон хичээлүүд */}
            <SectionList
              sections={course.sectionId || []}
              refetchCourse={refetch}
              onLessonSelect={handleLessonSelect}
            />

            {/* Section нэмэх хэсэг */}
            <AddSectionForm courseId={courseId} refetchCourse={refetch} />
          </div>

          {/* Drawer */}
          <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerContent className="p-4">
              <DrawerHeader>
                <DrawerTitle>Сонгогдсон Хичээл</DrawerTitle>
                <DrawerClose asChild>
                  <button className="absolute right-4 top-4">X</button>
                </DrawerClose>
              </DrawerHeader>
              <div>
                {selectedLesson ? (
                  <div>
                    <h2 className="text-lg font-semibold">
                      Хичээлийн ID: {selectedLesson}
                    </h2>
                    <p>Энд хичээлийн дэлгэрэнгүй мэдээлэл гарч ирнэ.</p>
                  </div>
                ) : (
                  <p>Ямар нэг хичээл сонгогдоогүй байна.</p>
                )}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      ) : (
        // Desktop: ResizablePanel ашиглана
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Зүүн талын панель */}
          <ResizablePanel defaultSize={30} minSize={35} maxSize={45}>
            <div className="h-full overflow-y-auto p-4">
              {/* Курсын үндсэн мэдээлэл */}
              <CourseInfo course={course} onEdit={handleEditCourse} />

              {/* Section-ууд болон хичээлүүд */}
              <SectionList
                sections={course.sectionId || []}
                refetchCourse={refetch}
                onLessonSelect={handleLessonSelect}
              />

              {/* Section нэмэх хэсэг */}
              <AddSectionForm courseId={courseId} refetchCourse={refetch} />
            </div>
          </ResizablePanel>

          {/* Бариул */}
          <ResizableHandle />

          {/* Баруун талын панель */}
          <ResizablePanel defaultSize={70} minSize={50} className="bg-gray-50">
            <div className="p-4">
              {selectedLesson ? (
                lessonLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    Loading lesson details...
                  </div>
                ) : lessonError ? (
                  <p>Error loading lesson: {lessonError.message}</p>
                ) : (
                  <LessonDetail
                    title={lessonData?.getLessonById?.title}
                    videoUrl={lessonData?.getLessonById?.videoUrl || ""}
                    content={lessonData?.getLessonById?.content || ""}
                    isPublished={
                      lessonData?.getLessonById?.isPublished || false
                    }
                  />
                )
              ) : (
                <p>Ямар нэг хичээл сонгогдоогүй байна.</p>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
