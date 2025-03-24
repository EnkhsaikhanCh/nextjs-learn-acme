// src/app/admin/course-management/[courseId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Course,
  Section,
  UpdateCourseInput,
  useGetCourseBySlugQuery,
  useGetLessonByIdQuery,
  useGetSectionsByCourseIdQuery,
  useUpdateCourseMutation,
} from "@/generated/graphql";
import { Loader } from "lucide-react";
import { toast } from "sonner";
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
import { LoadingOverlay } from "@/components/LoadingOverlay";

export default function CourseDetailPage() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { slug } = useParams();

  if (!slug) {
    return <div>Error</div>;
  }
  if (typeof slug !== "string") return null;

  const {
    data: courseData,
    loading: courseLoading,
    error: courseError,
    refetch: courseRefetch,
  } = useGetCourseBySlugQuery({
    variables: { slug: slug },
  });

  const courseId = courseData?.getCourseBySlug?._id as string;

  const {
    data: courseAllSectionsData,
    loading: courseAllSectionsLoading,
    // error: courseAllSectionsError,
    refetch: courseAllSectionsRefetch,
  } = useGetSectionsByCourseIdQuery({
    variables: { courseId: courseId },
    skip: !courseId,
  });

  const {
    data: fetchedLessonData,
    loading: fetchedLessonLoading,
    error: fetchedLessonError,
    // refetch: fetchedLessonRefetch,
  } = useGetLessonByIdQuery({
    variables: { id: selectedLesson || "" },
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

      // Filter only allowed fields
      let filteredFields = Object.fromEntries(
        Object.entries(updatedFields).filter(([key]) =>
          allowedFields.includes(key),
        ),
      ) as UpdateCourseInput;

      // Remove __typename recursively from objects
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const removeTypename = (obj: any): any => {
        if (Array.isArray(obj)) {
          return obj.map(removeTypename);
        } else if (obj !== null && typeof obj === "object") {
          const newObj = { ...obj };
          delete newObj.__typename;
          Object.keys(newObj).forEach((key) => {
            newObj[key] = removeTypename(newObj[key]);
          });
          return newObj;
        }
        return obj;
      };

      filteredFields = removeTypename(filteredFields);

      if (!filteredFields._id) {
        throw new Error("Course ID (_id) is required");
      }

      // Toast promise for loading and success/error messages
      const promise = updateCourse({
        variables: {
          input: filteredFields,
        },
      }).then(() => ({ name: filteredFields.title || "Course" }));

      await toast.promise(promise, {
        loading: "Updating course...",
        success: (data) => `${data.name} has been updated successfully!`,
        error: (error) => {
          console.error("GraphQL Update Course Error:", error);

          if (error.graphQLErrors?.length) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return error.graphQLErrors.map((e: any) => e.message).join(", ");
          }

          if (error.networkError) {
            return `Network error: ${error.networkError.message}`;
          }

          return "Error updating course.";
        },
      });

      // Refresh course data
      courseRefetch();
      courseAllSectionsRefetch();
    } catch (error) {
      console.error("Error in handleEditCourse:", error);
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

  if (courseLoading || courseAllSectionsLoading) {
    return <LoadingOverlay />;
  }

  if (courseError) {
    const errorMessage = courseError?.message || "Error loading course data.";

    toast.error(errorMessage);
    return <div>Error loading course data: {errorMessage}</div>;
  }

  if (!courseData?.getCourseBySlug) {
    return <div>No data found</div>;
  }

  const handleLessonSelect = (lessonId: string) => {
    setSelectedLesson(lessonId);
    if (isMobile) {
      setDrawerOpen(true); // Mobile үед Drawer-г нээх
    }
  };

  return (
    <div className="h-screen">
      {isMobile ? (
        <div>
          <div className="rounded-md p-4 shadow-sm">
            <CourseInfo
              course={courseData?.getCourseBySlug as Course}
              onEdit={handleEditCourse}
            />

            {/* Section-ууд болон хичээлүүд */}
            <SectionList
              sections={
                courseAllSectionsData?.getSectionsByCourseId as Section[]
              }
              refetchCourse={courseAllSectionsRefetch}
              onLessonSelect={handleLessonSelect}
            />

            {/* Section нэмэх хэсэг */}
            <AddSectionForm
              courseId={courseData.getCourseBySlug._id}
              refetchCourse={courseAllSectionsRefetch}
            />
          </div>

          {/* Drawer */}
          <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerContent className="p-4">
              <DrawerHeader>
                <DrawerTitle>Сонгогдсон Хичээл</DrawerTitle>
                <DrawerClose asChild>
                  <button className="absolute top-4 right-4">X</button>
                </DrawerClose>
              </DrawerHeader>
              <div>
                {selectedLesson ? (
                  <LessonDetail
                    refetchCourse={courseRefetch}
                    lessonId={selectedLesson}
                    title={fetchedLessonData?.getLessonById?.title}
                    videoUrl={fetchedLessonData?.getLessonById?.videoUrl || ""}
                    content={fetchedLessonData?.getLessonById?.content || ""}
                    isPublished={
                      fetchedLessonData?.getLessonById?.isPublished || false
                    }
                  />
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
              <CourseInfo
                course={courseData?.getCourseBySlug as Course}
                onEdit={handleEditCourse}
              />

              {/* Section-ууд болон хичээлүүд */}
              <SectionList
                sections={
                  (courseAllSectionsData?.getSectionsByCourseId as Section[]) ||
                  []
                }
                refetchCourse={courseAllSectionsRefetch}
                onLessonSelect={handleLessonSelect}
              />

              {/* Section нэмэх хэсэг */}
              <AddSectionForm
                courseId={courseData.getCourseBySlug._id}
                refetchCourse={courseAllSectionsRefetch}
              />
            </div>
          </ResizablePanel>

          {/* Бариул */}
          <ResizableHandle />

          {/* Баруун талын панель */}
          <ResizablePanel defaultSize={70} minSize={50} className="bg-gray-50">
            <div className="p-4">
              {selectedLesson ? (
                fetchedLessonLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="h-4 w-4 animate-spin" />
                    Loading lesson details...
                  </div>
                ) : fetchedLessonError ? (
                  <p>Error loading lesson: {fetchedLessonError.message}</p>
                ) : (
                  <LessonDetail
                    refetchCourse={courseRefetch}
                    lessonId={selectedLesson}
                    title={fetchedLessonData?.getLessonById?.title}
                    videoUrl={fetchedLessonData?.getLessonById?.videoUrl || ""}
                    content={fetchedLessonData?.getLessonById?.content || ""}
                    isPublished={
                      fetchedLessonData?.getLessonById?.isPublished || false
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
