// src/app/admin/course-management/[courseId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Course,
  Section,
  UpdateCourseInput,
  useGetCourseForUserQuery,
  useGetLessonByIdQuery,
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
import { LoadingScreen } from "@/components/LoadingScreen";
import CourseNotFound from "@/components/CourseNotFound";

export default function CourseDetailPage() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { slug } = useParams();

  const { data, loading, error, refetch } = useGetCourseForUserQuery({
    variables: { slug: slug as string },
  });

  const {
    data: fetchedLessonData,
    loading: fetchedLessonLoading,
    error: fetchedLessonError,
  } = useGetLessonByIdQuery({
    variables: { id: selectedLesson as string },
    skip: !selectedLesson,
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

      refetch();
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

  const handleLessonSelect = (lessonId: string) => {
    setSelectedLesson(lessonId);
    if (isMobile) {
      setDrawerOpen(true); // Mobile үед Drawer-г нээх
    }
  };

  if (loading) return <LoadingScreen label="Loading course details..." />;
  if (error?.graphQLErrors?.length) {
    const notFoundError = error.graphQLErrors.find((err) =>
      err.message.includes("Course not found"),
    );
    if (notFoundError) {
      return <CourseNotFound />;
    }
  }

  const courseForUser = data?.getCourseForUser;
  if (!courseForUser) return <CourseNotFound />;

  switch (data.getCourseForUser.status) {
    case "ADMIN_ENROLLED":
    case "ADMIN_NOT_ENROLLED":
      return (
        <div className="h-screen">
          {isMobile ? (
            <div>
              <div className="rounded-md p-4 shadow-sm">
                <CourseInfo
                  course={data?.getCourseForUser.fullContent as Course}
                  onEdit={handleEditCourse}
                />

                {/* Section-ууд болон хичээлүүд */}
                <SectionList
                  sections={
                    data.getCourseForUser.fullContent?.sectionId as Section[]
                  }
                  refetchCourse={refetch}
                  onLessonSelect={handleLessonSelect}
                />

                {/* Section нэмэх хэсэг */}
                <AddSectionForm
                  courseId={data.getCourseForUser.fullContent?._id || ""}
                  refetchCourse={refetch}
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
                        refetchCourse={refetch}
                        lessonId={selectedLesson}
                        title={fetchedLessonData?.getLessonById?.title}
                        videoUrl={
                          fetchedLessonData?.getLessonById?.videoUrl || ""
                        }
                        content={
                          fetchedLessonData?.getLessonById?.content || ""
                        }
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
                    course={data?.getCourseForUser.fullContent as Course}
                    onEdit={handleEditCourse}
                  />

                  {/* Section-ууд болон хичээлүүд */}
                  <SectionList
                    sections={
                      data.getCourseForUser.fullContent?.sectionId as Section[]
                    }
                    refetchCourse={refetch}
                    onLessonSelect={handleLessonSelect}
                  />

                  {/* Section нэмэх хэсэг */}
                  <AddSectionForm
                    courseId={data.getCourseForUser.fullContent?._id || ""}
                    refetchCourse={refetch}
                  />
                </div>
              </ResizablePanel>

              {/* Бариул */}
              <ResizableHandle />

              {/* Баруун талын панель */}
              <ResizablePanel defaultSize={70} minSize={50} className="">
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
                        refetchCourse={refetch}
                        lessonId={selectedLesson}
                        title={fetchedLessonData?.getLessonById?.title}
                        videoUrl={
                          fetchedLessonData?.getLessonById?.videoUrl || ""
                        }
                        content={
                          fetchedLessonData?.getLessonById?.content || ""
                        }
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

    default:
      return <div>Unhandled status</div>;
  }
}
