"use client";

import { useEffect, useState } from "react";
import { ArrowDown, Loader, X } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { LessonViewer } from "./LessonViewer";
import { SectionAccordion } from "./SectionAccordion";
import { useEnrollmentData } from "@/hooks/useEnrollmentData";
import { Course, Lesson, Section } from "@/generated/graphql";
import { useGetSectionsByCourseId } from "@/hooks/useGetSectionsByCourseId";
import { Button } from "@/components/ui/button";

export function EnrolledUserView({ courseData }: { courseData: Course }) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Элсэлтийн мэдээлэл татах hook
  const {
    userId,
    enrollmentData,
    enrollmentLoading,
    enrollmentError,
    isLessonActionLoading,
    handleMarkLessonAsCompleted,
    handleUndoLessonCompletion,
  } = useEnrollmentData({ courseId: courseData?._id });

  const {
    courseAllSectionsData,
    courseAllSectionsLoading,
    courseAllSectionsError,
    courseAllSectionsRefetch,
  } = useGetSectionsByCourseId({ courseId: courseData?._id });

  // Дэлгэцийн өргөнийг шалгах
  useEffect(() => {
    function checkViewport() {
      setIsMobile(window.innerWidth < 760);
    }
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  if (!courseData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Курсийн мэдээлэл олдсонгүй.</p>
      </div>
    );
  }

  if (!userId || !courseData?._id) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>User ID болон Course ID дутуу байна.</p>
      </div>
    );
  }

  if (enrollmentLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="animate-spin" />
        <p className="ml-2">Loading enrollment data...</p>
      </div>
    );
  }

  if (enrollmentError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">
          Error loading enrollment: {enrollmentError.message}
        </p>
      </div>
    );
  }

  const enrollment = enrollmentData?.getEnrollmentByUserAndCourse;
  const progress = enrollment?.progress || 0;
  const completedLessons = enrollment?.completedLessons || [];

  const allLessons =
    courseAllSectionsData?.getSectionsByCourseId?.flatMap(
      (section) => section?.lessonId || [],
    ) || [];

  const totalLessons = allLessons.length;

  // Урт кодыг "CourseHeader" мэт жижиг компонент болгон мөн салгаж болно
  function renderCourseInfo() {
    return (
      <section className="my-4 flex flex-col gap-2">
        <div className="rounded-md border-b bg-zinc-900 text-primary-foreground">
          <h1 className="p-4 text-base font-bold md:text-xl lg:text-2xl">
            {courseData.title}
          </h1>
        </div>
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-center md:text-xl lg:text-2xl">
              Course Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-4 w-full" />
            <p className="mt-2 text-center text-sm font-semibold md:text-base">
              {Math.round(progress)}% Complete
            </p>
            <p className="mt-2 text-center text-sm text-gray-500">
              {completedLessons.length} of {totalLessons} lessons completed
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Тухайн хичээл дээр дархад Drawer эсвэл Resizable Panel дээр дэлгэцэнд гаргана
  function handleSelectLesson(lesson: Lesson) {
    setSelectedLesson(lesson);
    if (isMobile) {
      setDrawerOpen(true);
    }
  }

  return (
    <main className="h-screen">
      {isMobile ? (
        // --------------------
        // MOBILE ХУВИЛБАР
        // --------------------
        <div className="px-4">
          {renderCourseInfo()}
          <SectionAccordion
            sections={courseAllSectionsData?.getSectionsByCourseId as Section[]}
            completedLessons={completedLessons}
            selectedLessonId={selectedLesson?._id}
            onSelectLesson={handleSelectLesson}
          />
          {/* Mobile-д iframe Drawer ашиглах */}
          <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="text-base font-semibold text-gray-600">
                  Selected Lesson
                </DrawerTitle>
              </DrawerHeader>
              <div className="px-4 pb-4">
                <LessonViewer
                  lessonId={selectedLesson?._id}
                  lessonTitle={selectedLesson?.title}
                  completedLessons={completedLessons}
                  onMarkComplete={() =>
                    selectedLesson?._id &&
                    handleMarkLessonAsCompleted(selectedLesson._id)
                  }
                  isLessonActionLoading={isLessonActionLoading}
                  onUndo={() =>
                    selectedLesson?._id &&
                    handleUndoLessonCompletion(selectedLesson._id)
                  }
                />
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline" className="font-semibold">
                    Буцах <ArrowDown />
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      ) : (
        // --------------------
        // DESKTOP ХУВИЛБАР
        // --------------------
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Зүүн талд: Секшн + Хичээлүүд */}
          <ResizablePanel defaultSize={30} minSize={35} maxSize={45}>
            <div className="h-full overflow-y-auto md:px-2">
              {renderCourseInfo()}
              <SectionAccordion
                sections={
                  courseAllSectionsData?.getSectionsByCourseId as Section[]
                }
                completedLessons={completedLessons}
                selectedLessonId={selectedLesson?._id}
                onSelectLesson={handleSelectLesson}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Баруун талд: Сонгосон хичээл */}
          <ResizablePanel defaultSize={70} minSize={50} className="bg-gray-50">
            <div className="h-full overflow-y-auto p-4">
              <LessonViewer
                lessonId={selectedLesson?._id}
                lessonTitle={selectedLesson?.title}
                completedLessons={completedLessons}
                onMarkComplete={() =>
                  selectedLesson?._id &&
                  handleMarkLessonAsCompleted(selectedLesson._id)
                }
                isLessonActionLoading={isLessonActionLoading}
                onUndo={() =>
                  selectedLesson?._id &&
                  handleUndoLessonCompletion(selectedLesson._id)
                }
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </main>
  );
}
