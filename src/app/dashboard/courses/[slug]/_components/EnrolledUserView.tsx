"use client";

import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
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
import {
  Course,
  Lesson,
  Section,
  useGetEnrollmentByUserAndCourseQuery,
  useMarkLessonAsCompletedMutation,
  useUndoLessonCompletionMutation,
} from "@/generated/graphql";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export function EnrolledUserView({ courseData }: { courseData: Course }) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLessonActionLoading, setLessonActionLoading] = useState(false);
  const { data: session } = useSession();

  const userId = session?.user?.id;

  const {
    data: enrollmentData,
    loading: enrollmentLoading,
    error: enrollmentError,
    refetch: enrollmentRefetch,
  } = useGetEnrollmentByUserAndCourseQuery({
    variables: {
      userId: userId || "",
      courseId: courseData._id || "",
    },
    skip: !userId || !courseData._id,
  });

  const [markLessonAsCompleted] = useMarkLessonAsCompletedMutation();
  const [undoLessonCompletion] = useUndoLessonCompletionMutation();

  // Дэлгэцийн өргөнийг шалгах
  useEffect(() => {
    function checkViewport() {
      setIsMobile(window.innerWidth < 760);
    }
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  if (enrollmentLoading) {
    return <LoadingOverlay />;
  }

  if (enrollmentError) {
    return <p>Алдаа: {enrollmentError.message}</p>;
  }

  if (!courseData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Курсийн мэдээлэл олдсонгүй.</p>
      </div>
    );
  }

  // Бүртгэл байгаа эсэхийг шалгах
  const enrollment = enrollmentData?.getEnrollmentByUserAndCourse;
  if (!enrollment) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Энэ хэрэглэгч энэ курст бүртгэлгүй байна.</p>
      </div>
    );
  }

  const handleMarkLessonAsCompleted = async (lessonId: string) => {
    if (!enrollment._id || !lessonId) return; // enrollment._id-г шалгах
    setLessonActionLoading(true);

    try {
      const response = await markLessonAsCompleted({
        variables: {
          input: {
            enrollmentId: enrollment._id,
            lessonId,
          },
        },
      });

      if (response.data?.markLessonAsCompleted) {
        toast.success("Lesson marked as completed");
        await enrollmentRefetch();
      }
    } catch {
      toast.error("Failed to mark lesson as completed");
    } finally {
      setLessonActionLoading(false);
    }
  };

  const handleUndoLessonCompletion = async (lessonId: string) => {
    if (!enrollment._id || !lessonId) return; // enrollment._id-г шалгах
    setLessonActionLoading(true);

    try {
      const response = await undoLessonCompletion({
        variables: {
          input: {
            enrollmentId: enrollment._id,
            lessonId,
          },
        },
      });

      if (response.data?.undoLessonCompletion) {
        toast.success("Lesson undone");
        await enrollmentRefetch();
      }
    } catch {
      toast.error("Failed to undo lesson completion");
    } finally {
      setLessonActionLoading(false);
    }
  };

  const progress = enrollment?.progress || 0;
  const completedLessons =
    enrollment?.completedLessons?.filter((id): id is string => id !== null) ||
    [];
  const allLessons =
    courseData?.sectionId?.flatMap((section) => section?.lessonId || []) || [];
  const totalLessons = allLessons.length;

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

  function handleSelectLesson(lesson: Lesson) {
    setSelectedLesson(lesson);
    if (isMobile) {
      setDrawerOpen(true);
    }
  }

  return (
    <main className="h-screen">
      {isMobile ? (
        <div className="px-4">
          {renderCourseInfo()}
          <SectionAccordion
            sections={courseData?.sectionId as Section[]}
            completedLessons={completedLessons}
            selectedLessonId={selectedLesson?._id}
            onSelectLesson={handleSelectLesson}
          />
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
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={30} minSize={35} maxSize={45}>
            <div className="h-full overflow-y-auto md:px-2">
              {renderCourseInfo()}
              <SectionAccordion
                sections={courseData?.sectionId as Section[]}
                completedLessons={completedLessons}
                selectedLessonId={selectedLesson?._id}
                onSelectLesson={handleSelectLesson}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle />
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
