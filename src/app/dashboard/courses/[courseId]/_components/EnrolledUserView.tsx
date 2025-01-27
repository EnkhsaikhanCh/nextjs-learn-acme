"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  useGetEnrollmentByUserAndCourseQuery,
  useGetLessonByIdQuery,
  useMarkLessonAsCompletedMutation,
  useUndoLessonCompletionMutation,
} from "@/generated/graphql";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CircleCheck, CircleDot, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Lesson {
  _id?: string;
  title?: string;
  isPublished?: boolean;
}

interface Section {
  _id?: string;
  title?: string;
  lessonId?: Lesson[];
}

interface CourseData {
  _id?: string;
  title?: string | null;
  sectionId?: Section[];
}

export function EnrolledUserView({ courseData }: { courseData: CourseData }) {
  console.log("Course Data:", courseData);

  const { data: session } = useSession();
  const userId = session?.user?.id;
  const courseId = courseData?._id;

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Fetch enrollment data using userId and courseId
  const {
    data: enrollmentData,
    loading: enrollmentLoading,
    error: enrollmentError,
    refetch: enrollmentRefetch,
  } = useGetEnrollmentByUserAndCourseQuery({
    variables: { userId: userId || "", courseId: courseId || "" },
    skip: !userId || !courseId,
  });

  // Fetch selected lesson details
  const {
    data: lessonData,
    loading: lessonLoading,
    error: lessonError,
  } = useGetLessonByIdQuery({
    variables: { getLessonByIdId: selectedLesson?._id || "" },
    skip: !selectedLesson?._id,
  });

  const [markLessonAsCompleted] = useMarkLessonAsCompletedMutation();
  const [undoLessonCompletion] = useUndoLessonCompletionMutation();

  if (!userId || !courseId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>User ID or Course ID is missing. Unable to load data.</p>
      </div>
    );
  }

  if (enrollmentLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading enrollment data...</p>
      </div>
    );
  }

  if (enrollmentError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Error loading enrollment: {enrollmentError.message}</p>
      </div>
    );
  }

  const enrollment = enrollmentData?.getEnrollmentByUserAndCourse;
  const progress = enrollment?.progress || 0;
  const completedLessons = enrollment?.completedLessons || [];

  const allLessons =
    courseData.sectionId?.flatMap((section) => section.lessonId || []) || [];

  const totalLessons = allLessons.length;

  const handleMarkLessonAsCompleted = async () => {
    if (!enrollment?._id || !selectedLesson?._id) return;

    try {
      const { data } = await markLessonAsCompleted({
        variables: {
          input: {
            enrollmentId: enrollment._id,
            lessonId: selectedLesson._id,
          },
        },
      });

      if (data?.markLessonAsCompleted) {
        console.log("Lesson marked as completed:", selectedLesson._id);
        toast.success("Lesson marked as completed");

        await enrollmentRefetch();
      }
    } catch (error) {
      const message = (error as Error).message;
      toast.error(`Failed to mark lesson as completed: ${message}`);
    }
  };

  // Undo a lesson completion
  const handleUndoLessonCompletion = async (lessonId: string) => {
    if (!enrollment?._id || !lessonId) return;

    try {
      const { data } = await undoLessonCompletion({
        variables: {
          input: {
            enrollmentId: enrollment._id,
            lessonId,
          },
        },
      });

      if (data?.undoLessonCompletion) {
        console.log("Lesson undone:", lessonId);
        toast.success("Lesson undone");

        await enrollmentRefetch();
      }
    } catch (error) {
      const message = (error as Error).message;
      toast.error(`Failed to undo lesson completion: ${message}`);
    }
  };

  const getEmbedUrl = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    return match
      ? `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1&showinfo=0`
      : url;
  };

  if (!courseData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Курсийн мэдээлэл олдсонгүй</p>
      </div>
    );
  }

  return (
    <main className="h-screen">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Left Panel: Sections and Lessons */}
        <ResizablePanel defaultSize={30} minSize={35} maxSize={45}>
          <div className="m-2 mb-2 rounded-md border-b bg-zinc-900 text-primary-foreground">
            <h1 className="p-4 text-2xl font-bold">{courseData.title}</h1>
          </div>
          <Card className="m-2 shadow-none">
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="w-full" />
              <p className="mt-2 text-center font-semibold">
                {Math.round(progress)}% Complete
              </p>
              <p className="mt-2 text-center text-sm text-gray-500">
                {completedLessons.length} of {totalLessons} lessons completed
              </p>
            </CardContent>
          </Card>

          {/* Section */}
          <Accordion type="multiple" className="p-4">
            <h2 className="mb-2 text-xl font-bold">Sections</h2>
            {courseData.sectionId?.map((section, index) => (
              <AccordionItem
                key={section._id || index}
                value={`section-${index}`}
                className="mb-2 rounded-lg border border-gray-200 bg-white px-4 shadow-sm"
              >
                <AccordionTrigger>
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {section.title}
                    </h2>
                    <p className="text-gray-500">
                      {section.lessonId?.length || 0} Lessons
                    </p>
                  </div>
                </AccordionTrigger>

                {/* Lessons */}
                <AccordionContent className="pb-4">
                  <div className="mt-2 space-y-3">
                    {section.lessonId?.map((lesson) => {
                      const isCompleted = completedLessons.includes(
                        lesson._id || "",
                      );
                      const isSelected = selectedLesson?._id === lesson._id;

                      return (
                        <div
                          key={lesson._id}
                          className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition ${
                            isSelected ? "bg-gray-100" : "hover:bg-gray-100"
                          }`}
                          onClick={() => setSelectedLesson(lesson)}
                        >
                          {/* Check Icon for Completed Lessons */}
                          {isCompleted ? (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-200">
                              <CircleCheck className="h-4 w-4 text-green-600" />
                            </div>
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-200">
                              <CircleDot className="h-4 w-4 text-yellow-500" />
                            </div>
                          )}
                          {/* Lesson Title */}
                          <div
                            className={`flex h-10 flex-1 items-center text-sm font-medium ${
                              isCompleted
                                ? "text-gray-600 line-through"
                                : "text-gray-800"
                            }`}
                          >
                            {lesson.title}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle />

        {/* Right Panel: Selected Lesson */}
        <ResizablePanel defaultSize={70} minSize={50} className="bg-gray-50">
          <div className="p-4">
            {selectedLesson ? (
              lessonLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <span>Loading lesson details...</span>
                  <Loader className="h-5 w-5 animate-spin" />
                </div>
              ) : lessonError ? (
                <p className="text-red-500">
                  Error loading lesson: {lessonError.message}
                </p>
              ) : (
                <>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>
                        {lessonData?.getLessonById?.title ||
                          selectedLesson.title}
                      </CardTitle>
                      <Button
                        onClick={
                          completedLessons.includes(selectedLesson?._id || "")
                            ? () =>
                                handleUndoLessonCompletion(
                                  selectedLesson?._id || "",
                                )
                            : handleMarkLessonAsCompleted
                        }
                        disabled={!selectedLesson}
                        variant={"outline"}
                        size={"sm"}
                        className={`font-semibold transition ${
                          completedLessons.includes(selectedLesson?._id || "")
                            ? "cursor-pointer border-green-500 bg-green-100 text-green-500 hover:bg-green-200 hover:text-green-600"
                            : "hover:border-green-600 hover:bg-green-100 hover:text-green-600"
                        }`}
                      >
                        {completedLessons.includes(selectedLesson?._id || "")
                          ? "Undo"
                          : "Mark as Done"}
                        <CircleCheck
                          className={`ml-2 h-4 w-4 ${
                            completedLessons.includes(selectedLesson?._id || "")
                              ? ""
                              : "text-green-600"
                          }`}
                        />
                      </Button>
                    </CardHeader>
                  </Card>
                  {lessonData && (
                    <iframe
                      src={getEmbedUrl(
                        lessonData?.getLessonById?.videoUrl || "",
                      )}
                      className="mt-2 aspect-video w-full rounded-lg"
                      allowFullScreen
                      allow="autoplay; encrypted-media"
                    />
                  )}
                </>
              )
            ) : (
              <p className="text-gray-500">No lesson selected</p>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
